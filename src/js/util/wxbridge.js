define(['backbone.joint'], function (Joint) {
    var _ = Joint._;
    var WxBridge = Joint.Emitter.extend({
        constructor: function() {
            var self = this;
            var dfr = Joint.Deferred.defer();
            self._promise = dfr.promise;
            self._resolver = dfr.resolver;
            if('WeixinJSBridge' in window && _.isFunction(window.WeixinJSBridge.invoke)) {
                resolve();
            } else {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', resolve, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', resolve);
                    document.attachEvent('onWeixinJSBridgeReady', resolve);
                }

                if(Joint.$.browser.wechat) {
                    this._timer = setInterval(function() {
                        if ('WeixinJSBridge' in window && _.isFunction(window.WeixinJSBridge.invoke)) {
                            resolve();
                        }
                    }, 500);
                }
            }

            function resolve() {
                self.resolve();
            }
        },
        resolve: function() {
            this._resolver.resolve(window.WeixinJSBridge);
            if (Joint.$.browser.wechat) {
                clearInterval(this._timer);
            }
        },
        getBridge: function() {
            return this._promise;
        }
    });

    return new WxBridge;
});