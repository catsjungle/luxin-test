//fontwatcher
//refer https://github.com/typekit/webfontloader/tree/master/src/core
define(['backbone.joint'], function (Joint) {
	function watch(font, str) {
		str = str || 'BESbswy';
		return Joint.Deferred.when(compare(font, str, 'serif'), compare(font, str, 'sans-serif')).then(function(width) {
				return width / 300 / str.length;
		});
	}

	function compare(font, str, baseFont) {
		var watcher = new FontWatcher(font, str, baseFont);
		watcher.check();
		return watcher.getPromise();
	}

	var FontWatcher = Joint.Emitter.extend({
		constructor: function (font, str, baseFont) {
			this._ruler = new FontRuler(font + ',' + baseFont, str);
			this._base = new FontRuler(baseFont, str);
			this._start = Date.now();
			this._dfr = Joint.Deferred.defer();
		},
		timeout: 5000,
		check: function() {
			var rWidth = this._ruler.getWidth();
			if(Date.now() - this._start > this.timeout) {
				this.reject('timeout');
			} else if(rWidth != this._base.getWidth()) {
				this.resolve(rWidth);
			} else {
				Joint._.defer(Joint._.bind(this.check, this));
			}
		},
		getPromise: function() {
			return this._dfr.promise;
		},

		resolve: function(w) {
			this._ruler.destroy();
			this._base.destroy();
			this._dfr.resolver.resolve(w);
		},
		reject: function(e) {
			this._ruler.destroy();
			this._base.destroy();
			this._dfr.resolver.reject(e);
		}
	})

	var FontRuler = Joint.Emitter.extend({
		constructor: function(font, str) {
			if(_.isString(font)) {
				font = {
					'font-family': font
				};
			}

			this.$el = Joint.$('<span>').text(str).css({
				position: 'absolute',
				top: -999,
				left: -999,
				fontSize: '300px',
				width: 'auto',
				height: 'auto',
				lineHeight: 'normal',
				margin: 0,
				padding: 0,
				whiteSpace: 'nowrap'
			}).css(font).appendTo(document.body);
		},
		getWidth: function() {
			return this.$el[0].offsetWidth;
		},
		destroy: function() {
			this.$el.remove();
		}
	});


	return {watch: watch};
});
