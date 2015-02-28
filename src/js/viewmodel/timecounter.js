define(['backbone.joint'], function (Joint) {
    var parent = Joint.ViewModel.prototype;
    var _ = Joint._;

    return Joint.ViewModel.extend({
        initialize: Joint.after(parent.initialize, function(option) {
            var vm = this;
            vm.start = new Date();
            if(option.expire) {
                vm.end = new Date(vm.start.valueOf() + parseInt(option.expire, 10));
            } else if(option.end) {
                vm.end = new Date(option.end);
            } else {
                vm.end = vm.start;
            }

            vm.interval = option.interval || 300;


            vm.listenerCount = 0;
            vm.on('$J:sync:start', function() {
                vm.listenerCount++;
                if(vm.listenerCount == 1) {
                    _.defer(_.bind(vm.tick, vm));
                }
            }).on('$J:sync:end', function() {
                vm.listenerCount--;
            });
        }),
        tick: function() {
            var vm = this;

            vm.now = new Date();

            if(vm.now >= vm.end) {
                vm.isEnd = true;
                vm.sync('tick');
                vm.trigger('end');
            } else {
                vm.sync('tick');
                if(vm.listenerCount > 0) {
                    setTimeout(_.bind(vm.tick, vm), vm.interval);
                }
            }
        },
        remain: function() {
            var units = [60, 60, 24];
            var cur = 0;
            var result = [parseInt((this.end - this.now) / 1000), 0, 0, 0];

            while(units[cur] && result[cur] > units[cur]) {
                result[cur + 1] = parseInt(result[cur] / units[cur]);
                result[cur] = result[cur] % units[cur];
                cur++;
            }

            return result;
        }
    });
});