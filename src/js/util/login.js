define(['backbone.joint', 'viewmodel/moviedata', 'util/cookie', 'appRouter','util/platform'], function (Joint, MovieData, cookie, appRouter,Platform) {
    var _login = {
        ensure: function() {
            return _login.handleCode(location.href).then(function (data) {
                if (notRedirected(data)) {
                    return Joint.Deferred.resolve(true);
                }
                //console.log('ck passed' + location.hash);
            });
        },
        handleRoute: function(fragment) {
            fragment = /^(.*?)[\?&](.*?)$/.exec(fragment);
            if(!fragment) {
                appRouter.go();
                return;
            }

            //console.log(['hr',target,param].join('|'));
            return _login.handleCode(fragment[2]).then(function (data) {
                if (notRedirected(data)) {
                    appRouter.go(fragment[1]);
                }
            });
        },
        handleCode: function (param) {
            var self = this;
            param = appRouter.deparam(param);
            if(Joint._.isString(param.uin)) {
                MovieData.session.wxauin = param.uin;
            }
            return Joint._.isString(param.code) ? self.saveTokenToCGI(param.code) : self.checkLogin();
        },
        checkLogin: function () {
            if(localStorage.debug_skipLogin) {
                return Joint.Deferred.resolve(true);
            }
            //console.log('ck begin @' + location.href);
            var url = 'http://cgi.wxmovie.com/oauth?_=' + new Date().getTime();
            var o = {
                publicsignalshort:Platform.Store.get(),
                _client_redirect_: location.href
            };

            return MovieData.setupAjaxCross().then(function () {
                return $.post(url, o, 'json');
            }).then(function(o) {
                // console.log('--------');
                // console.log(o)
                // debugger
                if(o.openid) {
                    MovieData.session.openid = o.openid;
                }
                return o;
            });
        },
        saveTokenToCGI: function (code) {
            var url = 'http://cgi.wxmovie.com/oauth?=code' + new Date().getTime();
            //console.log('writing code' + code);
            var o = {
                publicsignalshort:Platform.Store.get(),
                code: code
            };
            return MovieData.setupAjaxCross().then(function () {
                return $.post(url, o, 'json');
            });
        }
    };

    return _login;

    function notRedirected(data) {
        //return true;
        // console.log(data);
        // debugger;
        
        if (data && data.ret == "302") {
            //console.log(data.redirectUrl);
            location.href = data.redirectUrl;
            // document.write('<a href="' + data.redirectUrl + '">redirect -> </a>' + data.redirectUrl);
            throw 'halt';
            // return false;
        }
        return true;
    }
});
