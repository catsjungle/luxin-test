--- |
    <div class="city-list" j-field="vm.list .key .pyOpen">
      <% if(vm.current) { %>
      <h3 py="<%= vm.current.city_name %>">当前城市:<%=vm.current.city_name%></h3>
      <ul>
        <% _.each(vm.citylist, function(city) { %>
        <li k="<%= city.city_id %>,<%= city.id %>" class="touchable item<%= (city.id == obj.key||city.id == vm.current.id) ? ' current' : '' %>">
            <a>
                <h4><%= city.name %></h4>
                <p><%= city.addr %></p>
            </a>
        </li>
        <% }); %>
        <!--<li class="<%= !obj.key ? ' current' : '' %>">
            <a>
                <h4><%= vm.current.name %></h4>
                <p><%= vm.current.addr %></p>
            </a>
        </li>-->
      </ul>
      <% } %>
      <h3>热门城市</h3>
      <% _.each(vm.hotlist, function(cities, py) { %>
      <h3<%= pyOpen[py] ? '' : ' class="m-hide"' %> py="<%= py %>"><%= py %></h3>
      <ul>
        <% _.each(cities, function(city) { %>
        <li k="<%= city.city_id %>,<%= city.id %>" class="touchable item<%= city.id == obj.key ? ' current' : '' %>">
            <a>
                <h4><%= city.name %></h4>
                <p><%= city.addr %></p>
            </a>
        </li>
        <% }); %>
      </ul>
      <% }); %>
      <h3>更多城市</h3>
      <% _.each(vm.list, function(cities, py) { %>
      <h3<%= pyOpen[py] ? '' : ' class="m-hide"' %> py="<%= py %>"><%= py %></h3>
      <ul>
        <% _.each(cities, function(city) { %>
        <li k="<%= city.city_id %>,<%= city.id %>" class="touchable item<%= city.id == obj.key ? ' current' : '' %>">
            <a>
                <h4><%= city.name %></h4>
                <p><%= city.addr %></p>
            </a>
        </li>
        <% }); %>
      </ul>
      <% }); %>
    </div>