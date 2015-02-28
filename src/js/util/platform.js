define([
  'backbone.joint',
    'viewmodel/moviedata'
], function (Joint,  MovieData) {
    var PlatForm = {
        Store: {
            get: function() {
                var regR = location.href.match(new RegExp("\/wx\/(.*)\/","i"));
                return (!regR||regR.length<2)?"lxycjnzxj":regR[1];
            }
        },
        decidePlatForm: function() {
           //
        }
    };
    return PlatForm;
}); 