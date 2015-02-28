define([
    'view/page/base',
    'viewmodel/page/v_moviepic',
    'backbone.joint',
    'appRouter',
    'util/date',
    'tpl/tpl_moviepic'
], function (Base, MoviePicVM, Joint, appRouter, udate) {
    var parent = Base.prototype;
    return Base.extend({
        template: require('tpl/tpl_moviepic'),
        scrollOption:0,
        initialize: Joint.after(parent.initialize, function (options) {
            var view = this;
            view.sync('vm', view.vm = new MoviePicVM(options));
            // var height = Math.round(Joint.$(window).height() * 0.5);
            view.on('$J:render:full:done', function () {
                Joint._.defer(function () {
                    var winWidth = document.body.clientWidth;//Joint.$(window).width();
                    var picCount = _.size(view.$('.screenshots ul li')),currentIndex = view.vm.pageIndex;
                    view.$('.screenshots').width(winWidth * picCount);
                    view.$('.screenshots ul li').width(winWidth);
                    view.scroll = new IScroll(Joint.$('.js_wrapper')[0], {
                        useTransition: false,//transition导致IOS下闪
                        scrollX: true,
                        scrollY: false,
                        momentum: false,
                        bounce: false,
                        snap: 'li',
                        bindToWrapper: true
                    });
                    view.scroll.on('scrollEnd', function () {
                        view.$('.columns')[0].innerText=(parseInt(view.scroll.currentPage.pageX,10)+1) + ''+" / "+ picCount;
                        view.$('.columns').removeClass('m-hide');
                    });
                    var page = currentIndex;
                    if (page >= view.scroll.pages.length) {
                        page = 0;
                    }
                    Joint._.delay( function(){view.scroll.goToPage(page, 0,200);},500);

                });
            });
        })
    });
});
