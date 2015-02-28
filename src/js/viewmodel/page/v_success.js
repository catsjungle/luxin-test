/**
 * 获取指定城市的电影列表
 */
define([
  'viewmodel/base', 'viewmodel/moviedata', 'backbone.joint',
  'util/date'], 
  function(
    Base, MovieData, Joint,
    udate) {
  var _ = Joint._;

  return Base.extend({
    loadinfo: function(cinemaId) {
      var vm = this;

      Joint.Deferred.when(MovieData.load('city', "city.json")
            ).then(function (cityinfo) {
                vm.sync("list");
            }, function () {
                vm.panic();
            });
    }
  });
});