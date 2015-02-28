define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint', 
    'util/csrftoken', 'util/platform'], function (Base, MovieData, Joint, 
        getCsrfToken, Platform) {
    var parent = Base.prototype;
    var _ = Joint._;
    var $ = Joint.$;

    return Base.extend({
        initialize: Joint.after(parent.initialize, function(option) {
            var vm = this;
            vm.platformId = Platform.Store.get();
            var locksource = this.source;
            vm.city = option.cityId;
            vm.cinemaid = option.args[0];
            vm.mpid = option.args[1];
            vm.snid=option.args[2];
            vm.wanda=(vm.snid!=0);

            Joint.Deferred.when(
                loadCinemaSeatStatus(vm.platformId, vm.cinemaid, vm.mpid),
                MovieData.loadCinemaContent(vm.platformId,vm.cinemaid),
                //MovieData.getDiscount(),
                MovieData.setupAjaxCross()
            ).then(function(mp, cinema/*, discount*/) {
                /*if(MovieData.inspectCinema(cinema).IGNORE_SEAT) {
                    return Joint.Deferred.reject('场次不可用');
                }*/
                vm.discount = 0;//discount;
                vm.cinema = cinema;
                vm.mp = mp;
                vm.mptag=0;
                /*//alert(vm.cinemaid + ':'+ vm.mp.type + ':' + mp.roomid);//1000018
                if (vm.mp&&vm.cinemaid=='1000018'&&vm.mp.type=='3D'){ //广州天河影城3D眼镜提示需求
                      if (mp.roomid>=1&&mp.roomid<6){
                          vm.mptag=1;
                      }
                      else if (mp.roomid>=6&&mp.roomid<8){
                          vm.mptag=2;
                    }
                }*/
                return Joint.Deferred.when(
                        loadCinemaRoom(vm.cinemaid, mp.roomid,vm.wanda?5:0),
                        MovieData.loadMovie(mp.mid)
                );
            }).then(function(room, movie) {
                vm.room = room;
                vm.movie = movie;
                vm.sync();
                return Joint.Deferred.when(

                    //加载当前用户锁定的信息
                    vm.postQueryLock(vm.platformId,vm.wanda?5:0)

                );
            }).then(function(myLock){
                vm.mylockinfo=myLock;
                    if(myLock&&myLock.schedulePricingId&&myLock.iValidTime>0) {
                        if(myLock.schedulePricingId != vm.mpid || myLock.iCinemaID != vm.cinemaid) {
                            //坑爹，错的时候缺个ticketid,去拉一下继续reject
                            return loadCinemaSeatStatus(vm.platformId, myLock.iCinemaID, myLock.schedulePricingId).then(function(mp2) {
                                return Joint.Deferred.reject({
                                    unlockDialog: true,
                                    href: ['city', myLock.iCityID, 'seat', myLock.iCinemaID, myLock.schedulePricingId,mp2.cinematype!=5?0:myLock.sAssocOrderID],
                                    unlockParam: [mp2.cinematype!=5?0:myLock.sAssocOrderID,myLock.schedulePricingId, myLock.sSeatLable.split('|'), mp2.ticketid, myLock.sPlayTime, 1]
                                });
                            });
                        }
                        vm.seatLocked = myLock;
                    }

                    return Joint.Deferred.when(
                    //加载该场次电影已经被锁定的信息
                    queryLockedSeat(vm.mp, vm.cinema.id,vm.wanda?5:0)

                    )
            }).then(function(locked) {
                console.log(locked)
                _.each(vm.room.sSeatInfo, function(row) {
                    _.each(row.detail, function(seat, k) {
                        var seatChar = vm.seatChar.seat[seat.loveInd || 0];

                        if(seat.n == 'Z') {
                            row.detail[k] = _.extend({
                                status: 'void',
                                char: vm.seatChar.noseat,
                                isSeat: false
                            }, seat);
                        } else if(seat.damagedFlg == 'Y' || seat.loveInd ==1 ||  seat.loveInd ==2) { // 屏蔽情侣座
                            row.detail[k] = _.extend({
                                status: 'locked',
                                char: seatChar,
                                isSeat: true
                            }, seat);
                        } else if(locked._all || (locked[row.desc] && locked[row.desc][seat.n])) {
                            row.detail[k] = _.extend({
                                status: 'locked',
                                char: seatChar,
                                isSeat: true
                            }, seat);
                        } else {
                            row.detail[k] = _.extend({
                                status: 'available',
                                char: seatChar,
                                available: true,
                               // loveInd: seat.n % 2 + 1,
                                isSeat: true
                            }, seat);
                        }
                    }) ;
                });

                vm.seatLoaded = true;
                vm.sync('seatLoaded');
            }).then(null, function(o) {
                vm.panic(o);
            });
            
            function loadCinemaSeatStatus(platformId, cinemaId, mpid) {
                return vm.loadMovies(platformId, cinemaId).then(function (movies) {
                    var result;
                    _.any(movies, function (movie) {
                        return _.any(movie.sche, function (sches, date) {
                            return _.any(sches, function (sche) {
                                return _.any(sche.seat_info, function (mp) {
                                    if (mp.mpid == mpid) {
                                        mp.date = date;
                                        mp.mid = movie.id;
                                        mp.lagu = sche.lagu;
                                        mp.type = sche.type;
                                        result = mp;
                                        return true;
                                    }
                                });
                            });
                        });
                    });

                    return result || Joint.Deferred.reject({mpExpired: true});
                });
            }

            function queryLockedSeat(mp, cinemaId,cinemaType) {
                if(!!localStorage.debug_skipQuerySeat||cinemaType==5) {
                    return {};
                }

                if(_.isArray(window.wxconfig.disable_agent) && _.contains(window.wxconfig.disable_agent, parseInt(mp.agentid))) {
                    return {_all: true};
                }
                //锁定信息
                //http://cgi.wxmovie.com/cgi-bin/seat/unSalesQuery?schedulePricingId=aaa&bisServer=2
                var url = 'http://cgi.wxmovie.com/cgi-bin/seat/unSalesQuery';
                if(localStorage.debug_seatPC) {
                    url = mp.type_unseat_cgi_url == 2 ? 'http://cgi.piao.qq.com/cgi-bin/dianying/mb_app_api/qry_phoenix_lock.fcg' : 'http://cgi.piao.qq.com/cgi-bin/dianying/mb_app_api/qry_lock_seat.fcg';
                }

                return Joint.$.post(url, {
                    /*
                    sCmd: 'QRY_SEAT_LOCK',
                    sMpId: mp.mpid,
                    iMpId: mp.mpid,
                    iPartId: mp.traderid,
                    iDate: mp.date,
                    iCinemaId: cinemaId,
                    g_tk: getCsrfToken()
                    */
                    schedulePricingId:mp.mpid,
                    bisServer:Platform.Store.get()  
                }, 'json').then(function(o) {
                    if(o.ret != 0) {
                        return Joint.Deferred.reject(o);
                    }
                    // console.log(o);
                    // debugger;

                    var locked = {};
                    if(o.data){
                        // console.log('o.data--------------------o.data')
                        // console.log(o)
                        //o.data数据带大区信息“01:8:9,10”
                        //需转化->"null:8:9,10"
                        //o.data=o.data.replace(/(^|\D)0/g,"$1");
                        var mylocks = [];
                        var lockrows = o.data.split('@');
                        for(var i = 0;i < lockrows.length; i++){
                            var arr = lockrows[i].split(':').slice(1);
                            arr = 'null:' + arr.join(':');
                            mylocks.push(arr);
                        }
                        o.data = mylocks.join('@');
                        
                        // debugger;
                        _.each(o.data.split('@'), function (row) {
                            row = row.split(':');
                            if(!row[1] || !row[2]) return;
                            locked[row[1]] = locked[row[1]] || {};
                            _.each(row[2].split(','), function(no) {
                                locked[row[1]][no] = true;
                            });
                        });
                    }
                    // console.log(locked);
                    // debugger;

                    return locked;
                });
            }

            function loadCinemaRoom(cinemaId, roomId,cinemaType) {
                if (cinemaType==5) {//等于5表示万达，不需要加载座位图信息
                    return {};
                };
                var id = cinemaId + '_' + roomId;
                var url = 'cinemas/' + cinemaId.toString().substring(cinemaId.toString().length-1) + '/detail_seat_cinema_room_' + id + '.json';

                return MovieData.loadInfo(url, 'detail_cinema_room_' + id).then(function(room) {
                    var width = _.max(room.sSeatInfo,function (row) {
                            return row.detail.length;
                    }).detail.length;
                    var emptyRowCount = (width - room.sSeatInfo.length) / 2;

                    _.each(_.range(Math.floor(emptyRowCount)), function () {

                        var detail = _.map(_.range(width), function () {
                            return {n: 'Z'};
                        });
                        room.sSeatInfo.unshift({
                            desc: "",
                            detail: detail
                        });
                    });

                    _.each(_.range(Math.ceil(emptyRowCount)), function () {

                        var detail = _.map(_.range(width), function () {
                            return {n: 'Z'};
                        });
                        room.sSeatInfo.push({
                            desc: "",
                            detail: detail
                        });
                    });
                    return room;
                });
            }

        }),

        seatChar: {
            "noseat": 'P',
            "seat": ['A', 'B', 'C']
        },
        source: ([[113, 114], [120, 119]])[Joint.$.browser.wechat ? 1 : 0][Joint.$.os.ios ? 1 : 0],
        postLockSeat: function(snid,mpid, seats, ticketid, playtime, optype) {

            var locksource = this.source;
            var seatlable = seats[0].split(":").length>2?seats.join('|'):'01:'+seats.join('|01:');
            var platform=Platform.Store.get();
            //console.log(seatlable);
            return MovieData.setupAjaxCross()
            .then(function() {
                var url = 'http://cgi.wxmovie.com/cgi-bin/seat/lock';//锁座
                if(optype==1) {//解锁
                    url = 'http://cgi.wxmovie.com/cgi-bin/seat/unlock';
                }
                return Joint.$.post(url, {
                        schedulePricingId:mpid,
                        ticket:ticketid,
                        bisServer:1,
                        seatlable:seatlable,
                        publicSignalShort:platform
                }, 'json'); 
            })
            .then(function(res) {
                if(!res || !_.has(res, 'ret') || res.ret != 0) {
                    return Joint.Deferred.reject(res);
                }
                return res;
            });

        },

        postBuy: function(orderId,schedulePricingId) {
            var source = this.source;
            return MovieData.setupAjaxCross().then(function() {
                return $.post("http://cgi.wxmovie.com/cgi-bin/order/payment", {
                    // suin: 'o0aT-d0W_QdU9lAXyjPjih1cvZTg',
                    // iuin: '201310171436180000',
                    /*
                        openId  string  openId
                        bank    string  银行编码
                        subsrc  string  统计来源
                        phone   string  电话
                        visitor string  访问者dianying_web 固定
                        temp_order_id   string  锁座时返回的临时订单号
                        pay_type    string  空：财付通
                        schedulePricingId   string  排期批价ID
                        publicSignalShort   string  微信公众号缩写

                    */
                    bank:"",
                    subsrc: $.os.ios ? '30610000' : '30600000',
                    phone: '13800138000',
                    visitor:"weixin_h5",
                    temp_order_id: orderId,
                    bank: '0',
                    pay_type: '1',
                    schedulePricingId:schedulePricingId,
                    publicSignalShort: Platform.Store.get()

                }, 'json');
            }).then(function(res) {
                if(!res || !_.has(res, 'ret') || res.ret != 0) {
                    return Joint.Deferred.reject(res);
                }
                return res;
            });
        },
        //查询用户锁座信息
        postQueryLock: function(platformId,cinemaType) {
            if(!!localStorage.debug_skipQuerySeat) {
                return {};
            }

            return MovieData.setupAjaxCross().then(function() {
                /*
                    http://cgi.wxmovie.com/cgi-bin/order/unpaymentQuery?openId=aa&publicSignalShort=12&ticketCount=1
                */
                var url = 'http://cgi.wxmovie.com/cgi-bin/order/unpaymentQuery';
                if(localStorage.debug_seatPC) {
                    url ='http://cgi.wxmovie.qq.com/cgi-bin/dianying/movie_online_book/query_lock_info.fcg';
                }

                return $.post(url, {
                    g_tk: getCsrfToken(),
                    publicSignalShort:platformId,
                    ticketCount:1
                }, 'json');
            }).then(function(o) {
                if(o.ret != 0) {
                    return Joint.Deferred.reject(o);
                }
                // console.log('用户锁座信息')
                // console.log(o.data)
                return o.data;


            });
        },
        postQueryPhone: function(cinemaType) {
            if(cinemaType!=5) {
                return {};
            }
            return MovieData.setupAjaxCross().then(function() {
                var url = 'http://cgi.wxmovie.qq.com/cgi-bin/dianying/wx/weimovie_wandareg.fcg?a='+new Date().getTime();
                return $.post(url, {}, 'json');
            }).then(function(o) {
                if(o.ret != 0) {
                    return Joint.Deferred.reject(o);
                }
                return o.data;
            });
        },
        loadMovies: function(platformId, cinemaId) {
            var id = 'sched_public_cinema_' + platformId + '_' + cinemaId;
            var url = 'cinemas/public/' + platformId + '/' + id + '.json';

            return MovieData.load(id, url);
        },


        getLabel: function(row, col) {
            var vm = this;
            
            row = vm.room.sSeatInfo[row];
            if(!row) {
                return null;
            }
            col = row.detail[col];
            if(!col) {
                return null;
            }

            return row.desc + ':' + col.n;
        },
        locateRC: function(label) {
            var vm = this;
            if(label.split(':').length>2){
                label = label.toString().substring(label.toString().indexOf(":")+1).split(':');
            }else{
                label = label.split(':');
            }
            if(parseInt(label[1])<10){label[1]="0"+parseInt(label[1]);}
            var result = {};
            _.chain(vm.room.sSeatInfo)
            .map(function(seat, row) {
                return [row, seat];
            }).any(function(data) {
                if(data[1].desc == label[0]) {
                    result.row = data[0];
                    _.any(data[1].detail, function(seat, col) {
                        if(seat.n == label[1]) {
                            result.col = col;
                            return true;
                        }
                    });
                    return true;
                }
            });

            return result;
        },

        info: false
    });
});