define(['view/base', 'backbone.joint', 'fx/scroller', 'view/dialog/message'], function(Base, Joint, scroller){
    var parent = Base.prototype;
    return Base.extend({
        initialize: Joint.after(parent.initialize, function() {
            if(this.scrollOption) {
                scroller(this, this.scrollOption, Joint._.result(this, '$scrollContent'));
            }
        }),
        renderPromise: function() {
            return Joint.Deferred.listen(this, ['$J:render:full:done', true]);
        },
        remove: Joint.before(parent.remove, function() {
            if(this.scrollOption && this.scroll) {
                this.scroll.destroy();
            }
        }),
        renderHtml: Joint.after(parent.renderHtml, function() {
            arguments.callee.state[0].returnValue = Joint.Deferred.when(arguments.callee.state[0].returnValue)
            .then(function(html) {
                return "<section class='page'>" + html + "</section>";
            });
        }),
        scrollOption: {
            scrollbars: true,
            preventDefault: true
        },
        setTitle : function(t){
            document.title = t;
        },
        handleError: function(emitter, handler) {
            var view = this;
            view.listenTo(emitter, 'error', function () {
                if(handler) {
                    handler.apply(view, arguments);
                } else {
                    //循环依赖
                    require('view/dialog/message').alert('读取失败，请稍候再试').then(function () {
                        history.go(-1);
                    });
                }
            });
        }
    }, {
        needLogin: true
    });
});