--- |
<div class="detailed-box">
    <h4 class="center"><%= vm.movieinfo.name %></h4>
    <%if(vm.ismovie){%>
    <p class="ts">建议：在WIFI环境下观看，避免浪费流量 <!--<a class="btnG js_gobuy">购票</a>--></p>
    <div class="square-list m2">
        <ul>
         <% _.each(vm.movieinfo.videos, function(v,vi) { %>
            <li>
                <a class="playmovie"
                 data-vid="<%=v.vid%>" 
                 data-name="<%=v.tt%>"
                 ><img src="<%=v.screenshot%>" alt="">
                 <b><%=v.tt%></b></a>
            </li>
        <%})%>
        </ul>
    </div>

    <%}%>
    <%if(vm.ispic){%>
    <div class="square-list m4">
        <ul>
            <%if(vm.movieinfo.movie_still_mini){%>
                <% _.each(vm.movieinfo.movie_still_mini.split("|"), function(pic,i) { %>
                    <%if(pic!=""){%>
                    <li><a class="showbigimg" allcount="<%=vm.movieinfo.pics.split("|").length-1%>" num="<%=i%>"  ghref="<%= vm.movieinfo.movie_still.split("|")[i].replace('wepiao', parseInt(new Date().getTime() / 600000)) %>"><img src="<%= pic.replace('wepiao', parseInt(new Date().getTime() / 600000)) %>" alt=""></a></li>
                    <%}
                    else i--;
                    %>
                <%})%>
            <%}%>
        </ul>
    </div>
    <%}%>
    <!-- 遮罩 m-show -->
    <div class="imgBox screenshots showbigimgidv" style="display:none;">
        <ul>
            <li><a><img src="" class='bigimg'></a></li>
        </ul>
        <span class="columns"></span>
    </div>
</div>
