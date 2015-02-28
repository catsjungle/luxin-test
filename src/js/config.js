require.config({
    "shim": {
        underscore: {
            exports: '_'
        },
        "backbone.joint": {
            deps: ["backbone"]
        },
        backbone: {
            deps: ["underscore", "zepto", "deferred", "zepto.plugins"],
            exports: "Backbone"
        },
        iscroll: {
            exports: "IScroll"
        },
        deferred: {
            deps: ["zepto"]
        },
        "zepto.plugins": {
            deps: ["zepto"]
        }
    },
    paths: {
        app: 'view/main'
//        qqmap: 'http://map.qq.com/api/js?v=2.exp&key=KK6BZ-KX634-2V2U7-D6LIS-4VDHT-RPBAX'
   },
    baseUrl: './js/'
});