define(function(){
    var urlId = location.href.match(new RegExp("\/wx\/(.*)\/","i"));
    var cookieId = document.cookie.substring(0, document.cookie.indexOf('_openid'));
    var id = urlId? urlId[1]: cookieId;

    var cinemas = {
        fyyc: {
            abbr: 'fyyc',
            styleAbbr: 'fyyc',
            title: '泛洋影城',
            tele: '020-84618008',
            cityId: 210,
            cinemaId: '5470085216feb413d4142c3e',
            logo: 'css/img/logo/logofyyc.png'
        },
        hengdayx: {
            abbr: 'hengdayx',
            styleAbbr: 'hengdayx',
            title: '恒大院线',
            tele: '020-38658860',
            cityId: '',
            cinemaId: '',
            logo: 'css/img/logo/logohengdayx.png'
        },
        hymhyyc: {
            abbr: 'hymhyyc',
            styleAbbr: 'hymhyyc',
            title: '华影梅花园影城',
            tele: '020-37322088-805',
            cityId: 210,
            cinemaId: '5470080616feb413d41424bc',
            logo: 'css/img/logo/logohymhyyc.png'
        },
        jydy: {
            abbr: 'jydy',
            styleAbbr: 'jydy',
            title: '金逸电影',
            tele: '400-1100-100',
            cityId: '',
            cinemaId: '',
            logo: 'css/img/logojydy/logo.png'
        },
        qdavrgjyc: {
            abbr: 'qdavrgjyc',
            styleAbbr: 'qdavrgjyc',
            title: '青岛奥维尔国际影城',
            tele: '0532-58701666',
            cityId: 153,
            cinemaId: '545b36d025f2ba04f44d653c',
            logo: 'css/img/logoqdavrgjyc/logo.png'
        },
        sddyy: {
            abbr: 'sddyy',
            styleAbbr: 'sddyy',
            title: '首都电影院',
            tele: '400-1100-100',
            cityId: '',
            cinemaId: '',
            logo: 'css/img/logosddyy/logo.png'
        },
        lxyzyclyhx: {
            abbr: 'lxyzyclyhx',
            styleAbbr: 'luxin',
            title: '鲁信银座影城临沂和谐广场店',
            tele: '0539-7751234',
            cityId: 148,
            cinemaId: '547009df16feb413d41457c2',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxycytndjd: {
            abbr: 'lxycytndjd',
            styleAbbr: 'luxin',
            title: '鲁信影城烟台南大街店',
            tele: '0535-6262666',
            cityId: 157,
            cinemaId: '547009de16feb413d41457a6',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxycytd: {
            abbr: 'lxycytd',
            styleAbbr: 'luxin',
            title: '鲁信影城烟台店',
            tele: '0535-6262666',
            cityId: 157,
            cinemaId: '547009de16feb413d4145798',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxyzycsgd: {
            abbr: 'lxyzycsgd',
            styleAbbr: 'luxin',
            title: '鲁信银座影城寿光店',
            tele: '0536-5628088',
            cityId: 158,
            cinemaId: '547009de16feb413d41457b4',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxyclwd: {
            abbr: 'lxyclwd',
            styleAbbr: 'luxin',
            title: '鲁信影城莱芜店',
            tele: '0634-8228888',
            cityId: 147,
            cinemaId: '547009dc16feb413d414576e',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxycgcd: {
            abbr: 'lxycgcd',
            styleAbbr: 'luxin',
            title: '鲁信影城钢城店',
            tele: '0634-8228888',
            cityId: 147,
            cinemaId: '547009dd16feb413d414577c',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxycjnzxj: {
            abbr: 'lxycjnzxj',
            styleAbbr: 'luxin',
            title: '鲁信影城济南振兴街影城',
            tele: '0531-86155639',
            cityId: 144,
            cinemaId: '547009da16feb413d414572b',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxycjntyzx: {
            abbr: 'lxycjntyzx',
            styleAbbr: 'luxin',
            title: '鲁信影城济南体育中心店',
            tele: '0531-81762666',
            cityId: 144,
            cinemaId: '547009d916feb413d4145701',
            logo: 'css/img/logo/logoluxin.png'
        },
        dzlxyc: {
            abbr: 'dzlxyc',
            styleAbbr: 'luxin',
            title: '德州鲁信影城',
            tele: '0534-2375666',
            cityId: 149,
            cinemaId: '547009dd16feb413d414578a',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxyclydjd: {
            abbr: 'lxyclydjd',
            styleAbbr: 'luxin',
            title: '鲁信影城泺源大街店',
            cityId: 144,
            cinemaId: '547009d916feb413d414570f',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxycjfqd: {
            abbr: 'lxycjfqd',
            styleAbbr: 'luxin',
            title: '鲁信影城解放桥店',
            cityId: 144,
            cinemaId: '547009da16feb413d414571d',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxyclcd: {
            abbr: 'lxyclcd',
            styleAbbr: 'luxin',
            title: '鲁信影城聊城店',
            cityId: 150,
            cinemaId: '547009dc16feb413d4145760',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxyctad: {
            abbr: 'lxyctad',
            styleAbbr: 'luxin',
            title: '鲁信影城泰安店',
            cityId: 160,
            cinemaId: '547009d816feb413d41456f3',
            logo: 'css/img/logo/logoluxin.png'
        },
        lxyczbd: {
            abbr: 'lxyczbd',
            styleAbbr: 'luxin',
            title: '鲁信影城淄博振华店',
            cityId: 154, 
            cinemaId: '53e8551825f2ba166c96b2a0',
            logo: 'css/img/logo/logoluxin.png'
        }

    };

    console.log(document.cookie);
    return cinemas[id];

});
