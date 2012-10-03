
                      
   if (widget_media_type == 'review'){
       
           var form_fields = [];
       
           // TODO: this needs to be refactored for multiple items
           var review_item = edit_widget_form.find('.review_item:first');
           var review_type = review_item.find('.active:first').attr('id');
       
           var form_field = {};
           form_field['type'] = review_type;
       
           if (review_type == 'multiple_choice'){
                   form_field['prompt'] = review_item.find('.mc_prompt:first').val();
                   if (!form_field['prompt'])
                      return bootbox.dialog('a multiple choice prompt is required', {"label" : "Continue", "class" : "error"}); 
           
                   form_field['options'] = [];
                   review_item.find('.mc_question').each(function(i, el){
                          form_field['options'].push($(this).find('.mc_value:first').text());
                          if ( $(this).find('input:checked').length > 0 ){
                              form_field['answer'] = i;
                           };
                   });
                   if (form_field['options'].length < 2)
                      return bootbox.dialog('more multiple choice options are required', {"label" : "Continue", "class" : "error"}); 
           
                   console.log(form_field);
                   if (form_field['answer'] == undefined)
                        return bootbox.dialog('a correct answer is required', {"label" : "Continue", "class" : "error"}); 
           
           }
           if (review_type == 'fill_in'){
               form_field['value'] = edit_widget_form.find('#fill_in_value').val();
               form_field['answers'] = Array();
               var return_error = false;
               edit_widget_form.find('.fill_in_section').each(function(){
                   if (!$(this).text())
                       return_error = true;
                    form_field['answers'].push($(this).text());
               });
               if (return_error)
                 return bootbox.dialog('Fill each blank box with a correct answer', {"label" : "Continue", "class" : "error"});  
                
           
           }       
           if (review_type == 'short_answer'){
               form_field['value'] = edit_widget_form.find('#short_answer_value').val();
           }
       
           form_fields.push(form_field); // TODO: do this for each review field
       
           widget_data['form_fields'] = JSON.stringify(form_fields); 
              
   } // end review 
   
   if (widget_media_type == 'feed'){
       // TODO: right now this only works for Twitter
       widget_data['feed_type'] = edit_widget_form.find('#feed_type:first').find('.active:first').attr('id');
       widget_data['feed_search'] = edit_widget_form.find('#widget_feed_search:visible').val();
       if (!widget_data['feed_search'])
         return bootbox.dialog('A search keyword is required', {"label" : "Continue", "class" : "error"});  
                
       widget_data['twitter_feed_type'] = edit_widget_form.find('#twitter_feed_type:first').find('.active:first').attr('id');
       
   }
   
      if (widget_media_type == 'reward'){
       
       widget_data['reward_action'] = edit_widget_form.find('#reward_action:first').find('.active:first').attr('id');
       if (widget_data['reward_action'] == "social"){
               widget_data['quote'] = edit_widget_form.find('#widget_details_reward_wrapper').find('#quote_value:first').val();
               if (edit_widget_form.find('#widget_details_reward_wrapper').find('#twitter_share:checked').length > 0)
                widget_data['twitter_share'] = true;
               if (edit_widget_form.find('#widget_details_reward_wrapper').find('#facebook_share:checked').length > 0)
                widget_data['facebook_share'] = true;
    }
    
    widget_data['reward_type'] = edit_widget_form.find('#reward_type:first').find('.active:first').attr('id');
       
                
     
   } // end reward
   
      if (widget_media_type == 'video'){
       
       widget_data['video_url'] = edit_widget_form.find('#video_url:first').val();
     
   }
   
            
     if (widget_media_type == 'gallery' && gallery_uploader){
        if (gallery_uploader.input.files.length < 1)
          return bootbox.dialog('You must upload at least one image for your gallery.', {"label" : "Continue", "class" : "error"});  
                
    }