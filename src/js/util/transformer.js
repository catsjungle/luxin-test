//暂时写死webkit，不管WP了
define(['backbone.joint'], function (Joint) {
    return Joint.Emitter.extend({
        constructor: function($el) {
            this.$el = $el;
            this.el = $el[0];
            return this;
        },

        setOrigin: function(value) {
//            this.$el.css({
//                'transform-origin': value,
//                '-webkit-transform-origin': value
//            });
            this.el.style.webkitTranformOrigin = value;
        },

        set: function(name, param) {
            var o = this.get();
            o[name] = param;
            this.setAll(o);
        },

        setAll: function(o) {
            var str = Joint._.map(o, function(param, key) {
                return key+"("+param.join(',')+")";
            }).join(' ');
//            this.$el.css({
//                '-webkit-transform': str,
//                'transform': str
//            });

//            console.log(str);

            this.el.style["webkitTransform"] = str;
        },

        get: function() {
            var t = this.el.style.webkitTranform || '';
            var result = {};
            t.replace(/([a-z0-9]+)\s*\((.+?)\);?/gi, function(a, key, param) {
                result[key] = param.split(/\s*,\s*/);
            });

            return result;
        }
    });

});