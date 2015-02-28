define(['backbone.joint', 'viewmodel/moviedata', 'appRouter', 'util/wxbridge'], function (Joint, MovieData, appRouter, wxbridge) {
    var _ = Joint._;
    var page_begin = window.page_begin || 0;

    appRouter.on('route', function () {
        if(!appRouter.first) {
            appRouter.first = true;
            appRouter.begin = page_begin;
        } else {
            appRouter.begin = new Date().getTime();
        }
    });
    appRouter.on('page-render', function () {
        var now = new Date().getTime();
        var begin = appRouter.begin;
        if(!begin) return;
        delete appRouter.begin;

        report({
            action: "pvuv",
            dom_begin: begin,
            dom_end: now,
            page_time: now - begin
        });
    });

    function report(data) {
        var img = new Image(1, 1);
        img.src = "//mp.weixin.qq.com/mp/comm_report?" + _.chain({
            version: "1.0",
            appid: "wx92cf60f7577e2d48",
            url: location.href,
            openid: MovieData.session.openid || '',
            uin: MovieData.session.wxauin || ''
        }).extend(data).map(function(v, k) {
            return [k, encodeURIComponent(v)].join('=');
        }).value().join('&');

//        console.log(img.src);
    }

    wxbridge.getBridge().then(function(Bridge) {
        Bridge.invoke("getNetworkType", {}, function(r) {
            var now = new Date().getTime();
            report({
                action: "stat",
                dom_begin: page_begin,
                js_api_end: now,
                page_time: now - page_begin,
                net_type: r.err_msg
            });
        })
    });
});
