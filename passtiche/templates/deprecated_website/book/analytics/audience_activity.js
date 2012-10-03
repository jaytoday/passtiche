
function renderAudienceActivity(){
    
  // display purchase rate 
  setTimeout(function(){
     $('#book_profile').find('#percent_info_wrapper:first').find('input').each(function(){
    var percent_val = parseInt($(this).attr('value'));
    // TODO: base the 'health' of a statistic on relative performance of other books, not just raw %
    if (percent_val > 10)
	    var fg_color = 'rgb(0,' + (120 + percent_val) + ',20)'; // green
	else
	    var fg_color = 'rgb(' + (120 + (100 - percent_val)) + ',0, 20)'; // red
         
      $(this).attr('data-fgColor', fg_color).knob();
  });
  },50);

/* filtering */
$('#audience_filter').find('.btn').click(function(){
    if ($(this).hasClass('active'))
        return;
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    // get new HTML via ajax call 
    var filter_id = $(this).attr('id');

  console.log('loading book profile with new filter');
     $('#audience_filter').parent().parent().find('label:first').text('Loading...');          
       $.ajax({
      type: "POST",
      url: "/ajax/book.save",
      data: {
          book: $('.book_profile_inner:first').attr('id'),
          data_filter: filter_id,
          
      },
      success: function(response){
            $('#book_profile').html(LOADING_BOOK_HTML);
            renderBookProfile(response);
    
        }
    });
});


/* engagement details */
$('#engagement_collapse').collapse({
    toggle: false
}).click(function(){
    if ($(this).hasClass('active')){
        $(this).removeClass('active').find('#hide').hide().end().find('#show').show();
    }else{
        $(this).addClass('active').find('#show').hide().end().find('#hide').show();
    }
});

$('#chapter_details').tablesorter({ sortList: [[0,0]] });


/* annotations */



{% if False %}
/*


// ratings chart
$(function () {
    var values = [],
        labels = [];
    $('#ratings_chart_data').find("tr").each(function () {
        values.push(parseInt($("td", this).text(), 10));
        labels.push($("th", this).text());
    });
    Raphael("ratings_chart_holder", 100, 100).pieChart(50, 50, 50, values, labels, "#fff");
});
// end ratings chart

    Progress Chart is deprecated
  
  // display distribution of progress through book
  var progress_data = [];
  var progress_total = 0;
  audience_insights_wrapper.find('#progress_chart_' + book_key + '_data:first').find('span').each(function(){
     var progress = parseInt($(this).text());
     progress_total += progress;
     progress_data.push({
        '%': $(this).attr('range'),
        'progress': progress
     }); 
  });
  

  var progress_chart_options = {
  element: 'progress_chart_' + book_key,
  data: progress_data,
  xkey: '%',
  ykeys: ['progress'],
  labels: ['Readers'],
  customUnits: 'Progress',
  parseTime: false, 
  marginRight: 15,
//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
};


if (!progress_total){
    progress_chart_options['ymax'] = '1';
    progress_chart_options['ymin'] = '0';
}

  Morris.Line(progress_chart_options);  
    
*/
{% end %}

};