--- |
    <ul j-field=".key .current">
        <% _.each(sches, function(movie, k) { %>
        <% var ICOTEXT = {
            am: '上午',
            pm: '下午',
            moon: '晚上'
        }; %>


        <li class="current">
                <ul id="ul_movie<%=movie.id%>" class="nav-sub">

                    <% var datenumlist=0;%>
                    
                    <% _.each(movie.sche, function(groups, date) { %>
                        <% if(datenumlist<3){%>

                        <% var datestr = date.toString(); %>
                        <% var y = datestr.substring(0, 4); %>
                        <% var m = datestr.substring(4, 6); %>
                        <% var d = datestr.substring(6); %>
                        <% var str = y + '年' + m + '月' + d + '日'; %>

                        <li class="<%=daystr["today"]==date?"current":""%>">
                            <a class='showschedate' data-date="<%=movie.id%><%=date%>" data-movieid="<%=movie.id%>"><%= daystr[date] || str%></a>
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
                                <% var str = y + '年' + m + '月' + d + '日'; %>


                                <option value="<%=movie.id%><%=date_v%>,<%=movie.id%>"><%= daystr[date_v] || str%></option>
                                <%}tempdatenumlist+=1;%>
                                <%})%>
                            </select>
                        </li>
                        <%}datenumlist+=1;%>
                    <%})%>

                </ul>
                <div id="div_movie<%=movie.id%>" class="m-list m-li-member">
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
                                        <a <% __p = tpl_showtime(showtime, __p); %> >
                                            <span>
                                                <%= showtime.mp.time %>
                                            </span>
                                            <span>
                                                <%= showtime.version.lagu %><%= showtime.version.type %>
                                            </span>
                                            <span>
                                                <b>￥<%= (showtime.mp.price / 100) %></b>
                                            </span>
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
        
        <li class="<%=movie.id==movie_id?'current ':''%> js_movie_title" style='display:none;'>
            <h3>
                <a class="arr-r">
                    <%=movie.name%>
                    <%= (movie.score == 0) ? '' : '<b class="movie-score">' + movie.score + '</b>' %>
                </a>
            </h3>
    
            <div class="select-schedule">
            <% _.each(movie.sche, function(groups, date) { %>

                <% var datestr = date.toString(); %>
                <% var y = datestr.substring(0, 4); %>
                <% var m = datestr.substring(4, 6); %>
                <% var d = datestr.substring(6); %>
                <% var str = y + '年' + m + '月' + d + '日'; %>

                <strong><%= daystr[date] || str%></strong>
                <dl>
                <% _.each(groups, function(showtimes, ico) { %>
                    <dt>
                        <i class="ico-<%=ico%>"></i>
                        <%=ICOTEXT[ico]%>
                    </dt>
                    <dd>
                        <% _.each(showtimes, function(showtime) { %>
                        <a <% __p = tpl_showtime(showtime, __p); %>>
                            <span>
                                <% if(showtime.mp.nextday) { %><i>次日</i><% } %>
                                <%= showtime.mp.time %>
                                <br/>
                                <%= showtime.mp.endAtNextDay ? '次日' : '预计' %><%= showtime.mp.end %>散场
                            </span>
                            <span>
                                <%= showtime.version.lagu %><%= showtime.version.type %>
                                <br/>
                                <em><%= showtime.mp.roomname %></em>
                            </span>
                            <span>
                                <b>￥<%= (showtime.mp.price / 100) %></b>
                                <% if(showtime.mp.retail_price / 100 > showtime.mp.price / 100) { %>
                                <del>￥<%= (showtime.mp.retail_price / 100) %></del>
                                <% } %>
                            </span>
                        </a>
                        <% }); %>
                    </dd>
                <% });/*each movie.sche date showtimes*/%>
                </dl>
            <% });/*each movie.sche date showtimes*/%>
            </div>
        </li>
        <% });/*each sches movie*/ %>
    </ul>
    