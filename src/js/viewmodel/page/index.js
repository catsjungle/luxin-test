define(['viewmodel/moviedata', 'backbone.joint'], function (MovieData, Joint) {
    var parent = Joint.ViewModel.prototype;
    return Joint.ViewModel.extend({
        initialize: Joint.after(parent.initialize, function(option) {
            var vm = this;
            var name = "movies_city_" + option.cityId;
            MovieData.load(name, "movies/cities/" + option.cityId + "/" + name + ".json").then(function(data) {
                vm.movies = data.info;
                vm.sync();
            });
        }),
        
        loadWillMovie: function() {
            var vm = this;
            var name = 'movies_will';

            return MovieData.load(name, "movies/" + name + ".json").then(function(data) {
                vm.will_movies = data.info;
                vm.sync('will_movies');
            });
        },
        
        movies: false,
        will_movies: false
    });
});