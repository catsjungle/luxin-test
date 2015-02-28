/**
 * 获取指定城市的电影列表
 */
define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint', 'util/date'], function (Base, MovieData, Joint, udate) {
    var parent = Base.prototype;
    var _ = Joint._;

    return Base.extend({
        initialize: Joint.after(parent.initialize, function (option) {
            var vm = this;
            var cityId = option.cityId;
            var movieId = option.args[0];
            var type=option.args[1];
            if(type=="pic"){
                vm.ispic=true;
                vm.ismovie=false;
            }else if(type=="movie"){
                vm.ispic=false;
                vm.ismovie=true;
            }

            Joint.Deferred.when(
                MovieData.loadMovie(movieId)
            ).then(function (movieinfo) {
                vm.movieinfo=movieinfo;
                vm.sync();
                /*
                return Joint.Deferred.when(
                        MovieData.getMoreMovieList(vm.movieinfo.coverid, (Joint.$.os.ios ? 1 : 2),vm.ismovie)
                );
            }).then(function (movielist) {
                vm.movielist=movielist;
                vm.sync();
                */
            }, function () {
                vm.panic();
            });
        })
    });
});