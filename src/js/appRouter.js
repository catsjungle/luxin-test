define(['backbone', 'backbone.joint'], function (Backbone, Joint) {
    var routeStripper = /^[#\/]|\s+$/g;
    var pathStripper = /[?#].*$/;
    var isExplorer = /msie [\w.]+/;

    //改造history，因为BB.Router写死了`Backbone.history` 所以这里直接覆写原型
    Backbone.History.prototype.getFragment = function (fragment, forcePushState) {
        if (fragment == null) {
            if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                fragment = this.location.search.replace(/^\?([^&]+?)(&.*)?$/, '$1');
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(routeStripper, '');
    };
    Backbone.History.prototype.navigate = function (fragment, options) {
        if (!Backbone.History.started) return false;
        if (!options || options === true) options = {trigger: !!options};

        var url = this.root + (fragment = this.getFragment(fragment || ''));

        // Strip the fragment of the query and hash for matching.
        fragment = fragment.replace(pathStripper, '');

        if (this.fragment === fragment) return;
        this.fragment = fragment;

        // Don't include a trailing slash on the root.
        if (fragment === '' && url !== '/') url = url.slice(0, -1);

        url += '&showwxpaytitle=1';

        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._hasPushState) {
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

            // If hash changes haven't been explicitly disabled, update the hash
            // fragment to store history.
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
                // Opening and closing the iframe tricks IE7 and earlier to push a
                // history entry on hash-tag change.  When replace is true, we don't
                // want this.
                if (!options.replace) this.iframe.document.open().close();
                this._updateHash(this.iframe.location, fragment, options.replace);
            }

            // If you've told us that you explicitly don't want fallback hashchange-
            // based history, then `navigate` becomes a page refresh.
        } else {
            return this.location.assign(url);
        }
        if (options.trigger) return this.loadUrl(fragment);
    };

    //f*ckwchat 软弱的我只能在这里爆爆粗口
    //第一次听说URL还要限制不能出现#和/的，?后面的/，#后面的/，#都不行
    //问候你全家的年轻女性家属
    //最可恨的是我竟然懂怎么绕过去
    Backbone.History.prototype.start = function (options) {
        if (Backbone.History.started) throw new Error("Backbone.history has already been started");
        Backbone.History.started = true;

        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options = _.extend({root: '/'}, this.options, options);
        this.root = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
        var fragment = this.getFragment();
        var docMode = document.documentMode;
        var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

        // Normalize root to always include a leading and trailing slash.
        //削掉这行飞掉多余的/
       // this.root = ('/' + this.root + '/').replace(rootStripper, '/');

        if (oldIE && this._wantsHashChange) {
            this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
            this.navigate(fragment);
        }

        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._hasPushState) {
            Backbone.$(window).on('popstate', this.checkUrl);
        } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
            Backbone.$(window).on('hashchange', this.checkUrl);
        } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }

        // Determine if we need to change the base url, for a pushState link
        // opened by a non-pushState browser.
        this.fragment = fragment;
        var loc = this.location;
        var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

        // Transition from hashChange to pushState or vice versa if both are
        // requested.
        if (this._wantsHashChange && this._wantsPushState) {

            // If we've started off with a route from a `pushState`-enabled
            // browser, but we're currently in a browser that doesn't support it...
            if (!this._hasPushState && !atRoot) {
                this.fragment = this.getFragment(null, true);
                this.location.replace(this.root + this.location.search + '#' + this.fragment);
                // Return immediately as browser will do redirect to new url
                return true;

                // Or if we've started out with a hash-based route, but we're currently
                // in a browser where it could be `pushState`-based instead...
            } else if (this._hasPushState && atRoot && loc.hash) {
                this.fragment = this.getHash().replace(routeStripper, '');
                this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
            }

        }

        if (!this.options.silent) return this.loadUrl();
    };

    return new (Backbone.Router.extend({
        initialize: Joint.after(Backbone.Router.prototype.initialize, function () {
            var router = this;
            Joint.$(window).on('popstate', function (event) {
                router.trigger('popstate', event.state);
            });
            router.bHistory = Backbone.history;
        }),
        guardBack: function () {
            var dfr = Joint.Deferred.defer();
            var token = Joint._.uniqueId('router/guardBack');

            setState(_.extend(window.history.state || {}, {guardBack: token}));
            window.history.pushState(null, '', location.href);
            this.once('popstate', function (state) {

                if (state && state.guardBack == token) {
                    dfr.resolver.resolve();
                } else {
                    reject();
                }
            });

            return {
                promise: dfr.promise,
                cancel: reject
            };

            function setState(state) {
                window.history.replaceState(state);
            }

            function reject() {
                if (window.history.state && window.history.state.guardBack) {
                    var newState = window.history.state;
                    delete newState.guardBack;
                    setState(newState);
                }
                dfr.resolver.reject();
            }
        },
        go: function () {
            this.goHref(Joint._.toArray(arguments));
        },
        goHref: function (href) {
            this.navigate(href.join('-'), {trigger: true});
        },
        reload: function () {
            Backbone.history.loadUrl();
        },
        deparam: function (str) {//"a=b&c=d" => {a:'b',c:'d'}
            return Joint._.chain((str || '').split(/([^\?#&]+?)[\?#&]/)).map(function (s) {
                return (s || '').split(/=/);
            }).filter(function (s) {
                return s && s.length === 2;
            }).object().value();
        }
    }));
});