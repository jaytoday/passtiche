var custom_uploader;
var reward_uploader;

function setupUploaders(edit_form){

    
    if (edit_form.length < 1)
        return console.error('no visible editing form');
    console.log('setting up uploader');    
     // gallery
    if (edit_form.find('#custom_upload').length > 0){
        custom_uploader = new uploader(edit_form.find('#custom_upload').get(0), {
     			url:'/ajax/widget.upload',
     			multiple: true,
     			progress:function(ev){ console.log('progress', ((ev.loaded/ev.total)*100)+'%', ev); /* $p.css('width',$p.html()); */ },
     			error:function(ev){ console.log('error', ev);  },
     			success:function(response){ 
     			    console.log('file uploads', file_uploads);
     			    file_uploads -= 1;
     			    if (file_uploads) return;     			    
     			    $('#book_profile').html(LOADING_BOOK_HTML).show(); renderBookProfile(response); }
     		});
     console.log('completed setup for custom uploader', custom_uploader);
     } else custom_uploader = false;
     
    // reward
    if (edit_form.find('#reward_upload').length > 0){
        reward_uploader = new uploader(edit_form.find('#reward_upload').get(0), {
     			url:'/ajax/widget.upload',
     			multiple: true,
     			progress:function(ev){ console.log('progress', ((ev.loaded/ev.total)*100)+'%', ev); /* $p.css('width',$p.html()); */ },
     			error:function(ev){ console.log('error', ev);  },
     			success:function(response){ 
     			    console.log('file uploads', file_uploads);
     			    file_uploads -= 1;
     			    if (file_uploads) return;
     			    $('#book_profile').html(LOADING_BOOK_HTML).show(); renderBookProfile(response); }
     		});
     console.log('completed setup for reward uploader', reward_uploader);
     }else reward_uploader = false;
        
};

$('a', '#widget_plugin_type').live('click', function(){

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
});
    
    



$('a', '#widget_media_type').live('click', function(){

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
    var edit_widget_form = $(this).parents('.edit_widget_form:first');

    edit_widget_form.find('#choose_type:visible').hide();
    edit_widget_form.find('.widget_details:visible').hide();
    var widget_details = edit_widget_form.find('#widget_details_' + $(this).attr('id') + '_wrapper');
    widget_details.show();
    setupUploaders(widget_details);
    edit_widget_form.find('#widget_save_wrapper:hidden').show();
    var save_widget_btn = edit_widget_form.find('#save_widget:first');

});



// choose thumbnail
$('a', '#widget_icon_type').live('click', function(){

    $(this).siblings().removeClass('active');
    $(this).addClass('active');

});



$('#delete_widget').find('a').live('click', function(){
   
   if (!confirm('Are you sure you want to delete this widget?'))
        return false;

    var widget_id = $(this).parents('.edit_widget_form:first').attr('id');
    var book_page = $(this).parents('.book_profile_inner:first');
   $.ajax({
     type: "POST",
     url: "/ajax/widget.delete",
     data: {
            widget: widget_id
         },
     success: function(response){   
         
    },
      error: function(){

      },
      complete: function(){
          console.log(book_page.find('#book_nav').find('a[href=#w_' + widget_id + ']').length);
          book_page.find('#book_nav').find('a[href=#w_' + widget_id + ']').parent().remove();
          book_page.find('#book_nav').find('.audience_insights_link').tab('show');
          
      }
   });
   

           
    
});

$('.zocial', '.widget_frame').live('click', function(){
     return bootbox.dialog('This action initiates social sharing', {"label" : "Continue", "class" : "info"});       
});

$('#widget_theme').find('a').live('click', function(){
    console.log('clicked widget theme', $(this).attr('id'))
    $(this).siblings().removeClass('active');
    $(this).addClass('active'); 
    var widget_profile_inner = $(this).parents('.widget_tab:first');
    var widget_data = {
        'widget':  widget_profile_inner.attr('key'),
        'theme': $(this).attr('id')
    }
   $.ajax({
     type: "POST",
     url: "/ajax/widget.save",
     data: widget_data,
     success: function(response){
         widget_profile_inner.find('#widget_preview_inner:first').html($(response));
    },
    error: function(response){
        
    }, 
    complete: function(response){
        
    } 
    });
});

$('.advanced_options').find('a').live('click', function(){
   return bootbox.dialog('This feature is not available.', {"label" : "Continue", "class" : "error"});
	    
});     

  $('#auto_share').find('input').live('click', function(){
      console.log('clicked share')
     $(this).siblings().removeAttr('checked'); 
  });
  
// save widget
{% include "save.js" %}


function sortInit(){
    var mc_list = $('.mc_questions:visible');
    if (mc_list.length < 1)
        return;
    mc_list.dragsort("destroy");
    mc_list.dragsort({dragSelector: 'li .adjust'});
};

function sortBookInit(){
    var book_list = $('.bookclub_books');
    if (book_list.length < 1)
        return;
    book_list.dragsort("destroy");
    book_list.dragsort({dragSelector: 'li .adjust'});
};


// widget type specific 

{% include "edit/social.js" %}
{% include "edit/bookclub.js" %}
{% include "edit/media.js" %}
{% include "edit/comments.js" %}

{% comment "edit/gallery.js" %}
{% comment "edit/review.js" %}
{% comment "edit/reward.js" %}
{% comment "edit/video.js" %}



