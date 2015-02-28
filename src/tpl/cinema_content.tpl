--- |

	 <div class="m-gap cinemas-box">
		<div class="h-box m-box m-box-m0">
			<a>
				<img src="css/img/logo/logo.png" alt="" class="logo">
				<h4><%=vm.cinema.name%></h4>
				<p>营业时间：<%=vm.cinema.openning_time%></p>
				<% if (vm.cinema.seat_status==1){%>
				<span class="btn-top js-buy">在线购票</span>
				<%}	%>
			</a>
		</div>
		<ul class="m-list">
		<% if (vm.cinema.addr){
		    var canMap= (vm.cinema.longitude && vm.cinema.longitude.length>0 && vm.cinema.latitude.length>0 );
		%>
			<li><a class="js-map">地址：<%=vm.cinema.addr%> <%=canMap?'<i class="ico-pos m-l-right">位置</i>':''%></a></li>
		<%	}%>
		<% if (vm.cinema.tele){%>
			<li><a href="tel:<%=vm.cinema.tele%>">电话：<%=vm.cinema.tele%> <i class="ico-tel m-l-right">电话</i></a></li>
        <% }%>
		<% if (vm.cinema.route){%>
			<li>
				<strong>交通路线</strong>
				<p><%=vm.cinema.route%></p>
			</li>
         <%   }	%>
		<% if (vm.cinema.discount_info){%>
			<li>
				<strong>优惠信息</strong>
				<p><%=vm.cinema.discount_info%></p>
			</li>
         <%   }	%>
		<% if (vm.cinema.speciality && vm.cinema.speciality.length>0){%>
			<li>
				<strong>特色信息</strong>
				<p>
				  <% _.each(vm.cinema.speciality, function(p,i) {
                    var pl=[];
                    for(var t in p){pl.push(t);}
                    if (pl.length>0){
				  %>
                        <%=pl[0]%>：<%=p[pl[0]]%><%= i<vm.cinema.speciality.length?'<br>':''%>
				  <%}
				  })%>
			</li>
        <%  }%>
		</ul>
	</div>