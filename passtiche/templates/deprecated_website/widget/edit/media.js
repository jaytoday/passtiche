$('.media_options').find('.btn').live('click', function(){
     
    if ($(this).hasClass('active') && $(this).attr('id') != "media_options")
    {
     $(this).removeClass('active');
     return $(this).parents('.control-group:first').find('.media_panels').find('.panel:visible').hide();
    }
    
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
   console.log('selected panel', $(this).parents('.control-group:first').find('.media_panels').find('#' + $(this).attr('id') + ':first'));
   $(this).parents('.control-group:first').find('.media_panels').find('#' + $(this).attr('id') + ':first')
   .siblings().hide().end().show();
   
  if ($(this).attr('upload'))
    setupUploaders($(this).parents('.edit_widget_form:first'));
});



$('#twitter_feed_type').find('.btn').live('click', function(){
    
    if ($(this).hasClass('active')) return;
     if ($(this).attr('id') == 'custom_social_media')
        return bootbox.dialog('More social media options are on their way...', {"label" : "Continue", "class" : "error"});  
                
     
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
     var twitter_feed_controls = $(this).parents('#twitter_feed_type:first').parent().find('#twitter_feed_controls:first');
     
     twitter_feed_controls.find('.controls:visible').hide().end().find('#' + $(this).attr('id')).show().find('input').val('');
});

$('#twitter_feed_controls').find('input').live('keydown', function(){
   // temporarily disabled
   // $(this).parents('#twitter_feed_controls:first').find('#preview_btn').show();
});

$('#twitter_feed_controls').find('#preview_btn').live('click', function(){
    $(this).hide();
    var edit_widget_form = $(this).parents('.panel:first');
    var preview_data = {
        'feed_type': 'twitter',
        'twitter_feed_type': edit_widget_form.find('#twitter_feed_type:first').find('.active:first').attr('id'),
        'feed_search': edit_widget_form.find('#widget_feed_search:visible').val(),
        'widget_wrapper_id': 'twitter_preview_wrapper_' + edit_widget_form.attr('twitter_id')
    };
       
   $.ajax({
     type: "POST",
     url: "/ajax/widget.feed_preview",
     data: preview_data,
     success: function(response){
         console.log('creating twitter preview');
         edit_widget_form.find('#twitter_script_wrapper:first').html($(response));
        
    },
      error: function(){

      },
      complete: function(){
    
      }
   });
   
         
});

