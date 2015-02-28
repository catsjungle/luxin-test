define(['view/page/base', 'viewmodel/page/cinema_content', 'backbone.joint',
    'appRouter', 'tpl/cinema_content'], function(
      Base, CinemaVM, Joint, appRouter) {
      var parent = Base.prototype;
      var $ = Joint.$;

      return Base.extend({
        template: require('tpl/cinema_content'),
        events: {
            'tap .js-buy': 'onBuy',
            'tap .js-map': 'onMap'
        },
        initialize: Joint.after(parent.initialize, function(option) {
              var view = this;
              view.setTitle('鲁信影城济南振兴街影城');
              view.sync('vm', view.vm = new CinemaVM(option));
              //view.handleError(view.vm);
        }),
        renderPromise: function () {
            return Joint.Deferred.listen(this.vm, ['$J:sync', true]);
        },
        onBuy: function(){
            var view = this;
            appRouter.go('movie_list');
        },
        onMap: function(){
            var view = this;

            location.href='map.html?lat=' + view.vm.cinema.latitude + '&lon=' + view.vm.cinema.longitude +
            '&cname=' + encodeURIComponent(view.vm.cinema.name) + '&caddr=' + encodeURIComponent(view.vm.cinema.addr);
            //appRouter.go('map' ,view.vm.cinema.latitude,view.vm.cinema.longitude );
        }
      });
});