<div class="detailed-box"  j-field="vm.list">
    <div class="movie-top">
        <a class="moremoive <%= vm.movieinfo.vflagclass %>" >
            <img src="<%=(vm.movieinfo.movie_poster_mini?vm.movieinfo.movie_poster_mini.replace('wepiao', parseInt(new Date().getTime() / 600000)):'')%>">
        </a>
        <div>
            <h3><b><%= vm.movieinfo.name %></b></h3>
            <span class="stars st<%= parseInt(vm.movieinfo.score/2*10/5)*5 %>"><i><%= vm.movieinfo.score %></i></span>
            <span class="tags">
                <%if(vm.movieinfo.tags){%>
                    <% _.each(vm.movieinfo.tags.split("/"), function(m,mi) { %>
                        <%if(mi<3){%>
                        <i><%=m%></i>
                        <%}%>
                    <%})%>
                <%}%>
            </span>
            <p>上映时间：<%= vm.movieinfo.date.length>7?vm.movieinfo.date.substring(0,4)+'-'+vm.movieinfo.date.substring(4,6)+'-'+vm.movieinfo.date.substring(6,8):'' %></p>
            <p>片长：<%= vm.movieinfo.longs %><%= vm.movieinfo.longs&&vm.movieinfo.longs.indexOf('分钟')==-1?'分钟':'' %></p>
        </div>
    </div>
    <%if (vm.movieinfo.flag_sche){%>
    <div class="btn-box"><a class="btn block btngotobuy">在线选座购票</a></div>
    <%}%>
    <!--<div class="btn-box"><a class="btnG block btngotobuy">排期购票</a></div>-->
    <%
    var picList=0;
    if(vm.movieinfo.movie_still_mini){
        picList=vm.movieinfo.movie_still_mini.split("|");
    }
    if (picList&&picList.length>0){
    %>
    <div class="posters-1">
        <div class="">
            <% _.each(picList, function(pic,i) { %>
                <%if(pic!=""&&(i<3||picList.length==4)){%>
                <a class="showbigimg" allcount="<%=picList.length-1%>" num="<%=i%>"  ghref="<%=picList[i].replace('wepiao', parseInt(new Date().getTime() / 600000))%>"><img src="<%=pic.replace('wepiao', parseInt(new Date().getTime() / 600000))%>" alt=""></a>
                <%}%>
            <%})%>
        </div>
        <%if(picList.length>4){%>
        <a class="arr-r morepic"><b>更多</b></a>
        <%}%>
    </div>
    <%
    }else{
    %>
    <div class="posters-1"></div>
    <%}%>
    <h4>演职人员</h4>
    <div class="content-in">
        <p class="th-td"><em>导演：</em><span><%= vm.movieinfo.director %></span></p>
        <p class="th-td"><em>演员：</em><span><%= vm.movieinfo.actor %></span></p>
    </div>
    <h4>剧情简介</h4>
    <div class="content-in">
        <!--scaling-->
        <p class="scaling"><%= vm.movieinfo.detail %></p>
    </div>


    <!-- 遮罩 m-show -->
    <div class="imgBox screenshots showbigimgidv" style="display:none;">
        <ul>
            <li><a><img src="" class='bigimg'></a></li>
        </ul>
        <span class="columns"></span>
    </div>
</div>
