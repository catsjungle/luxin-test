--- |
    <div class="m-gap movie-list nowbuy" j-field="vm.list .key">
        <%if(vm.cinemaInfo){%>
        <header class="h-box">
            <div class="m-box m-box-m0 side-r">
                <a class='js_change_city arr-r'>
                    <h4><%=  vm.cinemaInfo.name %></h4>
                    <p>地址：<%= vm.cinemaInfo.addr %></p>
                </a>
                <span class="btn-top js_go_cinemainfo">影院详情</span>
            </div>
        </header>
        <%}%>
        <ul class="">
            <% var ICOTEXT = {
                            am: '上午',
                            pm: '下午',
                            moon: '晚上'
                        } %>
            <% var today = new (require('util/date'))(new Date(new Date().valueOf() + 1800000)); %>
            <% _.each(vm.movieSches, function(movie,k) { %>
                <li id="li_movie<%=movie.id%>">
                    <a href="javascript:void(0)">
                        <img  class="gomovieinfo" data-movieid="<%=movie.id%>" src="<%=(movie.info.movie_poster_mini?movie.info.movie_poster_mini.replace('wepiao', parseInt(new Date().getTime() / 600000)):'')%>" width="93" height="135">
                        <div>
                            <h3><b class="gomovieinfo" data-movieid="<%=movie.id%>"><%= movie.info.name %></b></h3>
                            <p><%= movie.info.tags %></p>
                            <p>导演:  <%= movie.info.director %></p>
                            <p>主演:  <%= movie.info.actor %></p>
                            <span class="btn arr-3-r showschediv" data-movieid="<%=movie.id%>">选座购票</span>
                        </div>
                    </a>
                    <ul id="ul_movie<%=movie.id%>" class="nav-sub" style="display:none;">
                        <% var datenumlist=0;%>
                        
                        <% _.each(movie.sche, function(groups, date) { %>
                            <% if(datenumlist<3){%>


                            <% var datestr = date.toString(); %>
                            <% var y = datestr.substring(0, 4); %>
                            <% var m = datestr.substring(4, 6); %>
                            <% var d = datestr.substring(6); %>
                            <% var str = y + '年' + m + '月' + d + '日'; %>


                            <li class="<%=daystr["today"]==date?"current":""%>">
                                <a class='showschedate' data-date="<%=movie.id%><%=date%>" data-movieid="<%=movie.id%>"><%=daystr[date] || str%></a>
                            </li>
                            <%}else if(datenumlist==3){%>
                            <li>
                                <a class="arr-r"><i class="ico-date">日期</i></a>
                                <select class="dateInput selected">
                                    <option value=""></option>
                                    <%var tempdatenumlist=0;%>
                                    <% _.each(movie.sche, function(groups_v, date_v) { %>
                                    <% if(tempdatenumlist>2){%>

                                    <% var datestr = date_v.toString(); %>
                                    <% var y = datestr.substring(0, 4); %>
                                    <% var m = datestr.substring(4, 6); %>
                                    <% var d = datestr.substring(6); %>
                                    <% var str_v = y + '年' + m + '月' + d + '日'; %>


                                    <option value="<%=movie.id%><%=date_v%>,<%=movie.id%>"><%=daystr[date_v] || str_v%></option>
                                    <%}tempdatenumlist+=1;%>
                                    <%})%>
                                </select>
                            </li>
                            <%}datenumlist+=1;%>
                        <%})%>

                    </ul>
                    <div id="div_movie<%=movie.id%>" class="m-list m-li-member"  style="display:none;">
                        <ul>
                            <li class="current">
                                <div class="select-schedule">
                                <% var datenum=0;%>
                                <% _.each(movie.sche, function(groups, date) { %>
                                    <dl class='dl_<%=movie.id%>' id="dl_<%=movie.id%><%=date%>" style="display:<%=!datenum?"":"none"%>">
                                    <% if(!datenum){datenum=1;}%>
                                    <% _.each(groups, function(showtimes, ico) { %>
                                        <dt>
                                            <i class="ico-<%=ico%>"></i>
                                            <%=ICOTEXT[ico]%>
                                        </dt>
                                        <dd>
                                            <% _.each(showtimes, function(showtime) { %>
                                            <a class='<%=(today.getYmd() == showtime.date && today.getHms() > showtime.mp.time)? "end js_latemsg": "buy"%>'  data-url="#seat-<%= vm.cinemaInfo.id %>-<%= showtime.mpid %>-0">
                                                <span>
                                                    <%= showtime.mp.time %>
                                                </span>
                                                <span>
                                                    <%= showtime.version.lagu %><%= showtime.version.type %>
                                                </span>
                                                <span>
                                                    <%= showtime.mp.roomname %>
                                                </span>
                                                <span>
                                                    <b>￥<%= (parseInt(showtime.mp.price,10) / 100) %></b>
                                                </span>
                                                <span><em class="btn" data-url="#seat-<%= vm.cinemaInfo.id %>-<%= showtime.mpid %>-0">购买</em></span>
                                            </a>
                                            <% }) %>
                                        </dd>
                                    <% })/*each movie.sche date showtimes*/%>
                                    </dl>
                                <% })/*each movie.sche date showtimes*/%>
                                </div>
                            </li>               
                        </ul>
                    </div>
                </li>
            <% }); %>
        </ul>
    <%if(vm.cinemaInfo){%>
        <div class="bottom-aid-info">
            <p><a href="tel:<%= vm.cinemaInfo.tele%>"><i class="ico-tel"></i>客服电话：<%= vm.cinemaInfo.tele%></a><br>
                Powered by <img src="css/img/logo/logo-b.png" alt="" style="width: 25%;"></p>
        </div>
    <%}%>  
    </div>
