--- |
<div class="movie-list"">
    <header>
        <div class="nav-back ct-r pos-r">
            <h2>即将上映</h2>
            <a class="js-movie-list">购票</a>
        </div>
    </header>
    <ul j-field="vm.list">
    <% _.each(vm.movies, function(movie) { %>
        <li k="<%= movie.id %>">
            <a class="touchable">
            <img  class="gomovieinfo" data-movieid="<%=movie.id%>" src="<%=(movie.info.movie_poster_mini?movie.info.movie_poster_mini.replace('wepiao', parseInt(new Date().getTime() / 600000)):'')%>" width="93" height="135">
            <div>
                <h3><b><%= movie.name %></b></h3>
                <p><%= movie.tags %></p>
                <p>导演：<%= movie.director %></p>
                <p>主演：<%= movie.actor %></p>
                <p>上映日期：<%= FmtD(movie.date) %></p>
                <p><%= movie.remark %></p>
            </div>
        </a></li>
     <% }); %>
    </ul>
</div>
<%

function FmtD(date){
    var today = new (require('util/date')).byYmdStr(date);
    return today.getYmd('.');
}
%>