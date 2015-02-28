define([
  'view/page/base',
  'viewmodel/page/v_movie_list',
  'backbone.joint',
  'view/partial/top_nav',
  'view/partial/banner',
  'appRouter',
  'viewmodel/moviedata',
  'view/dialog/message',
  'util/date',
  'viewmodel/city',
  'tpl/movie_list'
], function(Base, MovieListVM, Joint, ViewTopNav, BannerView, appRouter, MovieData,MessageView,udate,CityVM) {
  var parent = Base.prototype;
  var _ = Joint._;

  return Base.extend({
    template: require('tpl/movie_list'),

    events: {
      //'tap [k]': 'selectMovie',
      'tap .showschediv':'funcshowschediv',//显示当前电影的总排期
      'tap .showschedate':'funcshowschedate',//显示某天排期
      //'click .selected':'funcselected',
      'change .selected':'funcselected',      
      'tap .buy':'funcbuy',//去选座页
      'tap .gomovieinfo':'funcmovieinfo',//去影片详情页
      //'tap .js_change_city': 'onClickChangeCity',//切换影院
      'tap .js_go_cinemainfo': 'funcjs_go_cinemainfo',//影院详情页
      "tap .js_latemsg": function() {
        MessageView.alert('本场次已停止网络售票，你可以在影院前台购买。',null,{ok: '知道了'});
      }
    },
    funcjs_go_cinemainfo: function() {
      var view = this;
      appRouter.go('cinema_content', view.data.cinemaId);
    },
     onClickChangeCity: function() {
      this.trigger('change_city');
    },
    funcmovieinfo:function(event){
      var view = this;
      appRouter.go('movie_info', $(event.currentTarget).data('movieid'));

    },
    funcbuy:function(event){
      var view = this;
      location.href=Joint.$(event.currentTarget).data('url');

    },
    funcselected:function(event){
      var view = this;
      if(event.currentTarget.value.toString()==""){return;}
      var txt=event.currentTarget.value.toString().split(",");
      var date = txt[0];//event.currentTarget.value.toString().substring(0,event.currentTarget.value.toString().indexOf(","));
      var movieId = txt[1];//event.currentTarget.value.toString().substring(event.currentTarget.value.toString().indexOf(",")+1);
      $(".dl_"+movieId).css("display","none");
      $("#dl_"+date).css("display","");

      $(event.target).parent().siblings("li").removeClass("current");
      $(event.target).parent().addClass("current");
      //view.renderFields('', 'key')

    },
    funcshowschedate:function(event){
      var view = this;
      var date = Joint.$(event.currentTarget).data('date');
      var movieId = Joint.$(event.currentTarget).data('movieid');
      $(".dl_"+movieId).css("display","none");
      $("#dl_"+date).css("display","");

      $(event.target).parent().siblings("li").removeClass("current");
      $(event.target).parent().addClass("current");

    },
    funcshowschediv:function(event){
      var view = this;
      var movieId = Joint.$(event.currentTarget).data('movieid');
      if ($(event.currentTarget).attr('class').indexOf('showselected')==-1) {
        $(event.currentTarget).addClass("showselected");
        $(event.currentTarget).addClass("current");
        $("#ul_movie"+movieId).css("display","");
        $("#div_movie"+movieId).css("display","");

       // debugger; //added by jackey! auto scroll
       // view.scroll.scrollToElement(document.querySelector("#li_movie"+movieId),100);
      }else
      {
        $(event.currentTarget).removeClass("showselected");
        $(event.currentTarget).removeClass("current");
        $("#ul_movie"+movieId).css("display","none");
        $("#div_movie"+movieId).css("display","none");
      }
      //view.renderFields('', 'key')

    },
    initialize: Joint.after(parent.initialize, function(option) {
      var view = this;
      view.data.daystr = udate.getDayStr();
      view.setTitle('鲁信影城济南振兴街影城');

      view.data.movie_id="";
      view.data.cinemaId = option.cinemaId;
      view.sync('vm', view.vm = new MovieListVM);
      view.vm.loadMovies(option.cityId,view.data.cinemaId);
      view.sync('city', view.city = new CityVM);
      view.city.loadCurrent();

      view.handleError(view.vm);
      view.handleError(view.city);

      view.render();
    }),

    renderPromise: function () {
      return Joint.Deferred.listen(this.vm, ['$J:sync', true]);
    },

    $scrollContent: function() {
      var view = this;
      return Joint.Deferred.listen(view, ['$J:render:full:done', function() {
         // debugger;
         // return view.$('.content').addClass('wrapper').wrapInner('<div>'); //recode by jackey
          return view.$('.movie-list').addClass('wrapper').wrapInner('<div>'); //recode by jackey
      }]);
    },
   // scrollOption: {
   //   snap:"li"
   // },
    selectMovie: function(event) {
      var view = this;
      var movieId = Joint.$(event.currentTarget).attr('k');
      //appRouter.go('cinema_scheduler', movieId);
      appRouter.go('movie_info', movieId);

    }
  }, {
     // needLogin: false
  });
});