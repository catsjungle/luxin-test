define([
    'viewmodel/base', 'backbone.joint', 'viewmodel/moviedata',
    'util/date'
], function (Base, Joint, MovieData, udate) {
    var parent = Base.prototype;
    var $ = Joint.$;
    var _ = Joint._;
    return Base.extend({
        initialize: Joint.after(parent.initialize, function (option) {
            var vm = this;

            //MovieData.loadJs('http://w.gaopeng.com/topic/wmovie/banner.json?_='+parseInt(new Date() / 1800000))
            //.then(function(){
            //    return JSON.parse(window.MovieData.data["banner"]).info
            //})
            MovieData.setupAjaxDefault()
            .then(function () {
                return $.getJSON('js/banner.json?_='+parseInt(new Date() / 1800000));
            })
            .then(function (items) {
                return _.filter(items, filterItem);
            })
            .then(function (items) {
                if (items && items.length > 0) {
                    vm.notEmpty = true;
                }
                vm.items = items;
                vm.sync();
            });

            function filterItem(item) {
                var today = new udate();
                var ymd = today.getYmd();
                switch(true) {
                    case _.has(item, 'ymdMax') && ymd > item.ymdMax:
                    case _.has(item, 'ymdMin') && ymd < item.ymdMin:
                        return false;
                    default:
                        return true;
                }
            }
        })
    });
});