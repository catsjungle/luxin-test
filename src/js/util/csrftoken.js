define(['util/md5', 'util/cookie'], function(md5, cookie)
{

 	var CSRF_TOKEN_KEY = 'tencentQQVIP123443safde&!%^%1282';
 	var CSRF_TOKEN_SALT = 5381;

 	return function(conf) {
 		conf = conf || {};
 		var salt = conf.salt || CSRF_TOKEN_SALT;
 		var md5key = conf.md5key || CSRF_TOKEN_KEY;
 		var skey = conf.skey || cookie('private_skey') || cookie('p_skey') || cookie('skey') || '';
 		var hash = [],
 		ASCIICode;
 		hash.push((salt << 5));
 		for (var i = 0, len = skey.length; i < len; ++i) {
 			ASCIICode = skey.charCodeAt(i);
 			hash.push((salt << 5) + ASCIICode);
 			salt = ASCIICode;
 		}
 		return md5(hash.join('') + md5key);
 	};
});