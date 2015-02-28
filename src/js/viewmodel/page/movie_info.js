/**
 * 获取指定城市的电影列表
 */
define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint', 'util/date', 'util/platform'], function (Base, MovieData, Joint, udate,Platform) {
    var parent = Base.prototype;
    var _ = Joint._;

    return Base.extend({
        initialize: Joint.after(parent.initialize, function (option) {
            //debugger;
            var vm = this;
            var cityId = option.cityId;
            var movieId = option.args[0];
            vm.platformId = Platform.Store.get();
            Joint.Deferred.when(
                MovieData.loadMovie(movieId),
                MovieData.loadMovieSpot(vm.platformId)
            ).then(function (movieinfo,movies) {
                var iswill=movieId.toString().indexOf("will")!=-1?true:false;
                if (iswill) {movieId=movieId.substring(4);}
                movieinfo["vflagclass"]=movieinfo.v_flag==0?"not-MV":"";
                var mInfo = _.find(movies,function(m){return m.id==movieinfo.id});
                movieinfo["flag_sche"]=mInfo?parseInt(mInfo.flag_have_sche,10):0;
                vm.movieinfo=movieinfo;
                vm.sync();
            }, function () {
                vm.panic();
            });
        })
    });
});