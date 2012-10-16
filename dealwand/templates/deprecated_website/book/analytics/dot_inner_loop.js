                (function (dx, dy, R, value) {
                    
                    //console.log('inner', R, value);
                    if (!value) return;
                    
                    R = R/2.5;
                    
                    // random variance
                    x_delta = Math.floor(Math.random() * (150 - 5 + 1)) + 5;
                    if ((Math.floor(Math.random() * (10 - 1 + 1)) + 1) >= 5)
                        x_delta = x_delta * -1;
                    dx = dx + x_delta;
                
                    // make sure it doesn't go outside
                    if (dx > width - 10)
                        dx = width - 10;
                    if (dx < 0)
                        dx = 0;
                        
                    y_delta = Math.floor(Math.random() * (40 - 5 + 1)) + 5;
                    
                    if ((Math.floor(Math.random() * (10 - 1 + 1)) + 1) >= 5)
                        y_delta = y_delta * -1;   
                    
                    dy = dy + y_delta;   
                    
                    console.log('y', dy);
                    if (dy > 140)
                        dy = 140;
                    dy += 15;
                     
                        
                    
                    
                    if (data_type == 'good'){ 
    
                    effect = (3 * value);
                    if (effect > 130)
                        effect = 130;
                        hue = parseInt(50 + effect);//(1 - R / max); 
                            
                        color = 'rgb(0,' + hue + ',20)';
                        
                        //color = "hsb(" + [(1 - R / max) * .5, 1, .75] + ")";
                    }else{ // bad
                       
                   effect = (3 * value);
                    if (effect > 170)
                        effect = 170;
                        hue = parseInt(60 + effect);//(1 - R / max); 
                             
                        color = 'rgb(' + hue + ',0,20)';
                        
                        //color = "hsb(" + [((1 - R) / max) * .5, 1, .75] + ")";
                        
                    }
                    //console.log(R, value, dx, dy);
                    
                    
                    dot_opacity = .05 + value/100;
                    
                    if (dot_opacity > .7){
                        dot_opacity = .8
                        var shadow = r.circle(dx + 60 + R + 1, dy + 10 + 1, R + 1).attr({opacity: ".3", stroke: "none", fill: "#444", translation: "4,4"});
                    }
                    var dt = r.circle(dx + 60 + R, dy + 10, R).attr({stroke: "none", fill: color, opacity: dot_opacity });
                    var bg = r.circle(dx + 60 + R, dy + 10, R).attr({stroke: "none", fill: "#000", opacity: .4}).hide();
                
                    var lbl = r.text(dx + 60 + R, dy + 10, R)
                            .attr({"font": '10px Fontin-Sans, Arial', stroke: "none", fill: "#000"}).hide();
            
                    var dot = r.circle(dx + 60 + R, dy + 10, max).attr({stroke: "none", fill: "#000", opacity: 0});
                
                    
             all_dots.push(dot[0]);
                    
             /* $(dot[0]).popover({
                        'title': 'Title',
                        'content': 'Content',
                        'trigger': 'manual', // manual for custom events (hover and tap)
                        'placement': 'right'
                    }); */
                          dot[0].onmouseover = function () {
                           /*  $('circle:visible', 'svg').each(function(){
                                    $(this).popover('hide');
                               });
                      $(dot[0]).popover('show');
                      setTimeout(function(){
                            $(dot[0]).popover('hide');
                         }, 5000);
                         */
                         
                       // console.log(bg, color, dt);
                        if (bg) {
                            bg.show();
                        } else {
                            var clr = Raphael.rgb2hsb(color);
                            clr.b = .5;
                           dt.attr("fill", Raphael.hsb2rgb(clr).hex);
                        }
                      //  lbl.show();
                      
                    };
                    dot[0].onmouseout = function () {
                      //  $(dot[0]).popover('hide');
                        if (bg) {
                            bg.hide();
                        } else {
                            dt.attr("fill", color);
                        }
                       // lbl.hide();
                    }; 
                })(leftgutter + X * (j + .5) - 60 - R, Y * (i + .5) - 10, R, data_val);