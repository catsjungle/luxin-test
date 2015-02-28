define(['backbone.joint'], function(Joint) {
  return function(view) {
    view.once('$J:render:done', function() {
      Joint.$('#main').transition(500, function() {
        Joint.$('#main').hide();
      }).css({
        "opacity": 0
      });
      aniTrans(view.$el.appendTo(document.body).css({
        background: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
        "z-index": 30000
      }), 0, document.documentElement.clientHeight, 0, 0, 500);

      // .animate({
      //   top: 0
      // }, 'normal', 'ease-in-out', function() {
      //   view.$el.css({'position': 'relative'});
      //   Joint.$('#main').css("opacity", 0).hide();
      // });

      
      var origRemove = Joint._.bind(view.remove, view);
      view.remove = Joint._.once(function() {
        Joint.$('#main').show().transition(300).css("opacity", 1).show();

        aniTrans(view.$el, 0,0,0,document.documentElement.clientHeight,300).then(function() {
          origRemove();
        });
      });

      function aniTrans($el, x, y, nx, ny, s) {
        var dfr = Joint.Deferred.defer();
        if(x != null || y != null)
        {
          translate($el, x, y);
        }

        Joint._.defer(function() {
          translate($el, nx, ny, s);
        })

        setTimeout(function() {
          dfr.resolver.resolve();
        }, s);

        return dfr.promise;
      }
      function translate($el, x, y, s) {
        x = x || 0;
        y = y || 0;

        var o = {
          "transform": "translate(" + x + "px, " + y + "px) !important",
          "-webkit-transform": "translate(" + x + "px, " + y + "px) !important"
        };
        if(s) {
          Joint._.extend(o, {
            "transition": s + "ms",
            "-webkit-transition": s + "ms"
          });
        }

        return $el.css(o);
      }

    });
  };
});