define(['view/page/base', 'viewmodel/page/order', 'backbone.joint',
    'appRouter','view/dialog/message', 'tpl/order'], function(
      Base, orderVM, Joint, appRouter, MessageView) {
      var parent = Base.prototype;
      var $ = Joint.$;
      var _ = Joint._;

      return Base.extend({
        template: require('tpl/order'),
        events: {
          'tap [k]': 'orderTap',
          'tap .js-topay': 'toPay',
          'tap .js-to-detail': 'toDetail'
        },

        initialize: Joint.after(parent.initialize, function(option) {
            var view = this;
            view.setTitle('鲁信影城济南振兴街影城');
            view.data.EOrderStatus={"1":"等待支付","2":"已支付","3":"已消费","6":"已发码","7":"已过期","8":"已取消","9":"已退款","10":"已退款","11":"发码失败","20":"已出票","21":"退款中","22":"退款失败","23":"已退款"};
            view.data.EStatusMsg={"2":"正在出票请稍后","21":"退款中","23":"已退款","9":"已退款","10":"已退款","11":"抱歉出票失败，请联系客服退款"};
            view.sync('vm', view.vm = new orderVM(option));
              //view.handleError(view.vm);
        }),
        renderPromise: function () {
            return Joint.Deferred.listen(this.vm, ['$J:sync', true]);
        },
        orderTap: function(event) {
            var view = this;
            var viewType = Joint.$(event.currentTarget).attr('k');
            var num = Joint.$(event.currentTarget).attr('c');
            if (num) appRouter.go('order',viewType);
        },
        toPay: function(event){
            var view=this;
            var oid = Joint.$(event.currentTarget).attr('oid');
            Joint.Deferred.when(view.vm.checkOrderStatue(oid)).then(function(r){
                if (r.status==1){
                    appRouter.go('seat', r.iCinemaID, r.schedulePricingId, 0);
                }else{
                    MessageView.alert(r.msg);
                }
            });
        },
        toDetail:function(event){
            var oid = Joint.$(event.currentTarget).attr('oid');
            appRouter.go('order', 'detail', oid);
        }
      });
});