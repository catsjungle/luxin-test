/**
 * 获取指定城市的电影列表
 */
define([
  'viewmodel/base', 'viewmodel/moviedata', 'backbone.joint',
  'util/date', 'util/platform', 'util/cookie'],
  function(
    Base, MovieData, Joint,
    udate, Platform, cookie) {
  var _ = Joint._;

  return Base.extend({
    loadMovies: function(cityId,cinemaId) {

      var vm = this;
      vm.platformId = Platform.Store.get();
      Joint.Deferred.when(
                //MovieData.loadMovieByCity(cityId),//获取当前城市电影上映列表
                MovieData.loadCinemaContent(vm.platformId,cinemaId),//获取影院信息
                //MovieData.getScheduleList(cityId, cinemaId, movieId),
                MovieData.getScheduleList(vm.platformId,cityId, cinemaId, null)//获取当前影院电影排期
            ).then(function (cinemaInfo, movieSches) {
                vm.movieSches = movieSches;
                vm.cinemaInfo = cinemaInfo;
                vm.sync('list');
            }, function () {
                cookie.remove('cinemaid');
                cookie.remove('cityid');
                vm.panic();
            });

    }
  });
});