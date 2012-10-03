function loadWidgetList(){
    console.log('loading widget list');
    $('.inner_page:visible').hide();
   // $('#intro_video:first').hide();
    $('#home_link:first').css({'opacity': .6});
    $('#widgets_list:first').html('<div style="padding:30px; font-size:30px; opacity:.6;">Loading....</div>').show();
    $.ajax({
      type: "POST",
      url: "/ajax/widget.list",
      data: {},
      success: function(response){
         console.log('received widgets list');
          $('#widgets_list:first').html($(response));
         },
       error: function(){

       },
       complete: function(){

       }
    });
        
    
};


$('.widget_item').live('click', function(){
   loadWidgetProfile($(this).attr('id'));
  
});