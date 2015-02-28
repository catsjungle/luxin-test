--- |
    <div class="m-gap cinema-box" j-field="vm.list .key">
        <!--<div class="m-box">
            <a class="js_change_city" j-field="city.current">
                <% if (city.current) { %>
                <strong>当前城市：<%= city.current.name %></strong>
                <span class="m-l-right"><b></b></span>
                <% } %>
            </a>
        </div>-->
        <%if(vm.cinemaList==null){%>
        <%}else if (_.size(vm.cinemaList) == 0) { %>
        没有找到合适亲的影城哦，要不换个条件再试试！
        <% } else { %>
            <% _.each(vm.cinemaList, function(cinemaInfos, title) { %>
                <% if (cinemaInfos.length) { %>
        <h3><%= title %></h3>
        <ul class="m-list js_cinema_list">
                    <% _.each(cinemaInfos, function(cinemaInfo) { %>
            <li k="<%= cinemaInfo.id %>" class="<%= !(title!="最近购买的影院"&&vm.isdefaultCinemaId==cinemaInfo.id)&& key && key == cinemaInfo.id ? ' current' : '' %><%= !(title!="最近购买的影院"&&vm.isdefaultCinemaId==cinemaInfo.id)&&!key && cinemaId == cinemaInfo.id ? ' current' : '' %>">
                <a class="display-box <%= cinemaInfo.buyType %>">
                    <div class="box-flex">
                        <h4>
                            <b><%= cinemaInfo.name %></b>
                        <% if (cinemaInfo.flag_seat_ticket == 1) { %>
                            <i class="ico-seat">座</i>
                        <% } %>
                        </h4>
                        <p><%= cinemaInfo.addr %></p>
                    </div>
                        <% if (vm.loadType == "m") { %>
                    <div class="right">
                        <span><b>￥<%= cinemaInfo.lowest_price_for_app / 100 %></b>起<br><%= cinemaInfo.count_movie==0?"已映完":"剩余"+cinemaInfo.count_movie+"场" %></span>
                    </div>
                        <% } %>
                </a>
            </li>
                    <% }); %>
        </ul>
                <% } %>
            <% }); %>
        <% } %>
    </div>