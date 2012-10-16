$('#save_widget').live('click', function(){
   
   console.log('starting save');
   
   var save_widget_btn = $(this);
   edit_widget_form = $(this).parents('.edit_widget_form:first');
   var widget_name = edit_widget_form.find('input#widget_name:visible').val();
   
   var widget_media_type = edit_widget_form.attr('media_type');
  if (!widget_media_type)
        widget_media_type =  edit_widget_form.find('#widget_media_type').find('a.active:first').attr('id');
   
    var widget_details = edit_widget_form.find('#widget_details_' + widget_media_type + '_wrapper:first');

   
   // TODO: do checks for each widget type. And auto-generate name on server if not sent. 
   
   
   var widget_data = {};
   
   widget_data['book'] = edit_widget_form.parents('.book_profile_inner:first').attr('id')   
   if (widget_name)
        widget_data['name'] = widget_name;
   
    widget_data['media_type'] = 'bookclub';//widget_media_type;
    
    if (edit_widget_form.find('#widget_plugin_type').find('a.active:first').length > 0)
        widget_data['plugin_type'] = edit_widget_form.find('#widget_plugin_type').find('a.active:first').attr('id');
      
    if (widget_details.find('#media_options').find('a.active:first').length > 0)
        widget_data['media_option'] = widget_details.find('#media_options').find('a.active:first').attr('id');
    if (widget_details.find('#reward_media_options').find('a.active:first').length > 0)
        widget_data['reward_media_option'] = widget_details.find('#reward_media_options').find('a.active:first').attr('id');
                
        
   if (edit_widget_form.find('input#widget_key').length > 0)
        widget_data['widget'] = edit_widget_form.find('input#widget_key').val();

    
   if (widget_media_type == "social"){
       widget_data['social_options'] = [];
       edit_widget_form.find('#social_options:first').find('a.active').each(function(){
            widget_data['social_options'].push($(this).attr('id'));
        });
        if (widget_data['social_options'].length == 0)
                return bootbox.dialog('You must enable at least one social option', {"label" : "Continue", "class" : "error"});  
            
     }
     
    
     
   if (widget_media_type == 'bookclub'){
                
                   
        widget_data['book_filter'] = edit_widget_form.find('#book_filter:first').find('a.active:first').attr('id'); 
        
                   /* widget_data['bookclub_books'] = ['my book'];
                    temporarily disabled 
                   edit_widget_form.find('.bookclub_book').each(function(i, el){
                          widget_data['bookclub_books'].push($(this).find('.book_name:first').text());
                   });
                   
                   if (widget_data['bookclub_books'].length < 1)
                      return bootbox.dialog('At least one book is required', {"label" : "Continue", "class" : "error"}); 
                    */
    }
    
        
    

       // for both media and rewards
       media_error = false;
       $.each(['','reward_'], function(i,v){
        if (media_error) return;
           
        var media_option = widget_details.find('#' + v + 'media_options').find('a.active:first').attr('id');
        if (media_option)
            widget_data[v + 'media_option'] = media_option;
        else if (v == '' && widget_media_type == 'media')
        {
                bootbox.dialog('You forgot to select a media option', {"label" : "Continue", "class" : "error"});  
                media_error = true;
                return;
            }
            
            
       // Video Audio 
       if (widget_details.find('#' + v + 'video_url').val())
            widget_data[v + 'video_url'] = widget_details.find('#' + v + 'video_url').val();
        
        if (!widget_data[v + 'video_url'] && widget_details.find('#' + v + 'media_options').find('a.active:first').attr('id') == 'video')
            {
               widget_data[v + 'media_option'] = '';
                bootbox.dialog('A YouTube URL is required', {"label" : "Continue", "class" : "error"});  
                media_error = true;
                return;
            }
            
            if (widget_data[v + 'media_option'] == 'custom'){
                if (v){
                     this_uploader = reward_uploader;
                }else{ this_uploader = custom_uploader; }
                
                if (this_uploader && this_uploader.input.files.length < 1){
                   widget_data[v + 'media_option'] = '';
                    bootbox.dialog('Did you forget to upload your file?', {"label" : "Continue", "class" : "error"});        
                    media_error = true;
                    return;
                }
            }; // end custom
            
            if (widget_data[v + 'media_option'] == 'comments'){
            }
            
          if (widget_data[v + 'media_option'] == 'feed'){
            // TODO: right now this only works for Twitter
        
            widget_data['feed_type'] = 'twitter';//edit_widget_form.find('#feed_type:first').find('.active:first').attr('id');
            widget_data['feed_search'] = edit_widget_form.find('#widget_feed_search:visible').val();
            if (!widget_data['feed_search']){
                   widget_data[v + 'media_option'] = '';
                    media_error = true;
                    return bootbox.dialog('A profile handle or search keyword is required', {"label" : "Continue", "class" : "error"});  
                
                }
                
       widget_data['twitter_feed_type'] = edit_widget_form.find('#twitter_feed_type:visible').find('.active:first').attr('id');
      } // end twitter media
     
        
        
                    
           }); // end media/rewardMedia loop  
           
           if (media_error) return console.log('media error');       
    
    /* THIS IS WHERE OTHER WIDGET TYPES ARE */
    {% comment "dep_save.js" %}
                
   var thumbnail = edit_widget_form.find('#widget_icon_type:visible').find('.active:first').attr('id');
   if (thumbnail)
        widget_data['thumbnail'] = thumbnail;
   
   
   $(this).button('loading');
   
   save_widget_btn.button('loading');
   
   $.ajax({
     type: "POST",
     url: "/ajax/widget.save",
     data: widget_data,
     success: function(response){
         
         file_uploads = 0; 
         save_widget_btn.button('reset');        
         if (!widget_data['widget'])
            widget_data['widget'] = $(response).find('.book_widget_link.activate:first').attr('key');
         
         
         $('#list_link_wrapper:first').show();
        if (custom_uploader){
            custom_uploader.settings.form_data = [['widget', widget_data['widget']], ['custom', true]]
            // now upload files if necessary
            console.log('CUSTOM', custom_uploader.input.files.length);
            if (custom_uploader.input.files.length > 0){
                file_uploads += 1;
                custom_uploader.send();
                console.log('sent custom upload');
                return;
         } 
     }
         
         console.log(reward_uploader);
         
         if (reward_uploader){
            reward_uploader.settings.form_data = [['widget', widget_data['widget']], ['reward', true]]; 
            // now upload files if necessary
            console.log('REWARD', reward_uploader.input.files.length);
            if (reward_uploader.input.files.length > 0){
                file_uploads += 1;
                reward_uploader.send();
                console.log('sent reward upload');
                return;
                
            }
                        

         }          
    

    $('#book_profile').html(LOADING_BOOK_HTML).show();
    return renderBookProfile(response);        
         
    },
      error: function(){
          save_widget_btn.button('reset');

      },
      complete: function(){
    
      }
   });
   
   mixpanel.track('Saving Widget', {
   'user_agent': '{{ user_agent }}'
});
   
});