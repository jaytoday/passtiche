$(function () {
    // Grab the data
    var good_data = [],
        bad_data = [],
        axisx = [],
        axisy = [],
        table = $("#engagement_chart__{{ book.key() }}_data:first");
        
    if (table.length < 1)
        return console.log('not rendering engagement chart. table not found');
    
    $("tbody td", table).each(function (i) {
        
        g = [];
        b = []
        $(this).find('.good').each(function(){
           g.push(parseInt($(this).text())); 
        });
        $(this).find('.bad').each(function(){
           b.push(parseInt($(this).text())); 
        });
        good_data.push(g); bad_data.push(b);
    });
    //console.log('good_data', good_data);
    //console.log('bad_data', bad_data);
    table.hide();
    $("tbody th", table).each(function () {
        axisy.push($(this).text());
    });
    $("tfoot th", table).each(function () {
        axisx.push($(this).text());
    });
    // Draw
    var width = 690,
        height = 250,
        leftgutter = 50,
        bottomgutter = 0,
        r = Raphael("engagement_chart__{{ book.key() }}", width, height),
        txt = {"font-size": '12px', 'font-weight':'bold', stroke: "none", fill: "#000"},
        X = (width - leftgutter) / axisx.length + 5,
        Y = (height - bottomgutter) / axisy.length,
        color = $("#chart").css("color");
        max = Math.round(X / 2) - 1;
    // r.rect(0, 0, width, height, 5).attr({fill: "#000", stroke: "none"});
    for (var i = 0, ii = axisx.length; i < ii; i++) {
        // TODO: only for some chapters if there are too many
        label_y_offset = 37; // 136
        r.text(leftgutter + X * (i + .1), label_y_offset, 'Chapter ' + axisx[i]).attr(txt);
    }
    for (var i = 0, ii = axisy.length; i < ii; i++) {
        //r.text(10, Y * (i + .5), axisy[i]).attr(txt);
    }
    var o = 0;
    for (var i = 0, ii = axisy.length; i < ii; i++) {
        for (var j = 0, jj = axisx.length; j < jj; j++) {
            // modified for book visualization
            
            var gdata = good_data[o];
            var bdata = bad_data[o];
            
            $.each([gdata,bdata], function(xi, data_list){
               if (xi == 0)
                var data_type = 'good';
               else
                var data_type = 'bad';
                
               // console.log(data_type, data_list);
               var all_dots = [];
                
                $.each(data_list, function(xe, data_val){
                    
                   // console.log('data_val', data_val, data_type);
            
                    var R = data_val && Math.min(Math.round(Math.sqrt(data_val / Math.PI) * 6), max);

                    if (R) {
                        {% include "dot_inner_loop.js" %}
                    } // end R loop
                    
                }); // data_list each
            }); // gdata,bdata each
        
            
            o++;
        } //axisx
    } // axisy
});