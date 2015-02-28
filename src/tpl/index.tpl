--- |
    <a href="javascript:void(0)" class="example-city">Pick City</a>
    
    <hr />
    
    <a href="javascript:void(0)" class="example">Open Dialog</a>
    
    <a href="javascript:void(0)" class="example-alert">alert!</a>
    
    <a href="javascript:void(0)" class="example-confirm">confirm?</a>
    
    <% _.each(vm.movies, function(movie) { %>
    <div>
        <a href="#movie-<%=movie.id%>-1"><%=movie.name%></a>
        <img height=40 src="http://imgcache.qq.com/piao/pics/movies/<%=movie.id % 100%>/<%=movie.id%>/<%=movie.id%>_120_168.jpg" />
    </div>
    <% }); %>
    <hr/>
    
    
    <div class="ctn_will" j-field="vm.will_movies">
        <a class="btn_will">即将上映<%=!!show_will_movies%></a>
        <% if(show_will_movies) { %>
        <% _.each(vm.will_movies, function(movie) { %>
        <div>
            <%=JSON.stringify(movie)%>
            <img height=40 src="http://imgcache.qq.com/piao/pics/movies/<%=movie.id % 100%>/<%=movie.id%>/<%=movie.id%>_120_168.jpg" />
        </div>
        <% }); %>
        <% } %>
    </div>
    