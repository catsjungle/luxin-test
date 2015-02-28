define([
  'backbone.joint',
  'view/ui/citypicker',
  'util/cookie',
  'viewmodel/moviedata','util/platform'
], function (Joint, CityPicker, cookie, MovieData, Platform) {
    var City = {
        Store: {
            get: function() {
                return {'city_id':cookie('cityid'),'cinema_id':cookie('cinemaid')};
            },
            set: function(cid) {                
                if(cid&&cid.toString().indexOf(",")!=-1){
                    cookie('cityid', cid.toString().substring(0,cid.toString().indexOf(',')), {expires: 3});
                    cookie('cinemaid', cid.toString().substring(cid.toString().indexOf(',')+1), {expires: 3});
                }else
                {
                  cookie('cityid', cid, {expires: 3});
                }
            }
        },
        loadCity: function(cinema_id) {
            return MovieData.loadCinemalist(Platform.Store.get()).then(function(data) {
                var current = _.findWhere(data.hot, {id: cinema_id});
                if(!current){
                  current = _.findWhere(data.normal, {id: cinema_id});
                }
                return current;
                //return (_.size(data)===1)?data[0]:_.findWhere(data, {id: cinema_id});
            });
        },
        decideCity: function(name) {
//            cookie.remove('cinemaid');
//            cookie.remove('cityid');
            var noCityPage=['order'];
            if (Joint._.include(noCityPage,name)){
                return Joint.Deferred.resolve();
            }
            var selectedCity = 210;//City.Store.get();

            return Joint.Deferred.when(City.loadCity(selectedCity.cinema_id)).then(function(cinema){
                if (cinema) {
                    selectedCity.cinema_id=cinema.id;
                    selectedCity.city_id=cinema.city_id||selectedCity.city_id||'10';
                    return Joint.Deferred.resolve(selectedCity);
                } else {
                    return City.select();
                }
            });


        },

        pick: function (movieId) {
            return CityPicker.pick(movieId).then(this.set);
        },

        //傻逼交互，pick=选择后要确定取消，select=不要确定取消
        select: function (movieId) {
            return CityPicker.select(movieId).then(this.set);
        },

        set: function(id) {
            //id = parseInt(id);
            if(!id) {
                return Joint.Deferred.reject(id);
            }

            City.Store.set(id);
            return Joint.Deferred.resolve.apply(null, arguments);
        },

        detectCity: function() {
          var dfr = Joint.Deferred.defer();
          try {
            var cityService = new soso.maps.CityService({
              complete: function(result) {
                MovieData.load('city', "city.json").then(function(cityList) {
                  try {
                    var indexList = _.chain(cityList.list).map(function(city, cityId) {
                      return _.extend({}, city, {id: cityId});
                    }).indexBy('name').value();

                    var cityName = _.chain(cityList.list).pluck('name').find(function(cityName) {
                      return result.detail.detail.indexOf(cityName) != -1;
                    }).value();

                    dfr.resolver.resolve(indexList[cityName]);
                  } catch (e) {
                    dfr.resolver.resolve();
                  }
                });
              },
              error: function(err) {
                dfr.resolver.resolve()
              }
            });

            try {
              navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = new soso.maps.LatLng(position.coords.latitude, position.coords.longitude);
                cityService.searchCityByLatLng(latlng);
              }, function(positionError) {
                cityService.searchLocalCity();
              }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 3600000
              });
            } catch (ee) {
              cityService.searchLocalCity();
            }
          } catch (e) {
            _.defer(dfr.resolver.resolve);
          }

          return dfr.promise;
        },
        currentPosition:function(func, view){
            var pos={};
            try {
                navigator.geolocation.getCurrentPosition(function(position) {
                    _.extend(pos, {latitude:position.coords.latitude,longitude:position.coords.longitude});
                    if (func) func(view,pos);
                }, function(positionError) {
                    if (func) func(view);
                }, {
                    enableHighAccuracy: false,
                    timeout: 2000,
                    maximumAge: 3600000
                });
            } catch (ee) {
                if (func) func(view);
            }
            return pos;
        }
    };

    return City;
});