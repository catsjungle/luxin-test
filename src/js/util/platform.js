define([
  'backbone.joint',
  'util/cinema',
    'viewmodel/moviedata'
], function (Joint, CinemaDe, MovieData) {
    var PlatForm = {
        Store: {
            get: function() {
                var regR = location.href.match(new RegExp("\/wx\/(.*)\/","i"));
                return (!regR||regR.length<2)?CinemaDe.abbr:regR[1];
            }
        },
        decidePlatForm: function() {
           //
        }
    };
    return PlatForm;
}); 