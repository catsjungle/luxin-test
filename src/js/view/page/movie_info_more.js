define([
    'view/page/base',
    'viewmodel/page/movie_info_more',
    'backbone.joint',

    'appRouter',
    'view/dialog/message',
    'util/date',
    'tpl/tpl_movie_info_more'
], function (Base, MovieInfoMoreVM, Joint, 
    appRouter, MessageView, udate) {
    var parent = Base.prototype;
    return Base.extend({
        template: require('tpl/tpl_movie_info_more'),
        events: {
            "tap .showbigimg":"showbigimg",
            "tap .showbigimgidv":"closeimgdiv",
            "tap .playmovie":"playmovie",
            "tap .js_gobuy":"gobuy"
        },
        gobuy:function(event){
            var view=this;
            //跳转到影院排期页

            appRouter.go('cinema_scheduler', view.vm.movieinfo.id);
        },
        playmovie:function(event){
            var view=this;
            var me=view.$(event.currentTarget);
            location.href="movie_player.html?vid="+me.data("vid")+"&title="+encodeURIComponent(me.data("name"));
        },
        closeimgdiv:function(event){
            var view=this;          
            $(".bigimg").attr("src","");
            $(".columns").html("");
            $(".showbigimgidv").css("display","none");
        },
        showbigimg:function(event){
            var view=this;
            var me=view.$(event.currentTarget);
            appRouter.go('movie_pic',view.data.movie_id ,me.attr("num"));
        },
        initialize: Joint.after(parent.initialize, function (option) {
            var view = this;
            view.data.movie_id = option.args[0] ? option.args[0]:'tt';
            view.data.daystr = udate.getDayStr();
            view.sync('vm', view.vm = new MovieInfoMoreVM(option));
            view.handleError(view.vm);
//
//            view.listenToOnce(view.vm, '$J:sync', function () {
//                //view.setTitle(view.vm.movieinfo.name);
//            });
        })
    });
});