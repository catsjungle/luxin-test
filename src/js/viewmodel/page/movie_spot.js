/**
 * 影院 详情默认ViewModel
 *
 *
 */
define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint', 'util/platform'], function (Base, MovieData, Joint, Platform) {
    var _ = Joint._;
    var parent = Joint.ViewModel.prototype;

    return Base.extend({
        initialize: Joint.after(parent.initialize, function (option) {
            var vm = this;
            vm.platformId = Platform.Store.get();
            Joint.Deferred.when(
                MovieData.loadMovieSpot(vm.platformId)
            ).then(function (movies) {
                vm.movies = _.extend({}, movies);
                vm.sync();
            });
        })
    });
});