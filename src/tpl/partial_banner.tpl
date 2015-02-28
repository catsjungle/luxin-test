--- |
    <div class="wrapper">
        <div class="scroller banner_content">
            <% _.each(vm.items, function(item) { %>
                <a href="<%=item.url%>" style="background: <%=item.bg%>">
                    <img src="<%=item.img%>" alt="" height="75" />
                </a>
            <% }); %>
        </div>
    </div>