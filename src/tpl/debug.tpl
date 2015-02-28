--- |
    <style>
      p {line-height: 1.5em; font-size: 24px;}
    </style>
    <h1>DEBUG FLAGS</h1>
    <a href="#">go home</a>
    <hr />
    <a href="javascript:alert(JSON.stringify($.browser))">browser?</a>
    <hr />
    <% _.each(switches, function(name) { %>
    
    <p switch="<%=name%>">
        <strong><%=name%></strong>
        &nbsp;
        <span>
            <%=localStorage['debug_'+name] ? 'T' : 'F'%>
        </span>
    </p>
    
    <% }); %>