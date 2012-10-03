/*






 DEPRECATED 
 
 
 
 
 
 
 */

function renderBookAnalytics(){
    console.log('rendering book analytics');
var book_key =  $('#book_profile').find('.book_profile_inner:first').attr('id');     
var widget_data = [];
var widget_count =  $('#book_profile').find('#book_analytics_' + book_key +'_data:first').find('.widget').length;
var day_count =  $('#book_profile').find('#book_analytics_' + book_key +'_data:first').find('.widget:first').find('span').length

var alphabet = ['a','b','c','d','e','f','g','h'];
var widget_labels = [];
$('#book_profile').find('#book_analytics_' + book_key +'_data:first').find('.widget').each(function(){
   var widget_name = $(this).attr('name');
   widget_labels.push(widget_name); 
});


for (v=0;v<day_count;v=v+1)
{
    widget_day_data = { 'q':  
        $('#book_profile').find('#book_analytics_' + book_key +'_data:first').find('.widget:first').find('span:eq(' + v + ')').attr('_date')
     };
     $('#book_profile').find('#book_analytics_' + book_key +'_data:first').find('.widget').each(function(i,e){

        widget_day_data[alphabet[i]] = $(this).find('span:eq(' + v  + ')').attr('interactions');
   
    });
 
    widget_data.push(widget_day_data);

 }   

console.log('widget data', widget_data);
Morris.Line({
  element: 'book_analytics_' + book_key,
  data: widget_data,
  xkey: 'q',
  ykeys: alphabet.slice(0,widget_count),
  labels: widget_labels, 
//  lineColors: ['#0b62a4', '#167f39','darkred','olive','lime','darksalmon','navy','purple','maroon'].slice(0,widget_count),
  lineWidth: 2,
  dateFormat: function (x) { return x; }
});

}; // end renderBookAnalytics


// TODO: Refactor shared chart functionality to reduce redundance

$('a', '#book_chart_type:first').live('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('a', '#book_conversion:first').removeClass('active');
    
    var book_key = $(this).parents(".book_profile_inner:first").attr('id');
    var analytics_id = $(this).attr('id');
    loadBookAnalytics(book_key, analytics_id);
      
   
}); 

$('#conversion_preview_link').live('click', function(){
   $('#book_profile:first').find('.book_details_link:first').click();
    $('#book_profile:first').find('#book_conversion:first').find('a').click();
});


$('a', '#book_conversion:first').live('click', function(){
    $(this).addClass('active');    
    $('a', '#book_chart_type:first').removeClass('active');
    var book_key = $(this).parents(".book_profile_inner:first").attr('id');
    var analytics_id = $(this).attr('id');
    loadBookAnalytics(book_key, "conversion");
    
    
});


 
function loadBookAnalytics(book_key, analytics_id){
    
 
        $.ajax({
      type: "POST",
      url: "/ajax/book.analytics",
      data: {
          book: book_key,
          days: analytics_id,
      },
      success: function(response){
           $('#book_profile').find('#book_analytics_' + book_key +'_data:first').html($(response));
           renderBookAnalytics();
           
        },
       error: function(){

       },
       complete: function(){

       }
    });
       
};