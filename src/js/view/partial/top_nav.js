define(['view/base', 'backbone.joint', 'tpl/top_nav'], function(Base, Joint) {
    var parent = Base.prototype;
    return Base.extend({
        template : require('tpl/top_nav')
    });
});