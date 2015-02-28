define([
  'view/base',
  'backbone.joint',
  'viewmodel/city',
  'view/ui/picker',
  'view/ui/selector',
  'viewmodel/moviedata',
  'view/dialog/message',
  'appRouter',
  'tpl/ui_citypicker'
], function (Base, Joint, CityVM, PickerView, SelectorView, MovieData, MessageView, appRouter) {
    var parent = Base.prototype;

    var CityPickerView = Base.extend({
        template: require('tpl/ui_citypicker'),
        events: {
            'tap h3': 'onTapPy'
        },
        initialize: Joint.after(parent.initialize, function (option) {
            var view = this;
            view.movieId = option.movieId;
            view.data.pyOpen = {
                hot: true,
                gps: true,
                "":true
            };
            view.sync('vm', view.vm = new CityVM);
            view.render();
            view.vm.loadList();
        }),
        onTapPy: function (event) {
            var view = this;
            var py = view.$(event.currentTarget).attr('py');
            view.data.pyOpen[py] = !view.data.pyOpen[py];
            view.renderFields('', 'pyOpen');
        },

        filterK: function(k) {
          var view = this;
          if (view.movieId) {
            return MovieData.getCinemaByCityAndMovie(k, view.movieId).then(function(cinemaWithSche) {
              var match = _.find(_.flatten(_.values(cinemaWithSche)), function(cinemaInfo) {
                return (cinemaInfo.flag_seat_ticket == 1 || cinemaInfo.flag_elec_ticket == 1 || cinemaInfo.flag_groupon == 1) && cinemaInfo.allCount;
              });
              if (!match) {
                return Joint.Deferred.when(
                    view.vm.loadCity(k),
                    MovieData.loadMovie(view.movieId)
                  ).then(function(city, movie) {
                    return MessageView.confirm('您选择的城市' + city.name + '，暂时没有《' + movie.name + '》电影的排期', null, {
                      ok: '确认',
                      cancel: '重选'
                    });
                  }).then(function() {
                    appRouter.go('movie_list');
                    return k;
                  }, function() {
                    return Joint.Deferred.reject();
                  });
              } else {
                return k;
              }
            }, function() {
              return Joint.Deferred.resolve(k);
            })
          } else {
            return k;
          }
        }
    }, {
        pick: function (movieId) {

            var p = new CityPickerView({movieId: movieId});

            return PickerView.pick('更换城市', p);
        },

        //傻逼交互，pick=选择后要确定取消，select=不要确定取消
        select: function (movieId) {
            var p = new CityPickerView({movieId: movieId});

            return SelectorView.select('更换城市', p);
        }
    });

    return CityPickerView;
});
