define(['view/base', 'backbone.joint', 'appRouter', 'tpl/dialog_base'], function(Base, Joint, appRouter) {
  var parent = Base.prototype;
  var isOpened = false;

  var DialogView = Base.extend({
    template: require('tpl/dialog_base'),
    events: {
      'tap .btn-ok': 'onOk',
      'tap .btn-cancel': 'onCancel',
      'tap .btn-close': 'onClose',
      'tap .full-screen': 'onOther'
    },

    initialize: Joint.after(parent.initialize, function(option) {
      var view = this;
      view.$el.css({
        zIndex: 30000,
        position: 'relative',
        overflow: 'visible'
      });
      view.listenToOnce(appRouter, 'route', function() {
        view.close();
      });
      view.setView('.dialog_content', option.contentView);
      view.noDefault = option.noDefault;
    }),

    remove: Joint.after(parent.remove, function() {
      this.trigger('close');
    }),

    close: function() {
      try{
          this.remove();
      }catch(exp){
      //
      }
      isOpened = false;
    },
    onClose: function(event) {
      this.close();
    },
    onCancel: function(event) {
      this.trigger('cancel');
      this.close();
    },
    onOk: function(event) {
      this.trigger('ok');
      this.close();
    },
    onOther: function(event) {
      var view = this;
      if (!view.noDefault) {
        view.close();
      }
    }
  }, {
    open: function(view, title, noDefault, content) {
      if (!isOpened) {
        var dialog = new this({contentView: view, noDefault: noDefault});
        dialog.data.title = title || '';
        dialog.data.content = content || '';
        dialog.render().$el.appendTo(document.body);
        isOpened = true;

        return dialog;
      } else {
        return null;
      }
    }
  });

  return DialogView;
});