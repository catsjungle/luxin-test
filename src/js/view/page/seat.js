define(['view/page/base', 'viewmodel/page/seat', 'backbone.joint',
    'util/fontwatcher', 'view/dialog/message', 'view/ui/picker',
    'util/date', 'util/transformer', 'appRouter',
    'iscroll', 'view/partial/schedule', 'viewmodel/moviedata',
    //'view/dialog/firstknow_booking', 
    'viewmodel/timecounter', 'util/wxbridge',
    'tpl/seat'
], function(
    Base, SeatVM, Joint,
    FontWatcher, MessageView, PickerView,
    udate, Transformer, appRouter,
    iScroll, ScheduleView, MovieData,
    //FirstKnowView, 
    CounterVM, wxbridge
) {
    var parent = Base.prototype;
    var _ = Joint._;

    return Base.extend({
        template: require('tpl/seat'),
        onentr: function(event) {
            var view = this;
            view.$(".full-screen").removeClass("m-hide");
        },
        onfullscreen:function(event) {
            var view = this;
            view.$(".full-screen").addClass("m-hide");
        },
        events: {
            'tap .js-editphoto': 'onEditPhoto',
            'tap .seat-label': 'onTapLabel',
            'tap .btn-pick': 'onTapPick',
            'tap .part [available]': 'onTapSeat',
            'tap .btn-lock': 'onTapLock',
            'tap .btn-unlock': 'onTapUnlock',
            'tap .entr':"onentr",
            'tap .full-screen':"onfullscreen",
            'tap .btn-buy': 'onTapBuy'
        },
        scrollOption: false,//disable page scroll
        initialize: Joint.after(parent.initialize, function() {
            //FirstKnowView.tryShow();
        }, function(option) {
            var view = this;
            view.once('$J:render:done', function() {
                view.setTitle('选座 ' + view.vm.cinema.name);
            });
            view.on('$J:render:part:done', function(args) {

                if(args[0] == 'vm' && _.indexOf(args[1], 'seatLoaded') != -1) {
                    if(view.vm.seatLocked) {
                        //等initRoomView搞完放大镜，再恢复被锁状态
                        view.once('part-ready', function() {
                            view.orderId = view.vm.seatLocked.sAssocOrderID || view.vm.seatLocked.sTempOrderID;
                            view.data.state = 'pay';
                            view.data.checkedSeats = {};
                            _.each(view.vm.seatLocked.sSeatLable.split('|'), function(label) {
                                var t=label.toString().substring(2).split(":");
                                //view.data.checkedSeats[""+t[0]+":"+parseInt(t[1])] = true;
                                view.data.checkedSeats[t[1] + ':' + t[2]] = true;
                                var rc = view.vm.locateRC(label);
                                view.checkTd(rc.row, rc.col, true);
                            });
                            view.switchState('pay');
                            view.renderFields('', 'checkedSeats');
                            view.sync('counter', view.counter = new CounterVM({
                                expire: parseInt(view.vm.seatLocked.iValidTime) * 1000
                            }));
                            view.counter.on('end', _.bind(view.onCounterEnd, view));
                        });
                    }
                    view._initRoomView(view.$('.roomContainer'));
                }
            });

            view.data.checkedSeats = {};
            view.data.state = 'pick';
            view.data.counter = null;
            view.data.loveClass = {
                '1': 'lover-left',
                '2': 'lover-right'
            };


            view.data.daystr = udate.getDayStr();

            view.sync('vm', view.vm = new SeatVM(option));

            // //加载当前用户锁定的信息
            // Joint.Deferred.when(view.vm.postQueryLock(view.vm.platformId, view.vm.wanda?5:0)).then(function(data){
                              
            // });

            view.handleError(view.vm, function(o) {
                if(!o) {
                    alert('null error');
                } else if(o.ret == -4778 && (o.sub == -100194 || o.sub == -40009)) {
                    MessageView.alert('该场次已过期，请选择其他场次订座').then(function() {
                        //appRouter.go('movie_scheduler', view.vm.cinemaid);
                        appRouter.go('movie_list');
                    });
                    view.trigger('error-alert');
                } else if(o.unlockDialog) {
                    
                    MessageView.confirm('您上次的选座订单还未支付，是否继续支付?', null, {
                        ok:'继续支付',
                        cancel:'取消订单'
                    }).then(function() {
                        appRouter.goHref(o.href);
                    }, function() {
                        view.vm.postLockSeat.apply(view.vm, o.unlockParam).then(function() {
                            //appRouter.reload();
                            //如果是万达的则调整到万达订座页面去
                            if(o.unlockParam[0]!=0){
                                appRouter.goHref(['wdseat', view.vm.cinemaid, view.vm.mpid,0]);
                            }else{
                                appRouter.reload();
                            }
                        }, function() {
                            appRouter.reload();
                        });
                    });
                    view.trigger('error-alert');
                } else if (o.mpExpired) {
                    MessageView.alert('该场次已过期，请选择其他场次订座').then(function () {
                      //appRouter.go('movie_scheduler', view.vm.cinemaid);
                      appRouter.go('movie_list');
                    });
                    view.trigger('error-alert');
                }else if(o.iswandacancel){
                    appRouter.goHref(['wdseat', view.vm.cinemaid, view.vm.mpid,0]);
                }else if(o.isbindPhone){//在万达的电影院，但是还没有注册万达的手机号需要去绑定手机号
                    //appRouter.go('movie_scheduler', view.vm.cinemaid);
                } else {
                    if(window.debug) {
                        console.log(o);
                    }
                    MessageView.alert('网络异常，请返回重试').then(function () {
                        history.go(-1);
                    });

                    view.trigger('error-alert');
                }
            });

        }),

        _initRoomView: function($ctn) {
            var view = this;
            var $room = view.$room = $ctn.find('.room');
            var $table = view.$table = $room.children('.table');
            view.offset = {x:0, y:0};
            view.$hIndicator = $ctn.find('.hIndicator .scroller');
            view.hIndTransform = new Transformer(view.$hIndicator);

            FontWatcher.watch('ico-webfont', 'abcABC').then(function(){
                var width = $table.width();
                var height = $table.height();
                var ctnWidth = $ctn.width();

                $room.css({
                    height: document.documentElement.clientHeight - 300,
                    visibility: 'visible'
                });
                if(!view.vm.wanda){
                    $table.width((view.vm.room.sSeatInfo[0].detail.length + 1) * 48).height(view.vm.room.sSeatInfo.length * 38);
                }
                initPart();
            });

            function initPart() {
                if(!$room[0]) {
                    view.trigger('part-ready');
                    return;
                }
                var min = $ctn.width() / $table.width();
                var max = Math.max(1.5, $table.width() / 1000);
                view.scroll = new iScroll($room[0], {
                    bounce: !Joint.$.os.android,
                    momentum: !Joint.$.os.android,
                    zoom: true,
                    scrollbars: true,
                    zoomMin: min,
                    zoomMax: max,
                    startZoom: min,
                    useTransition: true,
                    scrollX: true,
                    freeScroll: true
                });

                if(!view.scroll.indicators) {
                    view.scroll.indicators = [];
                }
                var indicator = {
                    style: view.$hIndicator[0].style,
                    updatePosition: function () {
                        //用translateZ打开显卡加速 http://stackoverflow.com/questions/10814178/css-performance-relative-to-translatez0
                        var y = Math.round(view.scroll.y);

                        this.style["webkitTransform"] = "translate(0,"+ y + "px) translateZ(0) scale(" + view.scroll.scale + ")";
                        this.style["webkitTransformOrigin"] = "top left";
                    },
                    transitionTime: function (time) {
                        this.style.webkitTransitionDuration = time + 'ms';
                    },
                    transitionTimingFunction: function (value) {
                        this.style.webkitTransitionTiming = value;
                    },
                    refresh: function () {
                        this.transitionTime(0);
                        this.updatePosition();
                    },
                    remove: function () {
                       // console.log(arguments);
                    },
                    destroy: function () {
                       // console.log(arguments);
                    }
                };
                view.scroll.indicators.push(indicator);
                _.defer(function() {
                    var $seats = $table.find('.available, .locked');

                    // view.scroll.scrollToElement($seats[0]);
                    view.scroll.scrollBy(0, -0.5 * ($table.width() - $table.height()));
                    view.scroll.zoom(view.scroll.scale + .001);//hack the hIndicator
                });

                view.trigger('part-ready');
            }//end bindpart
        },

        onTapSeat: function(event) {
            var view = this;
            if(view.data.state !== 'pick') return;


            var $td = view.$(event.currentTarget);
            var d = !$td.data('checked') ? "1" : "";

            var loveInd = $td.attr('loveInd');

            var row = $td.attr('row');
            var col = $td.attr('col');

            var seats = [[row, col]];  //原始座位表的排和列[ [20,25]]
            if(loveInd > 0) {
                var $loveTd = loveInd - 1 ? $td.prev() : $td.next();
                seats.push([$loveTd.attr('row'), $loveTd.attr('col')]);
            }
            if(d && _.keys(view.data.checkedSeats).length + seats.length > 4) {
                MessageView.alert('最多选择4张');
                return;
            }

            _.each(seats, function(seat) {

                var label = getLabel(seat[0], seat[1]);
                if(!d) {
                    delete view.data.checkedSeats[label];  //已选的就删除数据
                } else {
                    view.data.checkedSeats[label] = true;  //未选的就增加数据
                }
                view.checkTd(seat[0], seat[1], d); //切换座位选中或者未选中状态

            });

            _.defer(function() {
                view.renderFields('', 'checkedSeats'); //this$.trigger('$J:render:part:done', [syncName, fields]);
            });

            event.stopImmediatePropagation();


            function getLabel(row, col) {
                //此处的row,col是原始seatInfo的排和列

                var r = view.vm.room.sSeatInfo[row];
                var c = r.detail[col];
                return r.desc + ':' + c.n;//获得用于显示的*排*座
            }

        },


        onTapPick: function(event) {
            var view = this, vm = view.vm;

            MovieData.getScheduleList(vm.platformId, vm.city, vm.cinemaid, vm.movie.id)
            .then(function(sches) {
                if(sches.length == 0) {
                    return Joint.Deferred.reject('请重新选择场次');
                }

                var contentView = ScheduleView.create(sches, vm.mpid, vm.movie.id);

                return PickerView.pick('更换场次', contentView);
            }).then(function(mpid) {
                return ['seat', vm.cinemaid, mpid,vm.snid]
            }).then(function(href) {
                appRouter.goHref(href);
            }, function(err) {
                if(_.isString(err)) {
                    MessageView.alert(err);
                }
            });
        },

        checkTd: function(row, col, isCheck) {
            var view = this;

            var $td = view.$('.seat[row="' + row + '"][col="' + col + '"]');
            $td.data('checked', isCheck);
            if(isCheck) {
                $td.removeClass('available').addClass('checked');
            } else {
                $td.addClass('available').removeClass('checked');
            }
        },
        onEditPhoto: function(event){
            var view=this;
            MessageView.confirm('重新编辑手机号码将取消当前订单重新选座！', null, {
                ok:'确认',
                cancel:'取消'
            }).then(function() {
                    view.doUnlock().then(function(result) {
                        appRouter.goHref(['wdseat', view.vm.cinemaid, view.vm.mpid,view.vm.phone]);
                        //确认之后跳转到手机绑定页面，并且解除当前锁座
                    }, function(err) {
                        //解锁失败，请稍候重试
                        appRouter.goHref(['wdseat', view.vm.cinemaid, view.vm.mpid,view.vm.phone]);
                    });
                }, function() {
                    //
                });
        },
        mkLockParam: function() {
            var view = this;
            var playtime = view.vm.mp.date.match(/(\d{4})(\d{2})(\d{2})/);
            playtime = [playtime.slice(1).join('-'), view.vm.mp.time].join(' ');

            var seats = _.keys(view.data.checkedSeats);

            return [view.vm.wanda?view.vm.wanda.iOrderid:0,view.vm.mp.mpid, seats, view.vm.mp.ticketid, playtime/*,vm.platformId*/];
        },
        doUnlock: function() {
            var view = this;
            return view.vm.postLockSeat.apply(view.vm, view.mkLockParam().concat(1));
        },
        onTapUnlock: function(event) {
            var view = this;

            view.switchState('unlocking');

            view.doUnlock().then(function(result) {
                if(view.vm.wanda){
                    appRouter.goHref(['wdseat', view.vm.cinemaid, view.vm.mpid,0]);
                }else{
                    view.$('.seat.checked').addClass('available').removeClass('locked').attr('available', true);
                    view.unsync('counter');
                    view.switchState('pick');
                }
            }, function(err) {
               MessageView.alert('解锁失败，请稍候重试');
               view.switchState('pay');
            });

        },
        onTapLabel: function(event) {
            var view = this;
            if(!view.scroll) return;
            var label = view.$(event.currentTarget).html();
            
            
            var $target = view.$('.seat').filter(function() {
                return this.getAttribute('title') == label;
            });

            $target.trigger('tap');
        },
        onTapLock: function(event) {
            var view = this;

            if(_.keys(view.data.checkedSeats) == 0) {
                MessageView.alert('请先选择座位');
                return;
            }
            // console.log('==========lock----view.data.checkedSeats==========')
            // console.log(view.data.checkedSeats)
            view.checkSeatPolicy().then(function() {
                view.switchState('locking');

                return view.vm.postLockSeat.apply(view.vm, view.mkLockParam());
            }).then(function(result) {
                view.orderId = result.seatinfo.sTempOrderID;
                view.sync('counter', view.counter = new CounterVM({expire: result.seatinfo.iLockValidTime * 1000}));
                view.counter.on('end', _.bind(view.onCounterEnd, view));

                view.switchState('pay');
            }, function(err) {
                if(_.isString(err)) {
                    MessageView.alert('<span class="seats_error"></span>' + err);
                } else if (err && _.isString(err.msg)) {
                    MessageView.alert(err.msg);
                } else {
                    MessageView.alert('锁座失败，请稍候重试');
                }
                view.switchState('pick');
            });

        },
        //检查所有座位的合法性
        checkSeatPolicy: function() {
            var view = this;
            return Joint.Deferred.when.apply(null,
                Joint._.map(view.data.checkedSeats, function(t, seat) {
                    var rc = view.vm.locateRC(seat);
                    return view.checkSeatPickLegal(rc.row, rc.col);
                })
            ).then(function() {
                return true;
            });
        },
        onCounterEnd: function() {
            var view = this;
            MessageView.confirm('您未在10分钟内完成支付，很抱歉，您的座位已经取消', undefined, {
                ok: '查看其他场次',
                cancel: '重新选择'
            }).then(function() {
                //appRouter.go('movie_scheduler', view.vm.cinema.id, view.vm.movie.id);
                appRouter.go('movie_list');
            }, function() {
                appRouter.reload();
            });
        },
        //检查一个座位选择是否合法
        checkSeatPickLegal: function(rowIdx, colIdx) {
            var view = this;
            // console.log(view.data.checkedSeats[view.vm.getLabel(row, colIdx)]);
            var row = view.vm.room.sSeatInfo[parseInt(rowIdx)].detail;

            var offsetDesc = {
                '-1': '左侧',
                '1': '右侧'
            }

            return Joint.Deferred.when(check(1), check(-1));

            function check(offset) {
                //旁边有人/没座位？
                if(isPickedOrVoid(colIdx + offset)) return true;


                //[current]->[emtpy]->[void]的情况，看反面情况
                if(isVoid(colIdx + offset + offset)) {
                    return isPickedToEnd(colIdx - offset, -offset) ? true : Joint.Deferred.reject('座位' + offsetDesc[offset] + '不能留空');
                }
                //旁边没有被选中，但在再旁边也是个空位未选中
                if(!isPickedByMe(colIdx + offset + offset) && row[colIdx + offset + offset].status == 'available') return true;

                // [current]->[empty]->[picked]的情况，可能存在picked到底的例外
                return isPickedToEnd(colIdx + offset + offset, offset) ? true : Joint.Deferred.reject('座位之间不能留空');
            }

            function isPickedToEnd(begin, step) {
                var now = 0;
                while(true) {                    
                    if(isVoid(begin + step * now)) {
                        return true;
                    }
                    if(row[begin + step * now].status == 'locked') {
                        return true;
                    }
                    if(row[begin + step * now].status == 'available' && !isPickedByMe(begin + step * now)) {
                        return false;
                    }
                    now++;
                }
            }

            function isPickedOrVoid(c) {
                return isVoid(c) || isPicked(c);
            }

            function isPicked(c) {
                return row[c].status == 'locked' || isPickedByMe(c);
            }

            function isPickedByMe(c) {
                return view.data.checkedSeats[view.vm.getLabel(rowIdx, c)];
            }

            function isVoid(c) {
                return !row[c] || row[c].status == 'void';
            }

            return true;
        },
        onTapBuy: _.debounce(function(event) {
            var view = this;
            if (!($.browser.wechat && $.browser.fVersion >= 5)) {
              return MessageView.alert('您的微信版本较低，尚不支持微信支付，请更新升级以后再来体验吧', null, {ok: '我知道了'});
            }

            Joint.Deferred.when(view.vm.postBuy(view.orderId,view.vm.mpid), wxbridge.getBridge()).then(function(result, Bridge) {
                //Joint.Deferred.when(view.vm.postBuy(view.orderId)).then(function(result) {
                var param = JSON.parse(result.payment_details.sPayCertificate);
                Bridge.invoke('getBrandWCPayRequest', param, function(res) {
                    if (res.err_msg == 'get_brand_wcpay_request:ok' || res.err_msg == 'get_brand_wcpay_request:finished') {
                        MessageView.alert('<h3 class="main-color">恭喜您，支付成功</h3><p>我们稍后将向您的微信号发送兑票码，请注意查收！</p>').then(function() {
                            //appRouter.go("success");
                            appRouter.go('order','main');
                        });
                    } else if (res.err_msg == 'system:access_denied') {
                        return MessageView.alert('支付请求被拒绝');
                    } else {
                        // MessageView.alert(res.err_msg);
                        // alert(JSON.stringify(res));
                        MessageView.confirm('您尚未支付成功，是否重新支付？', undefined, {
                            ok: '重新支付',
                            cancel: '取消'
                        }).then(function () {
                            view.onTapBuy();
                        }, function () {
                            appRouter.reload();
                        });
                    }
                });


            }, function(err) {
                // if(window.debug) debugger;
               // if(err && _.isString(err.msg)) {
               //     MessageView.alert(err.msg);
               // } else {
                    MessageView.alert('支付失败，请稍候重试');
               // }
            });

        }, 3000, true),
        remove: Joint.after(parent.remove, function() {
            this.unsync('counter');
        }),
        switchState: function(state) {
            var view = this;

            if(state == 'pay') {
                view.$('.seats-info').addClass('locking-seats');
                view.$('.lockee').addClass('locking').removeClass('loading_w ');
            } else if(state == 'locking') {
                view.$('.lockee').addClass('loading_w locking');
            } else {
                view.$('.seats-info').removeClass('locking-seats');
                view.$('.lockee').removeClass('loading_w locking');
            }

            view.data.state = state;
            view.renderFields('', 'state');
        },
        renderPromise: function () {
            var view = this;
            return Joint.Deferred.listen(this, ['part-ready error-alert', true]).then(function() {
                view.$('.mov-seats').css('visibility', 'visible');
            });
        }
    });//Base.extend
});//define