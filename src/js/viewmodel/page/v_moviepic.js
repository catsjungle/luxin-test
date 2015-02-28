/**
 * 获取指定城市的电影列表
 */
define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint', 'util/date'], function (Base, MovieData, Joint, udate) {
    var parent = Base.prototype;
    var _ = Joint._;

    return Base.extend({
        initialize: Joint.after(parent.initialize, function (option) {
            var vm = this;
            var movieId = option.args[0];
            vm.pageIndex=option.args[1];
            Joint.Deferred.when(
                    MovieData.loadMovie(movieId)
                ).then(function (movieinfo) {
                    vm.movieinfo=movieinfo;
                    vm.sync();
                }, function () {
                    vm.panic();
                });
        })
    });
});
