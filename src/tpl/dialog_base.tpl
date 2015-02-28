--- |
    
    <div class="m-modal m-modal-m">
        <div class="m-m-header">
          <h3><%=title%></h3><%
          if (content!=''){%>
          <p>（<%=content%>）</p>
          <%
          }%>
          <!--<a class="close btn-close" title="关闭">×</a>-->
        </div>
        <div class="m-m-body dialog_content"> </div>
    </div>
    <div class="full-screen"></div>