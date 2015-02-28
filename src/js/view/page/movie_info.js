define([
    'view/page/base',
    'viewmodel/page/movie_info',
    'backbone.joint',

    'appRouter',
    'view/dialog/message',
    'util/date',
    'tpl/tpl_movie_info'
], function (Base, MovieScheVM, Joint
    , appRouter,  MessageView
    ,udate,tpl_movie_info) {
    var parent = Base.prototype;
    return Base.extend({
        template: require('tpl/tpl_movie_info'),

        events: {
            "tap .btngotobuy":"gobuy",
            "tap .morepic":"morepic",
            "tap .moremoive":"moremoive",
            "tap .showbigimg":"showbigimg",
            "tap .showbigimgidv":"closeimgdiv"
        },
        closeimgdiv:function(event){
            var view=this;          
            $(".bigimg").attr("src","")
            $(".columns").html("");
            $(".showbigimgidv").css("display","none");
        },
        showbigimg:function(event){
            var view=this;
            var me=view.$(event.currentTarget);
            appRouter.go('movie_pic',view.data.movie_id ,me.attr("num"));
            /*
                        
            $(".bigimg").attr("src",me.attr("ghref"))
            $(".columns").html(me.attr("num")+" / "+me.attr("allcount"));
            $(".showbigimgidv").css("display","");
            */
        },
        morepic:function(event){
            var view=this;
            //跳转到影院排期页
            appRouter.go('movie_info_more', view.vm.movieinfo.id,"pic");
        },
        moremoive:function(event){
            var view=this;
            //跳转到影院排期页
            appRouter.go('movie_info_more', view.vm.movieinfo.id,"movie");
        },
        gobuy:function(event){
            var view=this;
            //跳转到影院排期页
            appRouter.go('movie_list');
        },
        initialize: Joint.after(parent.initialize, function (option) {
            var view = this;
            view.data.movie_id = option.args[0] ? option.args[0]:'tt';
            view.data.daystr = udate.getDayStr();
            view.sync('vm', view.vm = new MovieScheVM(option));
            view.handleError(view.vm);

            view.listenToOnce(view.vm, '$J:sync', function () {
                //view.setTitle(view.vm.movieinfo.name);
            });
        }),

        onOpenTab: function (event) {
            var view = this;
            view.$(event.currentTarget).closest('.js_movie_title').toggleClass('current');

            Joint._.defer(function() {
                view.scroll.refresh();
                view.scroll.scrollToElement(event.currentTarget);
            });
        }
    });
});