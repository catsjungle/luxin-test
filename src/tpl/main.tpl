zepto
--- |
	<% var hideFooter = $.os.ios && $.browser.wechat && $.browser.fVersion >= 5.2; %>
    <style type="text/css">
	<% if (!hideFooter) { %>
        .content {
            margin-bottom: 42px;
        }
	<% } %>
        .bgt200 {
            transition: 300ms background;
        }
    
        .AD-box div, .AD-box a, .AD-box img {
            height: 100%;
        }
        .banner_content a {
            float: left;
            display: block;
            text-align: center;
        }
    
        .AD-box .iScrollHorizontalScrollbar {
            position: absolute;
            z-index: 9999;
            left: 0;
            right: 0;
            top: 0;
            opacity: 0.8;
            overflow: hidden;
        }
        <%
        var thisTime = new (require('util/date'))(new Date(new Date().valueOf()));
        var showTips=(thisTime.getYmd() == '20140515' && thisTime.getHms() < '18:00:00') ;
        localStorage.static_showTips=(showTips?1:0);
        //alert(thisTime.getYmd());alert(thisTime.getHms());alert(showTips);
        %>
	    <% if (showTips) { %>
        .wrapper.content {
            margin-top: 50px;
        }
	    <% } %>
    </style>
    <% if (showTips) { %>
    <div class="top-tips" style="display:none-;min-height: 35px">
    <i class="ico-excl">!</i>
    <p>客服电话今日9:00-18:00因升级暂停服务。<br>
    紧急问题可致电:13521366873，正常购票不受影响。</p>
    </div>
    <% } %>
    <div class="loading" id="loading">
        <i></i>
    </div>
    <div id="main" class="<%=hideFooter?"":"content"%>"></div>
    
    <nav class="fotter-bar <%=hideFooter ? " m-hide" : "" %>">
        <a class="btn-← touchable bottom-back">上一步</a>
        <a class="btn-f5 touchable bottom-refresh">刷新</a>
        <!-- <a class="btn-f5 btn-disable">刷新</a> -->
    </nav>
