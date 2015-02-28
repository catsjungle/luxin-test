define(['view/dialog/base', 'backbone.joint', 'view/base', 'tpl/dialog_content_message'], function(BaseDialog, Joint, Base) {
  var ContentView = Base.extend({
    template: require('tpl/dialog_content_message'),
    serializeData: Joint.after(Base.prototype.serializeData, function() {
      arguments.callee.state[0].returnValue = Joint._.extend({
        ok: false,
        cancel: false,
        msgClass: 'center simple-txt'
      }, arguments.callee.state[0].returnValue);
    })
  });

  var DialogView = BaseDialog.extend({
  }, {
    alert: function(message, title, data) {
      var dfr = Joint.Deferred.defer();
      var view = new ContentView;
      view.data = _.extend({
        message: message,
        ok: '确认'
      }, data);

      DialogView.open(view, title).on('close', function() {
        dfr.resolver.resolve();
      });

      return dfr.promise;
    },

    confirm: function(message, title, data) {
      var dfr = Joint.Deferred.defer();
      var view = new ContentView;
      view.data = _.extend({
        message: message,
        ok: '确认',
        cancel: '取消'
      }, data);

      DialogView.open(view, title, true).on('ok', function() {
        dfr.resolver.resolve();
      }).on('close', function() {
        dfr.resolver.reject();
      });

      return dfr.promise;
    }
  });

  return DialogView;
});
