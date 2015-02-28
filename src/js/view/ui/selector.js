define(['view/base', 'backbone.joint', 'fx/slider', 'fx/scroller', 'appRouter', 'tpl/ui_selector'], function (Base, Joint, slider, scroller, appRouter) {
    var parent = Base.prototype;

    var SelectorView = Base.extend({
        template: require('tpl/ui_selector'),
        events: {
            'tap [k]': 'onTapK'
        },
        initialize: Joint.after(parent.initialize, function (option) {
            var view = this;
            slider(view);
            view.resolver = option.resolver;
            view.subView = option.subView;
            view.subView.data.key = null;

            view.once('$J:render:done', function () {
                view.setView('.subview', view.subView);
                view.subView.render();
            });

            var wrapperDefer = Joint.Deferred.defer();
            scroller(view.subView, {}, wrapperDefer.promise);
            view.subView.once('$J:render:full:done', function () {
                wrapperDefer.resolver.resolve(view.$('.subview'));
            });
        }),

        onTapK: function (event) {
            var view = this;
            var key = view.$(event.currentTarget).attr('k');

            var translate = Joint._.bind(view.subView.filterK || Joint._.identity, view.subView);
            Joint.Deferred.when(translate(key)).then(function (key) {
                view.resolver.resolve(key);
                view.remove();
            }, function (error) {
                if (error && error.remove) {
                    view.remove();
                }
            });
        },

        remove: Joint.after(parent.remove, function () {
            this.resolver.reject();
            this.trigger('remove');
        })
    }, {
        select: function (title, subView) {
            var dfr = Joint.Deferred.defer();

            var p = new SelectorView({
                resolver: dfr.resolver,
                subView: subView
            });
            p.data.title = title;

            p.render();

            var guard = appRouter.guardBack();
            p.on('remove', function () {
                guard.cancel();
            });
            guard.promise.then(function () {
                p.remove();
            });

            return dfr.promise;
        }
    });

    return SelectorView;
});
