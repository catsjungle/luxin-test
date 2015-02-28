define(['view/page/base', 'util/cinema' 'viewmodel/page/movie_spot', 'backbone.joint',
    'appRouter', 'tpl/movie_spot'], function(
      Base, CinemaDe, SpotVM, Joint, appRouter) {
      var parent = Base.prototype;
      var $ = Joint.$;

      return Base.extend({
        template: require('tpl/movie_spot'),
        events: {
          'tap [k]': 'selectMovie',
          'tap .js-movie-list': 'goMovieList'
        },

        initialize: Joint.after(parent.initialize, function(option) {
              var view = this;
              view.title = CinemaDe.title;
              view.setTitle(view.title);
              view.sync('vm', view.vm = new SpotVM(option));
              //view.handleError(view.vm);
        }),
        renderPromise: function () {
            return Joint.Deferred.listen(this.vm, ['$J:sync', true]);
        },
        selectMovie: function(event) {
          var view = this;
          var movieId = Joint.$(event.currentTarget).attr('k');
          appRouter.go('movie_info', movieId);
        },
        goMovieList: function(event) {
            var view = this;
            appRouter.go('movie_list');
        }
      });
});