function renderAudienceDemographics(){
    
    
    //console.log('worldmap',worldmap);
    // Location
           Raphael('location_map_' + book_key, 790, 310, function () {
                var r = this;
                r.rect(0, 0, 1000, 400, 10).attr({
                    stroke: "none",
                    fill: "0-#9bb7cb-#adc8da"
                });
                var over = function () {
                    this.c = this.c || this.attr("fill");
                    this.stop().animate({fill: "#bacabd"}, 500);
                },
                    out = function () {
                        this.stop().animate({fill: this.c}, 500);
                    };
                r.setStart();
                var hue = Math.random();
                for (var country in worldmap.shapes) {
                    // var c = Raphael.hsb(Math.random(), .5, .75);
                    // var c = Raphael.hsb(.11, .5, Math.random() * .25 - .25 + .75);
                    r.path(worldmap.shapes[country]).attr({stroke: "#ccc6ae", fill: "#f0efeb", "stroke-opacity": 0.25}).scale(0.8,0.8,0,0);
                }
                world = r.setFinish();
                world.hover(over, out);
                // world.animate({fill: "#666", stroke: "#666"}, 2000);
                world.getXY = function (lat, lon) {
                    return {
                        cx: lon * .8 * (2.6938) + .8 * 465.4,
                        cy: lat * .8 * -2.6938 + .8 * 227.066
                    };
                };
                world.getLatLon = function (x, y) {
                    return {
                        lat: (y - 227.066) / -2.6938,
                        lon: (x - 465.4) / 2.6938
                    };
                };
                var latlonrg = /(\d+(?:\.\d+)?)[\xb0\s]?\s*(?:(\d+(?:\.\d+)?)['\u2019\u2032\s])?\s*(?:(\d+(?:\.\d+)?)["\u201d\u2033\s])?\s*([SNEW])?/i;
                world.parseLatLon = function (latlon) {
                    var m = String(latlon).split(latlonrg),
                        lat = m && +m[1] + (m[2] || 0) / 60 + (m[3] || 0) / 3600;
                    if (m[4].toUpperCase() == "S") {
                        lat = -lat;
                    }
                    var lon = m && +m[6] + (m[7] || 0) / 60 + (m[8] || 0) / 3600;
                    if (m[9].toUpperCase() == "W") {
                        lon = -lon;
                    }
                    return this.getXY(lat, lon);
                };
                
                  world.addCity = function (lat, lon) {
                    this.getXY(lat, lon);
                    attr.r = 0;
                    dot.stop().attr(attr).animate({r: 5}, 1000, "elastic");
                    // dot2.stop().attr(attr).animate({r: 10}, 1000, "elastic");
                    return false;
                };   

         
                var frm = document.getElementById("latlon-form"),
                    dot = r.circle().attr({fill: "r#FE7727:50-#F57124:100", stroke: "#fff", "stroke-width": 2, r: 0}),
                    // dot2 = r.circle().attr({stroke: "#000", r: 0}),
                    ll = document.getElementById("latlon"),
                    cities = document.getElementById("cities");
                world.addCity = function (lat, lon) {
                    //console.log('adding city', lat, lon);
                    var attr = this.getXY(lat, lon);
                    //console.log('attr',attr);
                    attr.r = 6;
                    new_dot = dot.clone();
                    new_dot.stop().attr(attr);


                    /* 
                    
                    This code adds random clusters based on one point
                    
                    for (f=0; f<14; f++){
                        
                        var delta = Math.random() * Math.random() * 15;
                        if (Math.random() > .5)
                            delta = delta * -1;
                      //  console.log(delta);
                        new_attr = {cx:attr.cx, cy: attr.cy, r: attr.r};
                        if (Math.random() > .5)
                            new_attr['cx'] = new_attr['cx'] + delta;
                        else
                            new_attr['cx'] = new_attr['cx'] - delta;
                        if (Math.random() > .5)
                            new_attr['cy'] = new_attr['cy'] - delta;
                        else
                            new_attr['cy'] = new_attr['cy'] + delta;
                        new_dot = dot.clone();
                       // console.log(new_dot,new_attr);
                         new_dot.stop().attr(new_attr);//.animate({r: 5}, 1000, "elastic");
                                                 
                    };
                    */
                   
                    // dot2.stop().attr(attr).animate({r: 10}, 1000, "elastic");
                    return false;
                };
                
                /*
                // san francisco
                world.addCity(37, -122);
                // new york
                world.addCity(40, -74);
                */
                
                $.each(reader_locations, function(i, loc){
                    //console.log(i,loc);
                    world.addCity(parseFloat(loc['lat']), parseFloat(loc['lng']))                    
                });
         
            });
                
                
          
    // Age
      // display distribution of progress through book
  var age_data = [];
  var age_total = 0;
  audience_insights_wrapper.find('#age_chart_' + book_key + '_data:first').find('div').each(function(){
     var sample_age = parseInt($(this).find('.sample').text());
     var purchased_age = parseInt($(this).find('.purchased').text());
     age_total += sample_age; age_total += purchased_age;
     age_data.push({
        'a': $(this).attr('range'),
        'sort': parseInt($(this).attr('sort')),
        'sample_age': sample_age,
        'purchased_age': purchased_age
     }); 
  });

var age_chart_options = {
  element: 'age_chart_' + book_key,
  data: age_data,
  xkey: 'a',
  ykeys: ['sample_age','purchased_age'],
  hidey: true,
  hideHover: true,
  labels: ['Sample', 'Purchased'],
  lineColors: ['darkGreen','#0b62a4', '#167f39'], 
    sortkey: 'sort',
  customUnits: 'Age',
  parseTime: false, 
  marginRight: 15,
//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};

if (!age_total){
    age_chart_options['ymax'] = '1';
    age_chart_options['ymin'] = '0';
}

  Morris.Line(age_chart_options);  
    
    
    
    // Income
      var income_data = [];
      var income_total = 0;
  
  audience_insights_wrapper.find('#income_chart_' + book_key + '_data:first').find('div').each(function(){
    
     var sample_income = parseInt($(this).find('.sample').text());
     var purchased_income = parseInt($(this).find('.purchased').text());    
     income_total += sample_income;
     income_total += purchased_income;
     income_data.push({
        'i': $(this).attr('range'),
        'sort': parseInt($(this).attr('sort')),
        'sample_income': sample_income,
        'purchased_income': purchased_income
     }); 
  });

var income_chart_options = {
  element: 'income_chart_' + book_key,
  data: income_data,
  xkey: 'i',
  hideHover: false,
  hidey: true,
  sortkey: 'sort',

  ykeys: ['sample_income', 'purchased_income'],
  labels: ['Sample', 'Purchased'],
  lineColors: ['darkGreen','#0b62a4', '#167f39'], 
  customUnits: 'Income',
  parseTime: false, 
  marginRight: 15,
//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};



if (!income_total){
    income_chart_options['ymax'] = '1';
    income_chart_options['ymin'] = '0';
}

  Morris.Line(income_chart_options);  


       
// Engagement History
      // display distribution of progress through book
  var engagement_history_data = [];
  var engagement_history_total = 0;
  $('#engagement_history_chart_' + book_key + '_data:first').find('div').each(function(){
     var sample_readers = parseInt($(this).find('.sample').text());
     var purchased_readers = parseInt($(this).find('.purchased').text());
     engagement_history_total += sample_readers;
     engagement_history_total += purchased_readers;
     engagement_history_data.push({
        'a': $(this).attr('range'),
        'sort': parseInt($(this).attr('sort')),
        'sample_readers': sample_readers,
        'purchased_readers': purchased_readers
     }); 
  });

var engagement_history_chart_options = {
  element: 'engagement_history_chart_' + book_key,
  data: engagement_history_data,
  xkey: 'a',
  ykeys: ['sample_readers', 'purchased_readers'],
  hidey: true,
  hideHover: true,
  labels: ['Sample', 'Purchased'],
  lineColors: ['darkGreen','#0b62a4', '#167f39'], 
  customUnits: 'Date',
    sortkey: 'sort',
  parseTime: false, 
  marginRight: 15,
//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};

if (!engagement_history_total){
    engagement_history_chart_options['ymax'] = '1';
    engagement_history_chart_options['ymin'] = '0';
}

  Morris.Line(engagement_history_chart_options); 
  

    // Engagement History
      // display distribution of progress through book
  var marketing_history_data = [];
  var marketing_history_total = 0;
  $('#marketing_history_chart_' + book_key + '_data:first').find('div').each(function(){
    
    var clicks = parseInt($(this).find('span.clicks').text());
    var spend = parseFloat($(this).find('span.spend').text());
    
    new_data = {
        'a': $(this).attr('range'),
        'sort': parseInt($(this).attr('sort')),
        'clicks': clicks,
        'spend': spend
    };
    
     
     marketing_history_total += clicks;
      marketing_history_data.push(new_data); 
   
  });

console.log(marketing_history_data);

var marketing_history_chart_options = {
  element: 'marketing_history_chart_' + book_key,
  data: marketing_history_data,
  xkey: 'a',
  ykeys: ['clicks','spend'],
  hidey: true,
  hideHover: true,
  labels: ['Clicks', 'Budget'],
  customUnits: 'Date',
    sortkey: 'sort',
   lineColors: ['#3b5999', 'darkGreen'], 
  parseTime: false, 
  marginRight: 15,
//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};

if (!marketing_history_total){
    marketing_history_chart_options['ymax'] = '1';
    marketing_history_chart_options['ymin'] = '0';
}

  Morris.Line(marketing_history_chart_options);     
  
  
setTimeout(function(){
     audience_insights_wrapper.find('.graph-initialised').each(function(){
         $(this).find('circle:first').trigger('hover');
        });
}, 500);
    
    
    
};