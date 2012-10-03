// quarterly data, custom colors, skinny lines

$('#insights_link').live('click', function(){
    
   if ($(this).hasClass('rendered')) return;
   $(this).addClass('rendered');
   
 
var widget_profile = $(this).parents('.widget_profile_inner:first');  

renderAudienceAnalytics(widget_profile);  

renderSocialAnalytics(widget_profile);
        
});


function renderAudienceAnalytics(widget_profile){
    
    console.log('rendering audience analytics');
var widget_key = widget_profile.attr('id');

/* TODO: millisecond time format isn't working right now */
/* Audience Insights */ 

var audience_data = [];
var is_zero = true;

widget_profile.find('#audience_analytics_' + widget_key +'_data:first').find('span').each(function(){
    if (parseInt($(this).attr('interactions')) || parseInt($(this).attr('readers')))
        is_zero = false;
    audience_data.push({
            q: $(this).attr('_date'), 
            a: $(this).attr('interactions'), 
            b: $(this).attr('readers')
        });
});
 
var chart_options = {
  element: 'audience_analytics_' + widget_key,
  data: audience_data,
  xkey: 'q',
  ykeys: ['a', 'b'],
  labels: ['Interactions', 'Readers'], /* Viewing Length */
  //xLabels: 'day',
  //xLabelFormat: function(d) { return (d.getMonth()+1)+'/'+d.getDate() },
  lineColors: ['#0b62a4', '#167f39'],
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};

if (is_zero)
    chart_options['ymax'] = 1;

  
Morris.Line(chart_options);

}; // end renderAudienceAnalytics




function renderSocialAnalytics(widget_profile){
    console.log('rendering social analytics');
    var widget_key = widget_profile.attr('id');
    var social_data = [];
    var is_zero = true;
    widget_profile.find('#social_analytics_' + widget_key +'_data:first').find('span').each(function(){
        if (parseInt($(this).attr('facebook')) || parseInt($(this).attr('twitter')))
            is_zero = false;
        
        social_data.push({        
                q: $(this).attr('_date'), 
                a: $(this).attr('facebook'), 
                b: $(this).attr('twitter')
            });
    });
  
 
    var chart_options = {
      element: 'social_analytics_' + widget_key,
      data: social_data,
      xkey: 'q',
      ykeys: ['a', 'b'],
      labels: ['Facebook', 'Twitter'], /* Viewing Length */
      lineColors: ['#0b62a4','#4AA9ED'],
      lineWidth: 2,
      dateFormat: function (x) {  return x; }
    };

    if (is_zero)
        chart_options['ymax'] = 1;
      
    Morris.Line(chart_options);

}; // end renderSocialAnalytics



$('a', '#audience_chart_type').live('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    var widget_profile = $(this).parents(".widget_profile_inner:first");
    var widget_key = widget_profile.attr('id');
    
 $.ajax({
      type: "POST",
      url: "/ajax/widget.analytics",
      data: {
          widget: widget_key,
          days: $(this).attr('id'),
          chart: 'audience',
      },
      success: function(response){
           $('#book_profile').find('#audience_analytics_' + widget_key + '_data:first').html($(response));
           renderAudienceAnalytics(widget_profile);
        },
       error: function(){

       },
       complete: function(){

       }
    });
      
   
});


$('a', '#social_chart_type').live('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    var widget_profile = $(this).parents(".widget_profile_inner:first");
    var widget_key = widget_profile.attr('id');
    
 $.ajax({
      type: "POST",
      url: "/ajax/widget.analytics",
      data: {
          widget: widget_key,
          days: $(this).attr('id'),
          chart: 'social',
      },
      success: function(response){
           $('#book_profile').find('#social_analytics_' + widget_key + '_data:first').html($(response));
           renderSocialAnalytics(widget_profile);
        },
       error: function(){

       },
       complete: function(){

       }
    });
      
   
});