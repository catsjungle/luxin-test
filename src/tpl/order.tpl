--- |
    <%
        function  _getShowTime(dt){       
            var d = "".split.call(dt, ' ');
            if (d.length>2){
                return d[0] + "<br>" + d[1] + '  ' + d[2] + "<br>";
            }
        }
    %>

    <%
    //订单首页 begin
    if (vm.viewtype=='main'){%>
    <div class="my-mov-box">
        <div class="nav-back pos-r">
            <h2>我的影票</h2>
        </div>
        <ul class="m-list arr-r">
            <li k="payed" c="<%=vm.order_main.payed %>"><a class="touchable">
                <i class="ico-ticket-a"></i>
                未使用
                <span class="m-l-right"><%=vm.order_main.payed %></span>
            </a></li>
            <li k="unpayed" c="<%=vm.order_main.unpayed %>"><a class="touchable">
                <i class="ico-ticket-b"></i>
                待付款
                <span class="m-l-right"><%=vm.order_main.unpayed %></span>
            </a></li>
            <li k="finished" c="<%=vm.order_main.finished %>"><a class="touchable">
                <i class="ico-ticket-c"></i>
                已完成
                <span class="m-l-right"><%=vm.order_main.finished %></span>
            </a></li>
        </ul>
        <div class="bottom-aid-info">
            <p><a href="tel:<%=vm.tele%>"><i class="ico-tel"></i>客服电话：<%=vm.tele%></a><br>
                Powered by <img src="css/img/logo/logo-b.png" alt="" style="width: 25%;"></p>
        </div>
    </div>
    <%}
    //订单首页 end
    //未使用 begin
    else if (vm.viewtype=='payed'){
    %>
    <div class="my-mov-box">
        <div class="nav-back pos-r">
            <h2>我的影票-未使用</h2>
        </div>
        <ul class="m-list m-l-split">
        <% _.each(vm.payOrder, function(o) { %>
            <li class="t-sawtooth-r js-to-detail" oid="<%=o.order_id%>">
                <div class="display-box">
                    <h4 class="box-flex"><%=o.movie_name%></h4>
                    <strong><%=o.ticketCount%>张</strong>
                </div>
                <p><%=_getShowTime(o.show_date)%><%=o.cinema_name%>
                </p>
            </li>
         <% }); %>
        </ul>
    </div>
    <%}
    //未使用 end
    //未支付 begin
    else if (vm.viewtype=='unpayed'){
    %>
    <div class="my-mov-box">
        <div class="nav-back pos-r">
            <h2>我的影票-待付款</h2>
        </div>
        <ul class="m-list m-l-split">
        <% _.each(vm.unpayOrder, function(o) { %>
            <li class="t-sawtooth-r js-topay" oid="<%=o.sTempOrderID%>">
                <div class="display-box">
                    <h4 class="box-flex"><%=o.movie_name%></h4>
                    <strong><%=o.ticketCount%>张
                                            <span class="btn js-topay" oid="<%=o.sTempOrderID%>" >付款</span>
                    </strong>
                </div>
                <p><%=_getShowTime(o.sPlayTime)%><%=o.cinema_name%></p>
            </li>
         <% }); %>
        </ul>
    </div>
    <%}
    //未支付 end
    //已完成 begin
    else if (vm.viewtype=='finished'){
    %>
    <div class="my-mov-box">
        <div class="nav-back pos-r">
            <h2>我的影票-已完成</h2>
        </div>
        <ul class="m-list m-l-split">
        <%
         _.each(vm.finishOrder, function(o) { %>
            <% console.log(o.state); %>
            <li class="t-sawtooth-r js-to-detail" oid="<%=o.order_id%>">
                <div class="display-box">
                    <h4 class="box-flex"><%=o.movie_name%></h4>
                    <strong><%=o.ticketCount%>张</strong>
                </div>
                <p><%=_getShowTime(o.show_date)%><%=o.cinema_name%>
                 <br>状态：<%=EOrderStatus[o.state]||'其它状态'%>
                </p>
            </li>
         <% }); %>
        </ul>
    </div>
    <%}
    //已完成 end
    //订单详情 begin
    else if (vm.viewtype=='detail'&&vm.orderDetail){
    %>
    <div class="gap-lr detail-box">
    		<div class="nav-back pos-r hr-radius">
    			<h2>订单号：<%=vm.orderDetail.order_id||vm.orderDetail.sTempOrderID%></h2>
    		</div>
    		<ul class="m-list">
    			<li>
    				<h4><b><%=vm.orderDetail.movie_name%></b></h4>
    				<p><%=vm.orderDetail.cinema_name%></p>
    			</li>
    			<li class="hr-radius">
    				<b>兑换码</b>
    				<p class="hot"><%=EStatusMsg[vm.orderDetail.state]||vm.orderDetail.cd_key.split("|")[0]%></p>
    			</li>
    			<li> 
    				<b>座位</b>
    				<p class="hot"><%=vm.orderDetail.seat_lable%></p>
    			</li>
    			<li>
    				<b>场次</b>
    				<p><%=vm.orderDetail.show_date||vm.orderDetail.sPlayTime%></p>
    			</li>
    			<li class="hr-radius">
    				总价：<b><%=vm.orderDetail.totalPrice/100%></b>元
    			</li>
    			<li>
    				<b>影院地址</b>
    				<p><%=vm.orderDetail.cinemaAddr%></p>
    			</li>
    		</ul>
            <div class="bottom-aid-info">
                <p><a href="tel:<%=tele%>"><i class="ico-tel"></i>客服电话：<%=tele%></a><br>
                    Powered by <img src="css/img/logo/logo-b.png" alt="" style="width: 25%;"></p>
            </div>
    	</div>
    <%}%>
