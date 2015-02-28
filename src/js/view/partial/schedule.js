define(['view/base', 'backbone.joint', 'util/date', 'view/dialog/message', 'tpl/partial_schedule'], function (Base, Joint, udate, MessageView) {
    var parent = Base.prototype;
    var _ = Joint._;
    return Base.extend({
        template: require('tpl/partial_schedule'),
        events: {
            'tap .js_latemsg': function() {
                MessageView.alert('即将开场目前已停止售卖<br>请选择其他场次订座');
            },
            'tap .showschedate':'funcshowschedate',//显示某天排期
            //'click .selected':'funcselected'
            'change .selected':'funcselected'
        },
        initialize: Joint.after(parent.initialize, function () {
            this.data.timeIcon = {
                "true": 'ico-sun',
                "false": 'ico-moon'
            };
            this.data.daystr = udate.getDayStr();
        }),
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
        setSches: function (sches, current, moveid) {
            this.data.sches = sches;
            this.data.current = current;
            this.data.movie_id = moveid;
        }
    }, {
        create: function (sches, current, moveid) {
            var v = new this;
            v.setSches(sches, current, moveid);

            return v;
        }
    });
});

