define(['backbone.joint', 'util/csrftoken', 'util/date','util/platform'], function (Joint, csrftoken, udate,Platform) {
    window['MovieData'] = {
        data: {},
        set: function (k, v) {
            this.data[k] = JSON.stringify(v);
        }
    };

    var origXhr = $.ajaxSettings.xhr;
    var _ = Joint._;
    var idPathFunc=function(id){
        var arr=id.split("").reverse();
        return arr[0];
        //return arr[1]+'/'+arr[0]; 
    };
    var MovieData = Joint.ViewModel.extend({
        },
        {

            // 获取指定影院信息
            loadCinemaContent: function (platformId, cinemaId) {
                return loadInfo('cinemas/public/' +platformId+ '/info_public_cinema_' + platformId + '_' + cinemaId + '.json').then(function(cinema) {
                    return cinema;
                });
            },

            loadMovieSpot: function (platformId) {
                return loadInfo('movies/public/' + platformId + '/movies_will_' + platformId + '.json').then(function(movies) {
                    return movies;
                })
            },

            loadUnPayOrder:function(platformId){
                // 未支付订单
                var url = 'http://cgi.wxmovie.com/cgi-bin/order/unpaymentQuery?temp_d=' + new Date().getTime();
                return MovieData.setupAjaxCross().then(function () {
                    return $.post(url, { "openId": MovieData.session.openid,"publicSignalShort": platformId}, 'json'); //, 'json'
                }).then(function (data) {
                        if(data&&data.ret=="0"){
                            return data.data;
                        }else{
                            Joint.Deferred.resolve([]);
                        }
                    }, function () {
                        return Joint.Deferred.resolve([]);
                    });
            },

            loadOrder:function(platformId){
                // 支付订单
                var url = 'http://cgi.wxmovie.com/cgi-bin/order/query?temp_d=' + new Date().getTime();
                return MovieData.setupAjaxCross().then(function () {
                    return $.post(url, { "page": "1", "num": "50", "openId": MovieData.session.openid,"publicSignalShort": platformId}, 'json'); //, 'json'
                }).then(function (data) {
                        if(data&&data.ret=="0"){
                            return data.data;
                        }else{
                            Joint.Deferred.resolve([]);
                        }
                    }, function () {
                        return Joint.Deferred.resolve([]);
                    });
            },
            ////add by jackey end

            //add by jcw
            // 获取所有影院列表
            loadCinemalist: function (platformId) {
                //debugger;
                var t=platformId;
                if(t=='fyyc'){
                    t=t+'_new';
                }
                return loadInfo('cinemas/public/'+platformId+'/cinemas_public_'+t+'.json').then(function(cinema) {
                    return cinema;
                });
            },





            // 获取指定影院信息
            loadCinema: function (cinemaId) {

                //debugger;
                return loadInfo('cinemas/' + cinemaId % 100 + '/info_cinema_' + cinemaId + '.json').then(function(cinema) {
                    var is = inspectCinema(cinema);
                    if(is.IGNORE_GROUPON || is.IGNORE_ALL) {
                        cinema.groupon_tickets = [];
                    }
                    if(is.IGNORE_SEAT || is.IGNORE_ALL) {
                        cinema.tickets = _.filter(cinema.tickets, function(ticket) {
                            return ticket.is_seat == 0;
                        });
                    }

                    return cinema;
                });
            },
            // 获取指定电影信息  jcw
            loadMovie: function (movieId) {
                //'/movies/' . $mod_id(取影片最后一位) . '/''info_movie_' . $movie_id  .'.json'; 
                return loadInfo('movies/' + movieId.toString().substring(movieId.toString().length-1) + '/info_movie_' + movieId + '.json');
            },
            // 获取指定城市的电影列表 jcw
            loadMovieByCity: function (platformId) {
                ///movies/public/'. $public. '/''movies_public_' . $public . '.json'; 
                return loadInfo("movies/public/" + platformId + "/movies_public_" + platformId + ".json");
            },
            // 获取指定城市影院列表
            loadCinemaByCity: function (cityId) {
                return loadInfo("cinemas/cities/" + cityId + "/cinemas_city_" + cityId + ".json");
            },
            // 获取指定城市指定电影排期
            loadMovieScheByCity: function (cityId, movieId) {
                var name = "sched_city_movie_" + cityId + "_" + movieId;
                return load(name, "movies/cities/" + cityId + "/" + name + ".json");
            },
            // 获取指定城市指定影院排期  jcw
            loadCinemaScheByCity: function (platformId, cinemaId) {
                //'/cinemas/public/' .$public . '/''sched_public_cinema_' . $public . '_' . $cinema_id .'.json'; 
                var name = "sched_public_cinema_" + platformId + "_" + cinemaId;
                return load(name, "cinemas/public/" + platformId + "/" + name + ".json");
            },
            //add by jcw
            getScheduleList: function(platformId,cityId, cinemaId, movieId) {
                return MovieData.filterSchedule(platformId,cityId, cinemaId, movieId, {
                    group: true,
                    loadMovieInfo: true
                });
            },
            //add by jcw
            // 拉排期，过滤电影，展开版本
            filterSchedule: _.memoize(function (platformId,cityId, cinemaId, movie, _option) {
                var option = _.extend({
                    dayBegin: udate.dayBegin,
                    group: false,//是否按时间段分组
                    loadMovieInfo: false//是否读单个电影信息
                }, _option);

                var store = {};
                var today = new udate(new Date());
                return Joint.Deferred.when(
                        //获取指定城市，指定影院排期
                        MovieData.loadCinemaScheByCity(platformId,cinemaId),
                        //获取指定城市的电影列表
                        MovieData.loadMovieByCity(platformId)
                    ).then(function (movies, cityMovies) {
                        store.cityMovies = cityMovies;
                        if (_.isFunction(movie)) {
                            return _.filter(movies, movie);
                        } else if (!movie) {
                            return movies;
                        } else {
                            if (_.isString(movie)) {
                                movie = {
                                    id: movie
                                };
                            }
                            return _.where(movies, movie);
                        }
                    }).then(function (movies) {
                        return option.loadMovieInfo ? loadMovieInfo() : movies;

                        function loadMovieInfo() {
                            return Joint.Deferred.when.apply(null, _.map(movies, function(movie) {
                                    return MovieData.loadMovie(movie.id);
                                })).then(function() {
                                    store.infos = {};
                                    _.each(arguments, function(info) {
                                        store.infos[info.id] = info;
                                    });

                                    return movies;
                                });
                        }
                    }).then(function (movies) {
                        return _.chain(movies).map(function (_movie) {
                            var movie = JSON.parse(JSON.stringify(_movie));
                            var cMovie = _.findWhere(store.cityMovies, {id: movie.id});
                            movie.score = cMovie ? cMovie.score : 0;
                            movie.index = _.indexOf(store.cityMovies, cMovie);
                            if(option.loadMovieInfo) {
                                movie.info = store.infos[movie.id];
                            }


                            //<editor-fold desc="展开版本">
                            _.each(movie.sche, function (versions, date) {
                                if (date < today.getYmd()) {
                                    delete movie.sche[date];
                                    return;
                                }
                                var showtimes = [];
                                _.each(versions, function (version, k) {
                                    _.each(version.seat_info, function (mp) {
                                        if (date == today.getYmd() && mp.time < today.getHms()) return;
                                        if(option.loadMovieInfo) {
                                            mp.end = parseInt(movie.info.longs) || 0;
                                            if(mp.end < 5) {
                                                mp.end = 120;
                                            }
                                            mp.end = udate.timeOffset(mp.time, mp.end);
                                            mp.endAtNextDay = mp.end < mp.time;
                                        }
                                        showtimes.push({
                                            mpid: mp.mpid,
                                            mp: mp,
                                            date: date,
                                            version: version,
                                            movie: movie
                                        });
                                    });

                                    delete version.seat_info;
                                });

                                movie.sche[date] = _.sortBy(showtimes, function (showtime) {
                                    return (showtime.mp.nextday ? 'z' : 'a') + showtime.mp.time
                                });
                            });
                            //</editor-fold>

                            //将06:00的排期加入到昨天去
                            if (option.dayBegin) {
                                //Time Warp
                                adjustDayBegin(movie.sche, option.dayBegin);
                            }

                            return movie;
                        }).map(function (movie) {
                                _.each(movie.sche, function (showtimes, date) {
                                    if (showtimes.length === 0) {
                                        delete movie.sche[date];
                                    }
                                });

                                return movie;
                            }).filter(function (movie) {
                                return _.keys(movie.sche).length > 0;
                            }).sortBy('index').tap(function(movieSches) {
                                if(!option.group) return;

                                _.each(movieSches, function (movie) {
                                    _.each(movie.sche, function (showtimes, date) {
                                        movie.sche[date] = _.groupBy(showtimes, function (showtime) {
                                            switch (true) {
                                                case showtime.mp.time > '18:00' || showtime.mp.nextday:
                                                    return 'moon';
                                                case showtime.mp.time < '12:00':
                                                    return 'am';
                                                default:
                                                    return 'pm';
                                            }
                                        });
                                    });
                                });
                            }).value();
                    });

                function adjustDayBegin(sche, dayBegin) {
                    var leftover = [];
                    _.each(sche, function (_showtimes, date) {
                        var showtimes = _.filter(_showtimes, function (showtime, k) {
                            showtime.mp.date = date;
                            if (showtime.mp.time < dayBegin) {
                                showtime.mp.nextday = true;
                                leftover.push(showtime);
                                return false;
                            } else {
                                return true;
                            }
                        });

                        sche[date] = showtimes;

                        if (leftover.length > 0) {
                            var lastDate = udate.byYmdStr(date).offset(-86400000).getYmd();
                            _.each(leftover, function (showtime) {
                                sche[lastDate] ? sche[lastDate].push(showtime) : sche[lastDate] = [showtime];
                            });
                        }
                        leftover = [];
                    });

                    //调整后排期可能超过3天，删之
                    var now = new udate(new Date());
                    var dayafter = new udate(new Date(Date.now() + 2 * 86400 * 1000));
                    if(now.getHms() < dayBegin) {
                        delete sche[dayafter.getYmd()];
                    }
                }//end adjustDayBegin
            }, function() {//memoize hash function
                return JSON.stringify(_.toArray(arguments));
            }),//end memoize function filterSchedule

            getAvailable: function (cityId, cinemaId, movieId) {
                return Joint.Deferred.when(
                        MovieData.filterSchedule(cityId, cinemaId, movieId).then(null, function() { return Joint.Deferred.resolve([]); }),
                        MovieData.loadCinema(cinemaId))
                    .then(function(movieSches, cinemaInfo) {
                        var is = inspectCinema(cinemaInfo);

                        if(is.IGNORE_ALL) {
                            return {};
                        }

                        var result = {
                            ticket: (!is.IGNORE_ELEC && _.any(cinemaInfo.tickets, function (ticket) {
                                return ticket.is_seat == 0 && ticket.type == 2 && ticket.flag_for_app == 1;
                            })) || (!is.IGNORE_GROUPON && cinemaInfo.groupon_tickets.length > 0),
                            seat: !is.IGNORE_SEAT && _.any(movieSches, function (movieSche) {
                                return _.size(movieSche.sche) > 0;
                            })
                        };

                        if(result.ticket) {
                            result.ticket = mkUri(["#buy", cinemaId]);
                        }

                        if(result.seat) {
                            result.seat = mkUri(["#movie_scheduler", cinemaId]);
                        }

                        return result;

                        function mkUri(href) {
                            if (movieId) {
                                href.push(movieId);
                            }
                            return href.join('-');
                        }
                    });
            },
            inspectCinema: inspectCinema,

            loadInfo: loadInfo,
            load: load,
            crossAjax: crossAjax,
            setupAjaxCross: setupAjaxCross,
            setupAjaxDefault: setupAjaxDefault,
            loadJs: _loadJs,

            getCinemaShoppingHistory: function (cityId) {
                // 调用CGI获取用户订单记录
                // 提取所有订单相关影城并去重
                // 返回数据(数组)
                var url = 'http://cgi.wxmovie.com/cgi-bin/dianying/wx/qry_recent_order_wx.fcg?temp_d=' + new Date().getTime();
                return MovieData.setupAjaxCross().then(function () {
                    return $.post(url, { "page": "1", "num": "30", "city": cityId, "sCmd": "QRY_CITY_CINEMA" }, 'json'); //, 'json'
                }).then(function (data) {
                        return data;
                    }, function () {
                        return Joint.Deferred.resolve({});
                    });
            },
            getAboutCinemaList: function (cityId, distance, latitude, longitude, filttype, pagesize) {
                //通过城市，附件范围（单位：米），纬度latitude,经度longitude  查询附件的影院
                /*
                 weimovie_nearby.fcg?city_id=11&lon=116.32323&lat=90.03232&distance=1234&count=12&desc=0&type=0&sche=0
                 city_id ，城市id
                 lon， 经度，例如116.32323
                 lat， 纬度，例如90.03232
                 distance， 距离，单位m【distacnce=-1表示不限制距离~ 】
                 count， 数量
                 desc，是否降序【desc=1表示距离大放前面；desc=0表示距离小的放前面】
                 sche，是否要有排期【sche=0表示不限制一定要有排期，sche=1表示一定要有排期】
                 type，要筛选的影院类型【type=0  所有影院，type=1 两者有其一， type=2 有订座，type=3 有团购，type=4 两者都有】
                 返回:
                 ret=0&sub=0&data=array&total_row=5&msg=xxx
                 data元素说明：
                 cinema_id=12121&distance=1245（单位米）
                 ret=0表示无异常
                 ret非0，表示异常
                 */
                //如果经纬度不存在直接返回空数据
                if(!latitude||!longitude){return Joint.Deferred.resolve({});}
                var url = 'http://cgi.wxmovie.com/cgi-bin/dianying/wx/weimovie_nearby.fcg?temp_d=' + new Date().getTime();
                return MovieData.setupAjaxCross().then(function () {
                    return $.post(url, { "city_id": cityId, "lon": longitude, "lat": latitude, "distance":distance
                        ,"count":pagesize,"desc":0,"type":filttype  }, 'json'); //, 'json'
                }).then(function (data) {
                        if(data&&data.ret=="0"){
                            return data;
                        }else{
                            Joint.Deferred.resolve({});
                        }
                    }, function () {
                        return Joint.Deferred.resolve({});
                    });
            },
            //获取万达订单信息
            getwandaOrderinfo: function (snid,showId,sTicketID,locksource) {
                if (snid==0) {return Joint.Deferred.resolve({});}
                //sCmd=order&snid=20140321120410010009&showId=20140310104514847009_161&snin=cgcgcg
                var url = 'http://cgi.wxmovie.com/cgi-bin/dianying/wx/weimovie_wandaorderinfo.fcg?remark=' + new Date().getTime();
                return MovieData.setupAjaxCross().then(function () {
                    return $.post(url, { "sCmd":"order","snid": snid,"showId":showId,"snin":"cgcgcg","sTicketID":sTicketID,"locksource":locksource}, 'json'); //, 'json'
                }).then(function (data) {
                        if(data&&data.ret=="0"){
                            return data;
                        }else{
                            Joint.Deferred.resolve({});
                        }
                    }, function () {
                        return Joint.Deferred.resolve({});
                    });
            },
            getCinemaByCityAndMovie: function (cityId,cinemaId, movieId) {
                var dfrs = [MovieData.loadCinemaByCity(cityId)];
                if (movieId) {
                    dfrs.push(MovieData.getScheCinemaWithMovie(cityId, movieId));
                }
                return Joint.Deferred.when.apply(Joint.Deferred, dfrs).then(function (cinemaList, cinemaWithSche) {
                    var availableCinemas = {};
                    if (cinemaId) {
                        for(var itemp=0;itemp<cinemaList.length;itemp++){
                            if(cinemaList[itemp]&&cinemaList[itemp].id&&cinemaList[itemp].id==cinemaId){
                                availableCinemas[cinemaList[itemp].area_name] = [];
                                break;
                            }
                        }
                    }

                    _.each(cinemaList, function (info) {
                        if(false === filterCinema(info)) return;

                        info.sortbystr = info.flag_seat_ticket == 1 ? 0 : 1;

                        var cinemaOnSale = (info.flag_seat_ticket == 1 || info.flag_groupon == 1 || info.flag_elec_ticket == 1); // 当前影城已签约
                        var cinameHasSche = !cinemaWithSche || !!_.findWhere(cinemaWithSche, {id: info.id}); // 当前影城有排期
                        // 检查影院是否有该电影票在售
                        if (cinemaOnSale && cinameHasSche) {
                            // 默认可以去购券
                            info.buyType = 'canBuyTicket';
                            // 如果有订票则优先去选订座排期
                            if (info.flag_seat_ticket == 1) {
                                info.buyType = 'canBuySeat';
                            }

                            // 把影院信息填入相应的区县栈
                            var areaName = info.area_name;
                            if (typeof (availableCinemas[areaName]) === 'undefined') {
                                availableCinemas[areaName] = []; // 相应区县栈没有定义时初始化一个空数组
                            }
                            var hit = _.find(cinemaWithSche, function (cinema) {
                                return cinema.id == info.id;
                            });

                            if (hit) {
                                info['allCount'] = hit.allCount;
                                info['count_movie'] = hit.count;
                            } else {
                                info["allCount"] = cinemaWithSche ? false : true;
                                info["count_movie"] = 0;
                            }

                            if(info.id==cinemaId){
                                info.sortbystr=-2;
                            }

                            availableCinemas[areaName].push(info);
                        }
                    });
                    /*
                     _.each(availableCinemas, function (ac,i) {
                     availableCinemas[i]=_.sortBy(ac,"sortbystr");
                     });
                     */
                    return availableCinemas;
                });
            },

            // 获取指定城市包含指定影片上映情况的影院列表
            getScheCinemaWithMovie: function (cityId, movieId) {
                var iswill=movieId.toString().indexOf("will")!=-1?true:false;
                if (iswill) {movieId=movieId.substring(4);}
                return MovieData.loadMovieScheByCity(cityId, movieId).then(function (movieSche) {
                    return _.map(movieSche, function (data) {
                        //debugger;
                        var now = new udate(new Date());
                        var t_now = now.getHms();
                        var t_l=udate.getDayStr();
                        var maxAvailableCount = _.max(_.map(data.sche[now.getYmd()], function (t) {
                            return _.filter(t.time.split('|'),function (d) {
                                return t_now < d + ':00';
                            }).length;
                        }));
                        if (!maxAvailableCount&&iswill) {
                            maxAvailableCount = _.max(_.map(data.sche[t_l[1]], function (t) {
                                return _.filter(t.time.split('|'),function (d) {
                                    return t_now < d + ':00';
                                }).length;
                            }));
                            if(!maxAvailableCount){
                                maxAvailableCount = _.max(_.map(data.sche[t_l[2]], function (t) {
                                    return _.filter(t.time.split('|'),function (d) {
                                        return t_now < d + ':00';
                                    }).length;
                                }));
                            }
                        };
                        var iscinema_time = maxAvailableCount >= 0;
                        maxAvailableCount = maxAvailableCount < 0 ? 0 : maxAvailableCount;
                        return {
                            'id': data.id,
                            'count': maxAvailableCount,
                            'allCount': iscinema_time
                        };
                    });
                });
            },

            getMovieName: function (iMovieId) {
                return MovieData.loadMovie(iMovieId).then(function (movieInfo) {
                    return movieInfo.name;
                });
            },

            getDiscount: function() {
                return setupAjaxCross().then(function() {
                    return Joint.$.getJSON('http://cgi.wxmovie.com/cgi-bin/dianying/wx/weimovie_activitycheck.fcg?activity_id=1')
                }).then(function(o) {
                        return o.ret == 0 && o.result == 1 ? 1000 : false;//写死减10块
                    }, function() {
                        return Joint.Deferred.resolve(false);
                    });
            },
            getMoreMovieList: function(vid,type,isRUN) {
                //isRUN=false 直接返回空数据
                if(!isRUN){return Joint.Deferred.resolve({});}
                var url=""
                if(type==1)//ios
                {
                    url='http://live.qq.com/json/ipad/cover/'+vid.substring(0,1)+'/'+vid+'.json';
                }else if(type==2)//android
                {
                    url='http://v.qq.com/json/android/cover/'+vid.substring(0,1)+'/'+vid+'.json';
                }
                return setupAjaxCross().then(function() {
                    //return Joint.$.post(url,'json')
                    return load(vid+type,url,1);
                }).then(function(o) {
                        return o;
                    }, function() {
                        return Joint.Deferred.resolve({});
                    });
            },
            getBind:function(){
                return MovieData.setupAjaxCross().then(function() {
                    var url = 'http://cgi.wxmovie.com/cgi-bin/dianying/wx/weimovie_wandareg.fcg';
                    return Joint.$.post(url, {
                        g_tk: csrftoken()
                    }, 'json');
                }).then(function(o) {
//                        if(o.ret != 0) {
//                            return Joint.Deferred.reject(o);
//                        }
                        if (_.isNull(o)||_.isNull(o.data)) return {isbind:-2};
                        return o.data;
                    });
            },
            session: {}
        });

    Joint.$(window).on('ajaxStart',function (option) {
        MovieData.trigger("loadstart", option.url);
    }).on('ajaxStop', function (option) {
            MovieData.trigger("loadend", option.url);
        });

    return MovieData;

    function inspectCinema(cinema/*{id, name, seat_ticket_trader}*/) {
        var is = {};
        is.IGNORE_ELEC = true;
        if (cinema.seat_ticket_trader == "129") {
            is.IGNORE_SEAT = true;
        }
        if (cinema.name.match(/华谊|万达|百老汇|华臣|嘉华/)) {
            is.IGNORE_ELEC = true;
        }
        if (cinema.id == 1002002) {//台州 路桥大地数字影院
            is.IGNORE_ALL = true;
        }
        if (cinema.id == 1003168) {//广州 烽禾影城科学城店
            is.IGNORE_ALL = true;
        }
        if (cinema.id == 1002149) {//北京 首都电影院
            is.IGNORE_ALL = true;
        }

        if (cinema.id == 1002198) {//北京 首都电影院（金融街店）
            is.IGNORE_ALL = true;
        }

        if (cinema.id == 1001629) {//济南 百丽宫影城
            is.IGNORE_ELEC = true;
        }

        if(Joint.$.os.android && Joint.$.os.fVersion < 3) {//2.x安卓和IE6也差不多德行了
            is.IGNORE_SEAT = true;
        }

        if(is.IGNORE_ELEC && is.IGNORE_SEAT && is.IGNORE_GROUPON) {
            is.IGNORE_ALL = true;
        }

        return is;
    }

    function filterCinema(cinema) {
        var is = inspectCinema(cinema);
        if(is.IGNORE_ALL) {
            return false;
        }
        if (is.IGNORE_ELEC) {
            cinema.flag_elec_ticket = 0;
        }
        if (is.IGNORE_SEAT) {
            cinema.flag_seat_ticket = 0;
        }
        if (is.IGNORE_GROUPON) {
            cinema.flag_groupon = 0;
        }
    }

    function loadInfo(url, name) {
        if (!name) {
            name = url.match(/(\w+)\.json/)[1];
        }

        return load(name, url).then(function (o) {
            return o.info || Joint.Deferred.reject('malform');
        });
    }
    //
    function load(name, url) {


        if(name=='cinemas_public_fyyc_new'){
            name='cinemas_public_fyyc'
        }

        var result = window.MovieData.data[name];
        if (result) {
            var dfr = Joint.Deferred.defer();
            //wait for next tick
            _.defer(function () {
                dfr.resolver.resolve(JSON.parse(result));
            });
            return dfr.promise;
        }

        if(load[name]) {
            return load[name];
        }

        if (localStorage.debug) {
            url += '?' + Math.random();
        } else {
            url += '?' + parseInt(new Date().getTime() / 600000);
        }

        MovieData.trigger("loadstart", url);

        return load[name] = _loadJs('http://imgcache.wxmovie.com/data/appdata/' + url).then(function () {
            MovieData.trigger("loadend", url);
            delete load[name];
            try{
                return JSON.parse(window.MovieData.data[name]);
            }catch(e){
                debugger;
                var cc=e;
            }
            
        });
    }

    function _loadJs(url) {
        var dfr = Joint.Deferred.defer();
        var head = document.head || document.getElementsByTagName('head')[0];
        var s = document.createElement('script');
        s.onload = s.onreadystatechange = function () {
            if (/^(loaded|complete|undefined)$/.test(s.readyState)) {
                s.onload = s.onerror = s.onreadystatechange = null;
                if (s && s.parentNode) {
                    s.parentNode.removeChild(s);
                }
                s = null;
                dfr.resolver.resolve();
            }
        };
        s.onerror = function (evt) {
            MovieData.trigger("loadend", url);
            dfr.resolver.reject(new Error('load failed'));
        };
        s.type = 'text/javascript';
        s.charset = "UTF-8";
        s.src = url;
        s.async = true;
        head.appendChild(s);

        return dfr.promise;
    }

    function crossAjax(o) {
        return mkCreateXHR().then(function (createXHR) {
            o.xhr = createXHR;
            return Joint.$.ajax(o);
        });
    }

    function setupAjaxCross() {
        return mkCreateXHR().then(function (createXHR) {
            $.ajaxSettings.xhr = createXHR;
            $.ajaxSettings.timeout = 20000;
        });
    }
    function setupAjaxDefault() {
        $.ajaxSettings.xhr = origXhr;
        $.ajaxSettings.timeout = 20000;

        return Joint.Deferred.resolve();
    }

    function mkCreateXHR() {
        return prepareIframe().then(function (iframe) {
            return function () {
                return iframe.contentWindow.createXHR();
            };
        });
    }

    function prepareIframe() {
        if (prepareIframe.iframe) {
            return Joint.Deferred.resolve(prepareIframe.iframe);
        }

        var dfr = Joint.Deferred.defer();
        var proxy = 'http://cgi.wxmovie.com/proxy.html';

        document.domain = "wxmovie.com";
        var ifr = document.createElement("iframe");
        ifr.style.width = ifr.style.height = "0";
        ifr.style.display = "none";
        ifr.proxyReady = function () {
            prepareIframe.iframe = ifr;
            dfr.resolver.resolve(ifr);
        };
        ifr.onload = function () {
            try {
                ifr.contentWindow.createXHR.apply
            } catch (e) {
                dfr.resolver.reject('proxy');
            }
        };
        ifr.src = proxy;
        document.body.appendChild(ifr);

        return dfr.promise;
    }
});