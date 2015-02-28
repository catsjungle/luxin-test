define([
  'view/page/base',
  'backbone.joint',
  'appRouter',
  'viewmodel/page/v_success',
  'tpl/tpl_success'
], function(Base, Joint, appRouter,SuccessVM) {
  var parent = Base.prototype;
  var _ = Joint._;

  return Base.extend({
    template: require('tpl/tpl_success'),

    events: {
      'tap .gomylist':'funcgomylist',//显示当前电影的总排期
    },
     funcgomylist: function() {
      var view = this;
      appRouter.go('my_list');
    },
    initialize: Joint.after(parent.initialize, function(option) {
      var view = this;
      view.setTitle('鲁信影城济南振兴街影城');
      view.sync('vm', view.vm = new SuccessVM);
      view.vm.loadinfo(option.cinemaId);
      view.handleError(view.vm);
      view.render();
    }),
    renderPromise: function () {
      return Joint.Deferred.listen(this.vm, ['$J:sync', true]);
    },

    $scrollContent: function() {
      var view = this;
      return Joint.Deferred.listen(view, ['$J:render:full:done', function() {
        return view.$('.content').addClass('wrapper').wrapInner('<div>');
      }]);
    }
  });
});