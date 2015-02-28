define(['viewmodel/moviedata', 'backbone.joint'], function (MovieData, Joint) {
  var _ = Joint._;

  return Joint.ViewModel.extend({
      panic: function(o) {
          var vm = this;
          _.defer(function() {
              vm.trigger('error', o);
          });
      }
  });
});
