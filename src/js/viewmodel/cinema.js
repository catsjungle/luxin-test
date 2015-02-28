/**
 * 影院 列表默认ViewModel
 *
 * 默认情况下拉取当前城市的影院列表
 *
 */
define(['viewmodel/base', 'viewmodel/moviedata', 'backbone.joint'], function (Base, MovieData, Joint) {
    var _ = Joint._;

    return Base.extend({
        loadCinema: function (pos, cityId, cinemaId, movieId) {
            //纬度latitude,经度longitude
            //Object {latitude: 31.189850399999997, longitude: 121.38844959999999}
            //type=0  所有影院，type=1 两者有其一， type=2 有订座，type=3 有团购，type=4 两者都有
            var vm = this;
            //debugger;
        return Joint.Deferred.when(
          MovieData.getAboutCinemaList(cityId, -1, pos&&pos.latitude?pos.latitude:null, pos&&pos.longitude?pos.longitude:null, 2, 6),
          MovieData.getAboutCinemaList(cityId, -1, pos&&pos.latitude?pos.latitude:null, pos&&pos.longitude?pos.longitude:null, 3, 8),
          MovieData.getCinemaShoppingHistory(cityId),
          MovieData.getCinemaByCityAndMovie(cityId, cinemaId, movieId)
        ).then(function (aboutSeatCinemaList,aboutTicketCinemaList, cinemaShoppingHistory, cinemaList ) {
            vm.cinemaList = {};
            vm.nearCinemaList = {};
            vm.loadType = movieId ? 'm' : 'c';
            vm.isdefaultCinemaId = 0;
            vm.isshowmorecinema = true;
            vm.isshowmorelink=false;
            vm.isshownearbynav=false;
            //debugger;
            //常去的 begin
            if (cinemaShoppingHistory && cinemaShoppingHistory.data) {
                var historyCinemaList = _.compact(_.map(cinemaShoppingHistory.data, function (history) {
                    return _.find(_.flatten(_.values(cinemaList)), function (cinema) {
                        return cinema.id == history.cinema_id;
                    });
                }));
                if (historyCinemaList.length > 0) {
                    vm.isdefaultCinemaId = historyCinemaList[0].id;
                    _.extend(vm.cinemaList, { "我常去的": historyCinemaList }); // 载入我最近购买记录的影院到数据栈
                }
                /*
                var list=[];
                _.each(historyCinemaList,function(hclist){list.push(hclist.id);});
                _.each(cinemaList, function (cinemaInfos, title) {
                _.each(cinemaInfos, function (cinemaInfo, i) {
                _.each(list,function(id,k){
                //如果该影院出现在了已购买列表里面，则在片区列表不需要再出现。
                if (cinemaInfo.id== id) {
                delete cinemaInfos[i];
                delete list[k];
                }
                });
                });
                });
                */
            }
            //常去的 end
             //附件的 begin
            var extendCinema=function(abtCinemaList){
                if (abtCinemaList && abtCinemaList.data) {
                    var ACinemaList = _.compact(_.map(abtCinemaList.data, function (CinemaAbout) {
                        return _.find(_.flatten(_.values(cinemaList)), function (cinema) {
                            return cinema.id == CinemaAbout.cinema_id;
                        });
                    }));
                     if (ACinemaList.length > 0) {
                        _.each(ACinemaList,function(newList,i){
                          _.each(abtCinemaList.data,function(allList,k){
                            if (newList.id==allList.cinema_id) {
                              ACinemaList[i].distance=parseInt(allList.distance)>1000?(parseFloat(allList.distance)/1000).toFixed(1)+"km":parseInt(allList.distance)+"m";
                            }
                          })
                        })
                        return ACinemaList;
                    }
                }
                return [];
            }
            var seatCinemaList= extendCinema(aboutSeatCinemaList);
            var ticketCinemaList= extendCinema(aboutTicketCinemaList);
            vm.isshownearbynav=(_.size(seatCinemaList)>0 &&_.size(ticketCinemaList)>0);
            if (!vm.isshownearbynav ){
                if (_.size(seatCinemaList)>0) {
                    _.extend(vm.cinemaList, { "离你最近的":  seatCinemaList});// 载入我最近购买记录的影院到数据栈
                }
                else if (_.size(ticketCinemaList)>0){
                    _.extend(vm.cinemaList, { "离你最近的":  ticketCinemaList}); // 载入我最近购买记录的影院到数据栈
                }
            }else{
                _.extend(vm.nearCinemaList, { "seat":  seatCinemaList});// 载入我最近购买记录的影院到数据栈
                _.extend(vm.nearCinemaList, { "ticket":  ticketCinemaList}); // 载入我最近购买记录的影院到数据栈
            }
            //附近的 end

            try {
                _.extend(vm.cinemaList, cinemaList);
            } catch (ex) {
                vm.cinemaList = cinemaList;
            }
            //vm.cinemaList = cinemaList; // 载入当前城市所有电影到数据栈
            vm.sync('list');
        }, function () {
            vm.panic();
        });
        }

    });
});
