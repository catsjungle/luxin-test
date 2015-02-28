define(['view/page/base', 'backbone.joint', 'tpl/debug'], function(Base, Joint) {
    var parent = Base.prototype;
    return Base.extend({
        template: require('tpl/debug'),
        events: {
            'tap [switch]': 'onTapSwitch'
        },
        initialize: Joint.after(parent.initialize, function(option) {
            var view = this;

            view.data.switches = 'skipQuerySeat,skipLogin,seatPC'.split(',');
            view.render();
        }),
        onTapSwitch: function(event) {
            var view = this;
            var name = view.$(event.target).closest('[switch]').attr('switch');

            localStorage['debug_'+name] = localStorage['debug_'+name] ? '' : 'on';
            view.render();

        }
    });
});