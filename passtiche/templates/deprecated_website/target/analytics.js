var event_url = '';
$('a', '.btn-group').live('click', function(){
   $(this).addClass('active').siblings().removeClass('active');

	advertiser = $('#advertiser_id').text();
	event_name = $('#event_type').find('.active').text();
	uid = $('#user_type').find('.active').text();
	event_url = '/api/event.track?advertiser=' + advertiser + '&event=' + event_name + '&uid=' + uid;

	$('#new_window_event').attr('href', event_url);

});

$('a:first', '#event_type').click();

$('#run_event').on('click', function(){

   $.get(event_url, function(){
		$('#analytics_wrapper').load('target #analytics_wrapper_inner', function(){
			
			drawAnalyticsCharts();
		});
 });


});


function drawAnalyticsCharts(){

 // All Activity
  var all_activity_data = [];
  var data_total = 0;
  var ykeys = [];
$('#all_activity_data:first').find('div').each(function(){
 
      activity_item = {
          'time': $(this).attr('time'),
          'readableTime': $(this).attr('readableTime'),
          'sort': parseInt($(this).attr('sort'))
       }


      $(this).find('span').each(function(){
      if (ykeys.indexOf($(this).attr('id')) < 0)
          ykeys.push($(this).attr('id'));

      var data_val = parseInt($(this).text());
      data_total += data_val;
      activity_item[$(this).attr('id')] = data_val;
      });

      all_activity_data.push(activity_item); 
  });

var all_activity_chart_options = {
  element: 'all_activity_chart',
  data: all_activity_data,
  xkey: 'time',
  xHoverkey: 'readableTime',
  ykeys: ykeys,
  hidey: true,
  hideHover: true,
  labels: ykeys,
  //lineColors: ['darkGreen','#0b62a4', '#167f39'], 
    sortkey: 'sort',
  customUnits: 'Activity',
  customLabel: false,
  parseTime: false, 
  //marginRight: 15,

//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};

if (!data_total){
    all_activity_chart_options['ymax'] = '1';
    all_activity_chart_options['ymin'] = '0';
}

console.log(all_activity_chart_options);
  Morris.Line(all_activity_chart_options);  




  /*


  */


      // Age
      // display distribution of progress through book
  var conversion_data = [];
  var data_total = 0;
  var ykeys = [];
$('#conversion_data:first').find('div').each(function(){
 
      activity_item = {
          'time': $(this).attr('time'),
          'readableTime': $(this).attr('readableTime'),
          'sort': parseInt($(this).attr('sort'))
       }


      $(this).find('span').each(function(){
      if (ykeys.indexOf($(this).attr('id')) < 0)
          ykeys.push($(this).attr('id'));

      var data_val = parseInt($(this).text());
      data_total += data_val;
      activity_item[$(this).attr('id')] = data_val;
      });

      conversion_data.push(activity_item); 
  });

var conversion_chart_options = {
  element: 'conversion_chart',
  data: conversion_data,
  xkey: 'time',
  xHoverkey: 'readableTime',
  ykeys: ykeys,
  hidey: true,
  hideHover: true,
  labels: ykeys,
  //lineColors: ['darkGreen','#0b62a4', '#167f39'], 
    sortkey: 'sort',
  customUnits: 'Activity',
  customLabel: false,
  parseTime: false, 
  //marginRight: 15,

//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};

if (!data_total){
    conversion_chart_options['ymax'] = '1';
    conversion_chart_options['ymin'] = '0';
}

console.log(conversion_chart_options);
  Morris.Line(conversion_chart_options);  

};

drawAnalyticsCharts();
    