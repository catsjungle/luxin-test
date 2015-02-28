define(['underscore'], function (_) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	var cookie = function cookie(key, value, options) {

		// write
		if (value !== undefined) {
			options = _.extend({}, cookie.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = cookie.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', cookie.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = cookie.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			if (decode(parts.shift()) === key) {
				var c = decode(parts.join('='));
				return cookie.json ? JSON.parse(c) : c;
			}
		}

		return null;
	};

	cookie.defaults = {};

	function removeCookie(key, options) {
		if (cookie(key) !== null) {
			cookie(key, null, options);
			return true;
		}
		return false;
	};

	cookie.remove = removeCookie;

	return cookie;
});
