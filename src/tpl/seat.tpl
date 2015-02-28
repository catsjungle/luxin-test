--- |
    <style type="text/css">
    	.seats-box {
    		margin: 0;
            min-height: 50px;
    	}
    	.roomContainer {
    		position: relative;
    		width: 100%;
            background: white;
    	}
    	.roomContainer * {
    		-webkit-user-select: none;
    	}
    	.room {
    		margin: auto;
    		position: relative;
    		overflow: hidden;
    		visibility: hidden;
            background: #ccc;
    	}
        .room .row {
            clear: both;
        }
        .room .seat.bg1.void {
            /*background: rgba(200,200,200,0.2);*/
        }
    	.room .seat {
    		font-family: 'ico-webfont', serif;
    		font-weight: normal;
    		font-style: normal;
    		text-decoration: inherit;
    		-webkit-font-smoothing: antialiased;
    
    		text-align: center;
    		cursor: default;
    
    		font-size: 36px;
            width: 47px;
    		position: relative;
            float: left;
    	}
    	.room.part .num {
    		display: block !important;
    		position: absolute;
    		font-family: sans-serif;
    		font-weight: bold;
    		top: 0;
    		left: 0;
    		bottom: 0;
    		right: 0;
    		text-align: center;
    		line-height: 36px;
    		font-size: 18px;
    		color: black;
    	}
    	.room .seat.available i.char {
    		color: #fff;
    	}
    	.room .seat.locked i.char {
    		color: #a1a1a1;
    	}
    	.room .seat.checked i.char {
    		color: #ff6c00;
    	}
    	.room.part .seat.checked .num {
    		color: white;
    	}
        .hIndicator {
            z-index: 3010;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            color: white;
            border-radius: 5px;
            font-size: 26px;
        }
        .hIndicator .desc {
            background: rgba(0, 0, 0, 0.7);
            width: 30px;
            height: 37px;
            text-align: center;
        }
        .room .iScrollVerticalScrollbar {
            display:none;
        }
    
        .room .iScrollHorizontalScrollbar {
            top: 0;
            z-index:2050;
        }
    </style>
        
    <div class="m-gap mov-seats" style="visibility: hidden" j-field="vm.seatLoaded">
        <% var datemp = vm.mp.date %>
        <% var datestr = datemp.toString(); %>
        <% var y = datestr.substring(0, 4); %>
        <% var m = datestr.substring(4, 6); %>
        <% var d = datestr.substring(6); %>
        <% var str = y + '年' + m + '月' + d + '日'; %>


        <% if(0 == countSeat(function(seat){ return seat.available?1:0; })) { %>
        <div class="h-box m-box m-box-m0 arr-r">
            <a class="btn-pick touchable">
                <h4><%=vm.movie.name%> </h4>
    
                <p><%=vm.mp.type%><%=vm.mp.lagu%> <%=daystr[vm.mp.date] || str%> <%=vm.mp.time%>场</p>
                <span class="m-l-right"></span>
            </a>
        </div>
        <div class="no-info">
            <p class="L"><i class="ico-overflowing">满座</i>该场次已经爆棚，换个场次看吧</p>
        </div>
        <% } else { %>
        <div class="lockee">
            <div class="h-box m-box m-box-m0 arr-r">
                <a class="btn-pick touchable">
                    <h4><%=vm.movie.name%> </h4>
                    <p><%=vm.mp.type%><%=vm.mp.lagu%> <%=daystr[vm.mp.date] || str%> <%=vm.mp.time%>场</p>
                    <span class="m-l-right"></span>
                </a>
            </div>
    
            <h3 class="head-seat"><%=vm.room.sRoomName%>银幕方向</h3>
            <div class="seats-box">
    
                <div class="roomContainer">
                <% if(vm.seatLoaded) { %>
                    <div class="room part">
                        
                        <% table(); %>
                        <div class="hIndicator" style="height: 100%">
                            <div class="scroller">

                                <%if(!vm.wanda){%>

                                <% _.each(vm.room.sSeatInfo, function(row, r) { %>
                                <div class="desc"><%=row.desc || "&nbsp;"%></div>
                                <% }); %>

                                <%}%>

                            </div>
                        </div>
                        
                    </div>
                <% } else { %>
                    loading...
                <% } %>
                </div>
                <div class="legend-bar">
                图例：<i class="ico-seat-1"></i>可选
                <i class="ico-seat-2"></i>已选
                <i class="ico-seat-3"></i>已售
            </div>
            </div>
        </div>
    
    	<div class="seats-info<%= state == 'pay' ? ' locking-seats' : '' %>" j-field=".checkedSeats">
    		<div class="display-box">
                <%if(vm.wanda){%>
                <strong>已选：</strong>
                <ol>
                    <%if(vm.wanda.sSeat&&vm.wanda.sSeat.length>2){%>
                    <li class="seat-label"><%=vm.wanda.sSeat.replace(/\|/g, "座</li><li class='seat-label'>").replace(/:/g, "排")+"座"%></li>
                    <%}%>
                    
                </ol>
                <%}else{%>
                    <% if(checkedSeats && _.keys(checkedSeats).length > 0) { %>
                    <%  var lockedseats = {}; 
                        for(var i in checkedSeats) {

                            lockedseats[i] = true;
                        }
                        checkedSeats = lockedseats;
                    %>
                    <strong>已选：</strong>
                    <% } else if(vm.seatLoaded) { %>
                    <strong>本影厅共有<%=countSeat(function(seat){ return seat.isSeat?1:0;})%>个座位，剩余<%=countSeat(function(seat){
                        return seat.available?1:0;})%>个座位可选</strong>
                    <ol style="visibility:hidden">
                        <li>&nbsp;</li>
                    </ol>
                    <% } %>
                    <ol>
        			<% _.each(checkedSeats, function(n, rc) { %>
        				<% rc = rc.split(':'); %>
        				<li class="seat-label"><%=rc[0]%>排<%=rc[1]%>座</li>
        			<% }); %>
        			</ol>
                <%}%>
    		</div>

            <% if(vm.discount > 0) { %>
            <div class="total-info">
                <span><i class="ico-hui">惠</i>您是首次购票的用户，下单立减10元</span>
                <span><b>-10</b>元</span>
            </div>
            <% } %>
    		<div j-field=".state">
                <%if(vm.wanda){%>
                <div class="total-info display-table">
                    <span class="table-cell">手机号码：<b><%=vm.phone%></b></span>
                    <span class="table-cell"><a class="btn js-editphoto">编 辑</a></span>
                </div>
                <%}%>
    			<div class="total-info">
                    <% if(state == 'pay') { %>
    				<span j-field="counter.tick">
                        <% var remain; if(counter && (remain = counter.remain())) { %>
                        <i class="ico-time"></i>
                        支付剩余时间: <b>
                            <%=remain[1]%>分<%=remain[0] < 10 ? '0' + remain[0] : remain[0]%>秒
                        </b>
    
                        <% } %>
                    </span>
                    <% } %>
    				<% if(!vm.wanda&&_.keys(checkedSeats).length > 0) { %>
    				<span>共计: <b><%=(function(){
                        var total = parseInt(vm.mp.price, 10) * _.keys(checkedSeats).length;
                        if(vm.discount > 0 && total > vm.discount) {
                            total -= vm.discount;
                        }
                        return total / 100;
                    })() %></b>元</span>
                    <%
                    } %>
                    <% if(vm.wanda) { %>
                    <span>共计: <b><%=((vm.discount > 0 && vm.wanda.iTotalFee > vm.discount)?vm.wanda.iTotalFee-vm.discount:vm.wanda.iTotalFee) / 100%></b>元</span>
                    <% } %>
    			</div>
                <%if (!vm.wanda&&_.keys(checkedSeats).length>0&&vm.mptag){
                    if (vm.mptag==1){%>
                    <p class="yellow">*本影厅观影，需自备3D眼镜或现场5元/副购买</p>
                    <% } else if (vm.mptag==2){%>
                    <p class="yellow">*本影厅观影，现场需交纳100元/副3D眼镜押金</p>
                <%
                    }
                } %>
                <% if(state == 'pick') { %>
    				<div class="btn-box grid1-1">
                        <a class="btn btn-lock touchable">确认选择</a>
                        <br/><br/><br/><br/>
                    </div>
    			<% } else if(state == 'locking') { %>
                    <div class="btn-box grid1-1">
                        <a class="btn">正在锁座</a>
                        <br/><br/><br/><br/>
                    </div>
    			<% } else if(state == 'unlocking') { %>
                    <div class="btn-box grid1-1">
                        <a class="btn">正在解锁</a>
                        <br/><br/><br/><br/>
                    </div>
                <% } else if(state == 'pay') { %>
    				<div class="btn-box grid1-1">
                        <a class="btn-as btn-unlock touchable">取消订单</a>
                        <a class="btn btn-buy touchable">立即购买</a>
                        <br/><br/><br/><br/>
    				</div>
    				<p>提示: 请核对场次和座位，购买后不可退换!</p>
                    </p>
    			<% } %>
            </div>
    	</div>
    
    
        <% }%>
    </div>
    
    
    <% function table() { with(obj||window) { %>
    <div class="table">

        <%if(!vm.wanda){%>

    	<% _.each(vm.room.sSeatInfo, function(row, r) { %>
    	<div class="row">
    		<div class="seat"><%=vm.seatChar.noseat%></div>
    		<% _.each(row.detail, function(seat, c) { %>
    		<div class="seat <%=seat.status%> <%=loveClass[seat.loveInd]%> bg<%=(r+c)%2%>"<% if(seat.isSeat) { %> title="<%=row.desc%>排<%=seat.n%>座"<% } %> <% if(seat.available) { %>available="true"<% } %> row="<%=r%>" col="<%=c%>" loveInd="<%=seat.loveInd%>">
    			<i class="char"><%=seat.char%></i>
    			<% /* if(seat.isSeat) { %>
    			<div class="num"><%=seat.n%></div>
    			<% } */ %>
    		</div>
    		<% }); %>
    	</div>
    	<% }); %>

        <%}%>

    </div>
    <% } }/*end function table*/ %>
    
    
    
    <% function countSeat(iterator) {with(obj || window) {
        if(vm.wanda){return 1;}else{
            return _.reduce(vm.room.sSeatInfo, function(memo, row) {
                return memo + count(row);
            }, 0);
        }
        function count(row) {
            return _.reduce(row.detail, function(memo, seat) {
                return memo + iterator(seat);
            }, 0);
        }
    }} %>
    