--- |
<div class="imgBox js_wrapper">
    <div class="screenshots showbigimgidv btn-close">
        <ul>
            <%
            if(vm.movieinfo.movie_still){%>
                <% _.each(vm.movieinfo.movie_still.split("|"), function(pic) {
                %>
                    <%if(pic!=""){%>
                     <li><a><img src="<%= pic.replace('wepiao', parseInt(new Date().getTime() / 600000)) %>" alt=""></a></li>
                    <%}%>
                <%})%>
            <%}%>
        </ul>
    </div>
    <span class="columns m-hide"></span>
</div>
