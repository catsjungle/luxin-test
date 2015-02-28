define(['view/base', 'backbone.joint', 'viewmodel/partial/banner', 'iscroll', 'tpl/partial_banner'], function (Base, Joint, BannerVM, IScroll) {
    var Timer = Joint.Emitter.extend({
        constructor: function (interval) {
            this._interval = Math.max(50, parseInt(interval)) || 2000;
        },
        _tick: function () {
            this.trigger('tick');
        },
        start: function () {
            var self = this;
            self.stop();
            self._to = setTimeout(function () {
                self._tick();
            }, this._interval);
        },
        stop: function () {
            if(this._to) {
                clearTimeout(this._to);
                delete this._to;
            }
        }
    });

    var parent = Base.prototype;
    return Base.extend({
        template: require('tpl/partial_banner'),
        initialize: Joint.after(parent.initialize, function () {
            var view = this;
            view.on('$J:render:full:done', function () {
                _.defer(function () {
                    if (!view.vm.notEmpty) return;

                    view.$el.parent().removeClass('m-hide');
                    var winWidth = Joint.$(window).width();
                    view.$('.banner_content').width(winWidth * view.vm.items.length);
                    view.$('.banner_content a').width(winWidth);
                    view.scroll = new IScroll(view.$('.wrapper')[0], {
                        useTransition: false,//transition导致IOS下闪
                        //                    scrollbars: 'custom',
                        scrollX: true,
                        scrollY: false,
                        momentum: false,
                        bounce: false,
                        snap: true,
                        bindToWrapper: true
                    });

                    view.timer = new Timer(5000);
                    view.timer.on('tick', function () {
                        var page = view.scroll.currentPage.pageX + 1;
                        if (page >= view.scroll.pages.length) {
                            page = 0;
                        }
                        view.scroll.goToPage(page, 0);
                    });
                    view.timer.start();

                    view.scroll.on('scrollStart', function () {
                        view.timer.stop();
                    });

                    view.scroll.on('scrollEnd', function () {
                        view.timer.start();
                    });

                    view.trigger('bannerReady');
                });
            });
            view.sync('vm', view.vm = new BannerVM);
        })
    });
});