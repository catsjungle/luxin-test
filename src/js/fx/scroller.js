define(['backbone.joint', 'iscroll'], function (Joint, IScroll) {
    return function (view, option, $wrapperPromise) {
        var $w = Joint.$(window);
        $wrapperPromise = $wrapperPromise || view.$el.css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: $w.width(),
            height: $w.height() - Joint.$('.fotter-bar').height()-(localStorage.static_showTips==1?50:0),
            overflow: 'hidden'
        }).addClass('wrapper content');

       view.on('$J:render:full:before',function () {
            if(view.scroll) {
                view.scroll.destroy();
                view.scroll = false;
            }
        }).on('$J:render:part:done',function () {
            if (view.scroll) {
                Joint._.defer(function () {
                    view.scroll.refresh();
                });
            }
        }).on('$J:render:full:done', function () {
            Joint.Deferred.when($wrapperPromise).then(function($wrapper) {
                if (!$wrapper[0]|| !$wrapper[0].children[0]) {
                    return;
                }

                view.scroll = new IScroll($wrapper[0], _.extend({
                    bounceTime: 300,
                    bindToWrapper: true
                }, option));


//                var scrolling = false;
//                view.scroll.on('scrollStart', function () {
//                    scrolling = true;
//                });
//                view.scroll.on('scrollEnd', function () {
//                    scrolling = false;
//                });
//
//                Joint.$(view.scroll.scroller).on('touchstart', function(event) {
//                    if(scrolling) {
//                        event.stopPropagation();
//                    }
//                });
            });
        });
    };
});