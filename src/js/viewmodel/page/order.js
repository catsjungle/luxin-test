/**
 * 影院 详情默认ViewModel
 *
 *
 */
define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint', 'util/platform'], function (Base, MovieData, Joint, Platform) {
    var _ = Joint._;
    var parent = Joint.ViewModel.prototype;

    var mapState=function(state,expired_time){
        var map={
            "1": "unpayed",
            "2": "payed",
            "3": "finished",
            "6": "payed"
        };
        var now = new Date();
        if(now > new Date(expired_time) || !map[state]){
            state = '3';
        }
        return map[state];
    };


    return Base.extend({
        initialize: Joint.after(parent.initialize, function (option) {
            var vm = this;
            vm.platformId = Platform.Store.get();
            vm.viewtype=option.args[0]||'main';
            vm.orderId= _.size(option.args)>1?option.args[1]:0;

            //init
            vm.order_main={"payed":[],"unpayed":[],"finished":[]};
            vm.unpayOrder=[],vm.order=[];

            Joint.Deferred.when(
                MovieData.loadUnPayOrder(vm.platformId),
                MovieData.loadOrder(vm.platformId)
            ).then(function (unpayOrder, order) {
                    var up=[];            
console.log(unpayOrder)
                    var bool = (Object.prototype.toString.call(unpayOrder) == "[object Array]");
console.log(bool)
                    if (unpayOrder && !bool) {
                        up.push(unpayOrder);
                    }
console.log(up)
                    if (vm.viewtype=='main'){
                        vm.order_main= _.extend(vm.order_main,_.groupBy(up,function(o){return mapState(1, '99999999999')}));
                        vm.order_main= _.extend(vm.order_main,_.groupBy(order,function(o){return mapState(o.state, o.expired_time)}));


                        //张数求和
                        _.each(['unpayed','payed','finished'], function(s) {
                            //vm.order_main[s]=_.reduce(vm.order_main[s],function(m,o){return m + o.ticketCount},0);
                            vm.order_main[s]=vm.order_main[s].length;
                        })
                    }else{
                        vm.unpayOrder= up||[];
    //                    vm.order= order;
                        order = order||[];
                        vm.finishOrder= _.filter(order,function(o){return mapState(o.state, o.expired_time)=='finished'});
                        vm.payOrder= _.filter(order,function(o){return mapState(o.state, o.expired_time)=='payed'});
                        vm.orderDetail= _.find(unpayOrder,function(o){ return o.sTempOrderID==vm.orderId; });
                        vm.orderDetail = vm.orderDetail||_.find(order,function(o){ return o.order_id==vm.orderId; });
                    }
                    vm.sync();
            });

        }),
        checkOrderStatue: function(orderId) {
            var vm=this;
            return Joint.Deferred.when(
                    MovieData.loadUnPayOrder(vm.platformId)
                ).then(function (unpayOrder) {
//                    var torder=_.filter(unpayOrder,function(o){return o.sTempOrderID==orderId});
                    var r;
                    var torder=(unpayOrder.sTempOrderID==orderId?unpayOrder:0);
                    if (!torder) {
                        r= {'status':1001,'msg':'提示：订单已支付或已超时！'};
                    }else  if (torder.iValidTime<1) {
                        r={'status':1002,'msg':'提示：支付时间已超时，请重新下单！'};
                    }else {
                        r= _.extend({'status':1,'msg':''},unpayOrder);
                    }
                    return Joint.Deferred.resolve(r);
                });
        }

    });
});