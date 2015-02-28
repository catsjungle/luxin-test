define(['util/wxbridge', 'appRouter'], function (wxbridge, appRouter) {
    appRouter.on('route', listen);

    function listen() {
        wxbridge.getBridge().then(function(Bridge) {
            //分享到好友
            Bridge.on('menu:share:appmessage', function (argv) {
                var imgUrl = location.href.substring(0,location.href.lastIndexOf("/")+1)+"css/img/jydypic.jpg";
                var title = '鲁信影城济南振兴街影城';
                var desc = '电影票手机版，开启你的电影生活！随时随地，购票观影！';
                var backLink =location.href;
                Bridge.invoke("sendAppMessage", {
                    "appid": 'wx92cf60f7577e2d48',
                    "img_url": imgUrl, // 分享到朋友圈的缩略图
                    "img_width": "121", // 图片的长度
                    "img_height": "110", // 图片高度
                    "link": backLink, // 连接地址
                    "desc": desc, // 描述
                    "title": title // 分享标题
                }, function (res) {
                });
            });
            //分享到朋友圈
            Bridge.on('menu:share:timeline', function (argv) {
                var imgUrl = location.href.substring(0,location.href.lastIndexOf("/")+1)+"css/img/jydypic.jpg";
                var title = '鲁信影城济南振兴街影城';
                var desc = '电影票手机版，开启你的电影生活！随时随地，购票观影！';
                var backLink =location.href;
                Bridge.invoke("shareTimeline", {
                    "appid": 'wx92cf60f7577e2d48',
                    "img_url": imgUrl, // 分享到朋友圈的缩略图
                    "img_width": "121", // 图片的长度
                    "img_height": "110", // 图片高度
                    "link": backLink, // 连接地址
                    "desc": desc, // 描述
                    "title": title // 分享标题
                }, function (res) {
                });
            });
            //分享到微博
            Bridge.on('menu:share:weibo', function (argv) {
                Bridge.invoke('shareWeibo', {
                        "content": '电影票手机版，开启你的电影生活！随时随地，购票观影！',
                        "url": location.href
                    },
                    function (res) {});
            });
        });
    }
});


