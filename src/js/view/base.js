define(['backbone.joint', 'zepto'], function (Joint, $) {
    var when = Joint.Deferred.when;
    return Joint.View.extend({
        initialize: Joint.after(Joint.View.prototype.initialize, function (options) {
            if (options && options.template) {
                this.template = options.template;
            }
        }),

        fetchTemplate: function () {
            return this.template;
        },
        renderHtml: function (tpl, data) {
            return tpl(data);
        }
    });
});