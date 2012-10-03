
Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
        color = color || "#000";
        var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
            rowHeight = h / hv,
            columnWidth = w / wv;
        for (var i = 1; i < hv; i++) {
            path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
        }
        for (i = 1; i < wv; i++) {
            path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
        }
        return this.path(path.join(",")).attr({stroke: color});
};

$(function () {
        $("table#data:first").css({
            position: "absolute",
            left: "-9999em",
            top: "-9999em"
        });
    
        $('#insights_link').live('click', drawAnalytics);
});

function drawAnalytics(){
    console.log('draw analytics');
    $('#analytics_wrapper').html('');
    
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    // Grab the data
    var labels = [],
        data = [];
    $("table#data:first tfoot th").each(function () {
        labels.push($(this).html());
    });
    $("table#data:first tbody td").each(function () {
        data.push($(this).html());
    });
    
    // only do one week at a time
    if (labels.length > 9)
        dyn_width = 800 + (50 * (labels.length - 9));
    else
        dyn_width = 800;
    // Draw
    var width = dyn_width,
        height = 250,
        leftgutter = 5,
        bottomgutter = 30,
        topgutter = 50,
        colorhue = .6 || Math.random(),
        color = "hsl(" + [colorhue, .5, .5] + ")",
        r = Raphael("analytics_wrapper", width, height),
        txt = {font: '11px "museo-slab-1","museo-slab-2","Helvetica Neue",Helvetica,sans-serif', fill: "#fff"},
        txt1 = {font: '10px "museo-slab-1","museo-slab-2","Helvetica Neue",Helvetica,sans-serif', fill: "#fff"},
        txt2 = {font: '12px "museo-slab-1","museo-slab-2","Helvetica Neue",Helvetica,sans-serif', fill: "#000"},
        X = (width - leftgutter) / labels.length,
        max = Math.max.apply(Math, data),
        Y = (height - bottomgutter - topgutter) / max;
        
        
    // draw grid
    console.log('drawing grid', r);
    r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "rgba(100,100,100,.1)");
   
   
    var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
        label = r.set(),
        lx = 0, ly = 0,
        is_label_visible = false,
        leave_timer,
        blanket = r.set();
    /*             var day = days[i];
            if (day == current_date)
                label_attr = {'fill': '#666', 'font-size': '15px', 'font-weight': 'bold'};
            else 
                label_attr = {'fill': '#999', 'font-size': '11px'};
            date_labels[i] = r.text(x, height - 6, basic_labels[i]).attr(txt).attr(label_attr).toBack();
        */
    label.push(r.text(60, 20, "24 views").attr(txt).attr({'font-size': '15px', 'font-weight': 'bold'}));
    label.push(r.text(60, 40, "22 September 2012").attr(txt1).attr({fill: color}).attr({'font-size': '13px', 'font-weight': 'bold'}));
    label.hide();
    var frame = r.popup(100, 110, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();

    var p, bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        {% include "grid_point.js" %}
    };
    
    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({path: p});
    bgp.attr({path: bgpp});
    frame.toFront();
    label[0].toFront();
    label[1].toFront();
    blanket.toFront();
};