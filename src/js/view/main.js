define([
    'view/base', 'backbone.joint', 'appRouter',
    'util/city', 'util/login', 'fx/scroller',
    'viewmodel/moviedata', 'util/wxbridge', 'util/wxShareOption',
    'util/analytics', 'tpl/main'
], function (
    Base, Joint, appRouter,
    City, login, scroller,
    MovieData, wxbridge, wxShareOption/*nothing*/,
    analytics/*nothing*/
) {
    var parent = Base.prototype;
    var MainView = Base.extend({
        template: require('tpl/main'),
        events: {
            'click a': function (e) {
                if(e.currentTarget.protocol.indexOf('http') !== -1) {
                    e.preventDefault();
                }
            },
            'tap a': function (e) {
                var link = e.currentTarget;
                if (link.protocol.indexOf('tel')===0) {
                    location.href = link.href;
                    return;
                }else if (link.protocol.indexOf('http') === -1) {
                    return;
                }
                //识别外站链接
                if(link.href.indexOf(location.href.replace(/#.+$/, '#')) === -1) {
                    location.href = link.href;
                    return;
                }

                appRouter.go(link.href.replace(/^.*[\?#]/, ''));
            },
            'tap .bottom-exit': function () {
                wxbridge.getBridge().then(function (Bridge) {
                    Bridge.invoke('closeWindow');
                });
            },
            'tap .bottom-back': function () {

                window.history.go(-1);
            },
            'tap .bottom-forward': function () {
                window.history.go(1);
            },
            'tap .bottom-refresh': function () {
                if (this._cheat % 7 == 0) {
                    // alert(window.timestamp);
                    return;
                }

                delete this._cheat;

                window.MovieData.data = {};
                appRouter.reload();
            },
            'tap .fotter-bar': function(event) {
                if(event.target === event.currentTarget) {
                    this._cheat = (this._cheat || 0) + 1;
                }

                // console.log('------------------');
                // console.log(window.history)
                // console.log(window.MovieData.data);
                // console.log(this._cheat)
            },
            'touchstart .touchable': function(event) {
                Joint.$(event.currentTarget).addClass('hover');
            },
            'touchend *': function() {
                Joint.$('.hover').addClass('bgt200').removeClass('hover');
            }
        },
        initialize: Joint.after(parent.initialize, function () {

            var view = this;

            //events
            view.on('change_city', function (movieId) {
                var callee = arguments.callee;
                if (callee.locked) return;
                callee.locked = true;
                City.pick(movieId).then(function () {
                    appRouter.reload();
                    callee.locked = false;
                }, function () {
                    callee.locked = false;
                });
            });

            //route start
            appRouter.route('(*default)', function () {
                appRouter.navigate('movie_list', {trigger: true, replace: true});
            });
            routePage('movie_list');
            routePage('movie_spot');
            routePage('cinema_content-:cid');
            routePage('movie_scheduler-*cinema_id(-:movie_id)');
            routePage('map-:lat-:lon');

            routePage('order-*viewtype(-:status)');
            // routePage('order-:viewtype');

            // routePage('seat-:cinema-:mpid-:snid');

            routePage('movie_info-:movie_id');
            routePage('movie_info_more-:movie_id-:movieorpic');
            routePage('movie_pic-:movie_id-:imgindex');
            routePage('success');
            routePage('seat-:cinema-:mpid-:snid');
            
            routePage('cinema_scheduler-:mid');
            routePage('cinema_list');
            routePage('movie_scheduler-*cinema_id(-:movie_id)');
            
            routePage('wdseat-:cinema-:mpid-:mobile');
            routePage('buy-:cid');
            routePage('buy-:cid-:movie_id');
            routePage('movie_trailer');


               // appRouter.route('debug', function () {
               //     renderPage('view/page/debug');
               // });

            //登录的非常规路由
            appRouter.bHistory.route({//XXX 这个参数原本应该是正则，这里dirty hack一下
                test: function(fragment) {
                    //debugger;
                    fragment = appRouter.deparam(fragment);
                    return !!fragment.code;
                }
            }, function(fragment) {
                login.handleRoute(fragment)
            });

            appRouter.route('city-*city-*target', function (city, target) {
                City.set(city, target).then(function (city, target) {
                    appRouter.navigate(target, {
                        trigger: true,
                        replace: true
                    });
                });
            });

            view.once('$J:render:done', function () {
                Backbone.history.start({
                   // pushState: true,
                   // hashChange: false,
                   // root: location.pathname + '?'
                });
            }); 

            function routePage(route, name) {
                if (!name) {
                    name = route.match(/^[^\/-]+/)[0];
                }
                // console.log(name);
                appRouter.route(route, function () {
                    var args = Joint._.toArray(arguments);
                    // console.log(args)
                    var mod = 'view/page/' + name;
                    // console.log(require.defined(mod));
                    // debugger;
                    var load = (require.defined ? require.defined(mod) : require._defined[mod]) || MovieData.loadJs('js/' + mod + '.js?_=' + window.timestamp);
                    Joint.Deferred.when(/*City.decideCity(name), */load).then(function () {
                        //传参cityId
                        var cityId = {};
                        cityId.city_id = 144;  //济南

                        cityId.cinema_id = '547009da16feb413d414572b';//'5470085216feb413d4142c3e';//'1004192';
                    // Joint.Deferred.when(City.decideCity(name), load).then(function (cityId) {
                        if (!cityId){
                            renderPage(mod, { args: args});
                        }else{
                            renderPage(mod, { args: args,
                                cityId: !cityId.city_id?cityId.toString().substring(0,cityId.toString().indexOf(",")):cityId.city_id,
                                cinemaId: cityId.cinema_id
                            });
                        }
                    }, function (err) {
                        if(Joint.$.browser.wechat) {
                            wxbridge.getBridge().then(function (Bridge) {
                                Bridge.invoke('closeWindow');
                            });
                        } else {
                            appRouter.reload();
                        }
                    });
                });
            }

            function renderPage(mod, option) {
                view.$('#loading').css('opacity', 1).show();
                wxbridge.getBridge().then(function (Bridge) {
                    Bridge.invoke('hideToolbar');
                    Bridge.invoke("showOptionMenu");
                });

                require([mod], function (SubView) {
                    var loginPromise = SubView.needLogin ? login.ensure() : Joint.Deferred.resolve();
                    loginPromise.then(function() {
                        var subView = new SubView(option);
                        view.setView('#main', subView);
                        Joint._.result(subView, 'renderPromise').then(function () {
                            view.$('#loading').css('opacity', 0).hide();
                            appRouter.trigger('page-render');
                            // console.log('prender' + (new Date() - window.page_begin));
                            // console.timeStamp('prender');
                        });
                    });
                });
            }
        })
    },
    {
    });

    return MainView;
});