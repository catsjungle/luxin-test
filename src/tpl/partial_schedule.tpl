- tpl/partial_schedule_list
--- |
    <!-- 影院列表 -->
    <div class="m-gap mov-schedule">
        <!--<div class="m-list m-li-member">-->

            <% var today = new (require('util/date'))(new Date(new Date().valueOf() + 1800000)); %>
            <%=require('tpl/partial_schedule_list')(_.extend({sches: sches, tpl_showtime: tpl_showtime}, obj))%>
            <% function tpl_showtime(showtime, __p) {
            if(today.getYmd() == showtime.date && today.getHms() > showtime.mp.time) {
                %> class="touchable js_latemsg end" <%
            } else {
                %> k="<%=showtime.mpid%>" class="item touchable" <%
            }
                return __p;
            }/*fn tpl_showtime*/ %>

        <!--</div>-->
    
    </div><!-- 影院列表 END -->