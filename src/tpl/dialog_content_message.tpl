--- |
    <div class="<%=msgClass%>"><%=message%></div>
    <div class="btn-box grid1-1">
    
      <% if(obj.buttons) _.each(obj.buttons, function(text, cls) { %>
        <a class="btn touchable <%=cls%>"><%=text%></a>
      <% }) %>
    
    
      <% if(cancel) { %>
      <a class="btn touchable btn-cancel"><%=cancel%></a>
      <% } %>
      <% if(ok) { %>
      <a class="btn touchable btn-ok"><%=ok%></a>
      <% } %>
    </div>
