define(['view/base', 'backbone.joint', 'fx/slider', 'fx/scroller', 'appRouter', 'tpl/ui_picker'], function (Base, Joint, slider, scroller, appRouter) {
    var parent = Base.prototype;

    var PickerView = Base.extend({
        template: require('tpl/ui_picker'),
        events: {
            'tap .btn-cancel': 'onTapCancel',
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
            //scroller(view.subView, {}, wrapperDefer.promise);
            view.subView.once('$J:render:full:done', function () {
                wrapperDefer.resolver.resolve(view.$('.subview'));
            });
        }),

        onTapK: function (event) {
            var view = this;

            view.key = view.subView.data.key = view.$(event.currentTarget).attr('k');
            view.subView.renderFields('', 'key');

            if (view.key) {
                var translate = Joint._.bind(view.subView.filterK || Joint._.identity, view.subView);
                Joint.Deferred.when(translate(view.key)).then(function (key) {

                    view.resolver.resolve(key);
                    view.remove();
                }, function (option) {
                    if (option && option.remove) {
                        view.remove();
                    }
                });
            }
//      view.subView.render();
        },

        remove: Joint.after(parent.remove, function () {
            this.resolver.reject();
            this.trigger('remove');
        }),
        onTapCancel: function (event) {
            this.remove();
        }
    }, {
        pick: function (title, subView) {
            var dfr = Joint.Deferred.defer();

            var p = new PickerView({
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

    return PickerView;
});
