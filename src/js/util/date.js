define(['underscore'], function (_) {
    function UDate(Y,M,D,h,m,s) {
        if(_.isDate(Y)) {
            this._date = Y;
        } else {
            switch(false) {
            case !s:
                this._date = new Date(Y,M,D,h,m,s);
                break;
            case !m:
                this._date = new Date(Y,M,D,h,m);
                break;
            case !h:
                this._date = new Date(Y,M,D,h);
                break;
            case !D:
                this._date = new Date(Y,M,D);
                break;
            case !M:
                this._date = new Date(Y,M);
                break;
            case !Y:
                this._date = new Date(Y);
                break;
            default:
                this._date = new Date();
            }
        }
    }

    _.extend(UDate.prototype, {
        _offset: 8 * 3600000,//东八区
        getMonth: function() {
            return this._getOffsetDate().getUTCMonth() + 1;
        },
        getDate: function() {
            return this._getOffsetDate().getUTCDate();
        },
        getYmd: function(spliter) {
            var date = this._getOffsetDate();
            var m = date.getUTCMonth() + 1;
            var d = date.getUTCDate();
            if(m < 10) {
                m = "0" + m;
            }
            if(d < 10) {
                d = "0" + d;
            }

            return [date.getUTCFullYear(), m, d].join(spliter || '');
        },
        getHms: function(spliter) {
            var date = this._getOffsetDate();
            var h = date.getUTCHours();
            var m = date.getUTCMinutes();
            var s = date.getUTCSeconds();
            if(h < 10) {
                h = "0" + h;
            }
            if(m < 10) {
                m = "0" + m;
            }
            if(s < 10) {
                s = "0" + s;
            }

            return [h, m, s].join(spliter || ':');
        },
        offset: function(offset) {
            return new UDate(new Date(this._date.valueOf() + offset));
        },
        _getOffsetDate: function() {
            return new Date(this._date.valueOf() + this._offset);
        }
    });

    _.extend(UDate, {
        getDayStr: function() {
            var now = Date.now() - UDate.dayBeginMs;
            var today = new UDate(new Date(now));
            var tomorrow = new UDate(new Date(now + 86400 * 1000));
            var dayafter = new UDate(new Date(now + 2 * 86400 * 1000));
            var daystr = {};

            daystr["today"]=today.getYmd();
            daystr[today.getYmd()] = ['今天(', today.getMonth(), '月', today.getDate(), '日)'].join('');
            daystr[tomorrow.getYmd()] = ['明天(', tomorrow.getMonth(), '月', tomorrow.getDate(), '日)'].join('');
            daystr[dayafter.getYmd()] = ['后天(', dayafter.getMonth(), '月', dayafter.getDate(), '日)'].join('');

            daystr[today.getYmd()+"t"] = ['', today.getMonth(), '月', today.getDate(), '日'].join('');
            daystr[tomorrow.getYmd()+"t"] = ['', tomorrow.getMonth(), '月', tomorrow.getDate(), '日'].join('');
            daystr[dayafter.getYmd()+"t"] = ['', dayafter.getMonth(), '月', dayafter.getDate(), '日'].join('');
            
            daystr[0] = today.getYmd();
            daystr[1] = tomorrow.getYmd();
            daystr[2] = dayafter.getYmd();

            return daystr;
        },
        timeOffset: function(timestr, offsetMin) {//"10:30", 100 => "12:10"
            var time = _.map(timestr.split(':'), int);
            if(time.length != 2) {
                throw 'malformed timestr';
            }
            time[1] += offsetMin;
            while (time[1] >= 60) {
                time[1] -= 60;
                time[0] += 1;
            }
            while (time[0] >= 24) {
                time[0] -= 24;
            }

            return _.map(time, str).join(':');

            function int(a) {
                return parseInt(a, 10);
            }
            function str(a) {
                return a < 10 ? '0' + a : a;
            }
        },
        byYmdStr: function(str) {
            var match = /^(\d{4})[\/-]?(\d{2})[\/-]?(\d{2})$/.exec(str);
            if(!match) return null;
            return new UDate(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        },
        //时间歪曲力场
        dayBegin: '00:00',
        dayBeginMs: 6 * 3600000
//        dayBegin: '17:00',
//        dayBeginMs: 17 * 3600000
    });

    return UDate;
});