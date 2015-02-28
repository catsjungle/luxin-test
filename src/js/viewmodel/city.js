define([
  'viewmodel/base','viewmodel/moviedata','backbone.joint',
  'util/platform','util/city'
], function (
  Base, MovieData, Joint
  ,Platform) {
    var _ = Joint._;

    return Base.extend({
        loadList: function() {
            var vm = this;
            var platformId=Platform.Store.get();
            return Joint.Deferred.when(
                MovieData.loadCinemalist(platformId)
              ).then(function(data) {
              
//                data[0].city_id='10';
//                data[0].city_name='北京';
                // data[0].city_id='210';
                // data[0].city_name='广州';
                vm.hotlist = _.chain(data.hot)
                  .map(function(it, id) {/*it.id = id; */return it;})
                  //.sortBy(function(it) {return it.city_name;})
                  .groupBy(function(it)  {return it.city_name;})
                  .value();

                vm.list = _.chain(data.normal)
                  .map(function(it, id) {/*it.id = id; */return it;})
                  //.sortBy(function(it) {return it.city_name;})
                  .groupBy(function(it) {return it.city_name;})
                  .value();
                var cinemaID=require('util/city').Store.get().cinema_id;


                
                vm.current = _.findWhere(data.hot, {id: cinemaID});
                if(!vm.current){
                  vm.current = _.findWhere(data.normal, {id: cinemaID});
                  if(vm.current){
                    vm.citylist=vm.list[vm.current.city_name];
                  }
                }else{
                  vm.citylist=vm.hotlist[vm.current.city_name];
                }
                vm.sync('list');
              });

        },
        loadCurrent: function() {
            var vm = this;
            var cinema_id = require('util/city').Store.get().cinema_id;//循环引用
            return vm.loadCity(cinema_id).then(function(city) {
              
              vm.current = city;
              vm.sync('current');

            }, function() {
              vm.panic();
            });
        },

        loadCity: function(cinema_id) {
          //Platform.Store.get().cinema_id
          return MovieData.loadCinemalist(Platform.Store.get()).then(function(data) {
            var current = _.findWhere(data.hot, {id: cinema_id});
            if(!current){
              current = _.findWhere(data.normal, {id: cinema_id});
            }
            return current;
            //return _.findWhere(data, {id: cinema_id});
          });
        }
    });
});