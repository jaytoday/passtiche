LOADING_BOOK_HTML = '<div class="loading_book" style="padding:30px; font-size:30px; opacity:.6;"><i class="icon-download-alt"></i> Loading....</div>';



$('#highlight_social').find('a').live('click', function(){
    
    return bootbox.dialog('This feature is not available for demo accounts', {"label" : "Continue", "class" : "error"});  
       
});

  

function loadBookProfile(book_id){
    console.log('loading book profile');
    $('.inner_page:visible').hide();
    $('#book_profile').html(LOADING_BOOK_HTML).show();
    $.ajax({
      type: "POST",
      url: "/ajax/book.profile",
      data: {
          book: book_id,
          paid: '{{ handler.get_argument("paid","") }}'
      },
      success: renderBookProfile,
       error: function(){

       },
       complete: function(){

       }
    });
        
};

$('#book_profile').find('#upload_doc').live('click', function(){
   
    // filepicker
    filepicker.setKey('A9ZifjNDQSi6_BxrkqfCFz');

    filepicker.getFile(filepicker.MIMETYPES.ALL, {'modal': true, 'persist': true},
        function(file_url, metadata){
            $('#book_profile').find('#uploaded_docs').append('<div class="doc"><b>' 
            + metadata.filename + '</b>&nbsp; <a href="' + file_url + '" class="btn">Download</a></div>');
            
             
          $.ajax({
              type: "POST",
              url: "/ajax/book.doc_upload",
              data: {
                  book:  $('#book_profile').children(':first').attr('id'),
                  url: file_url,
                  filename: metadata.filename
              },
              success: function(){

               },
               error: function(){

               },
               complete: function(){

               }
            });
    
        }
    );   
    
});
    

$('#book_profile').find('#current_reader_wrapper').find('a.close').live('click', function(){
    $(this).hide('fast');
});

$('#book_profile').find('#book_nav').find('a.book_title_link').live('click', function(event){
      event.stopPropagation();
    return false;
});

// navigation within analytics tab
$('#book_profile').find('#book_nav').find('a').live('click', function(event){
    var section = $(this).attr('section');
    if (section)
        $('#book_profile').find('#analytics_pane').siblings().removeClass('active').end().addClass('active').find('.tab-panel').removeClass('active').end()
                                                  .find('#' + section + '.tab-panel').addClass('active');
});


function bookChannelCallback(evt) {
console.log(evt);
// TODO: wtf
var viewer_data = $.parseJSON($.parseJSON(evt.data));
console.log('viewer data', viewer_data);
updateActivity(viewer_data);

};

function updateActivity(data){
    $('#book_profile').find('#activity_details:first').fadeOut('fast', function(){
        $(this).parent().html(data.activity).fadeIn('fast');
    });  
};
    
function updateReader(widget_name, widget_key, reading_history){
    console.log('updating reader');
    console.log( $('#book_profile').find('#current_reader_wrapper'));
 $('#book_profile').find('#current_reader_wrapper').show('fast')
.find('#current_readers').html('<li style="margin-left:10px;">Reader now viewing <a tab="#w_' + widget_key + '" style="font-weight:bold;cursor:pointer;text-decoration:underline;font-size:1.2em;">' 
    + widget_name + '</a>&nbsp;<a class="close iconic x_alt"></a></li><div style="font-size:.6em;">' + reading_history + '</div>');   
};

 $('#book_profile').find('#current_reader_wrapper').find('a').live('click', function(){
     if (!$(this).attr('tab')) return;
    console.log($('#book_nav_list:first').find('a[href=' + $(this).attr('tab') + ']'));
    $('#book_nav_list:first').find('a[href=' + $(this).attr('tab') + ']').click(); 
 });
 

function renderBookProfile(response, opts){ 
        console.log($('#book_profile').children(':first').hasClass('loading_book'), 'adding book profile html')
        if ($('#book_profile').children(':first').hasClass('loading_book'))
            $('#book_profile').hide().html($(response));
          $('.inner_page:visible').hide();
          //if (!(opts && opts['hide_profile']))
            $('#book_profile').show();
            
            /*setTimeout(function(){
               $('#book_profile').find('.tab-panel:first').show('slow'); 
            }, 250);*/

          //startChannel($('#book_profile').find('.book_profile_inner:first').attr('token'), bookChannelCallback);
          
          renderBookAnalytics();
          //renderWidgets();
          setupBookUploaders();
          iBookSearchInit();
          
          $('#mybooks_link:first').show();

          if ($('#book_profile').data('callback')){
              $('#book_profile').data('callback')();
              $('#book_profile').data('callback',false);          

          };
          
          window.location.hash = '#book/' + $('#book_profile').find('.book_profile_inner:first').attr('id');
          
          $('#book_nav').find('ul:first').show();   
          if ($('#book_nav_list').find('a.activate:first').length > 0)
            return $('#book_nav_list').find('a.activate:first').removeClass('activate').tab('show').click();
          else
          return $('#book_nav').find('a.bl:first').tab('show').click();

       

                  
} // end render Book Profile

{% include "ibook_search.js" %}
{% include "analytics/analytics.js" %}
{% include "reading_trends.js" %}
{% include "marketing_lab.js" %}

$('#new_widget_btn').live('click', function(){
    
    console.log('new widget');
     $('#book_nav:first').find('#new_widget_link').click();
    $('#book_nav:first').find('ul:first').hide();
    $('#save_widget', '#new.edit_form').click();
    //setTimeout(resetNewWidget, 500);
});

$('#download_widget').live('click', function(){
  mixpanel.track('Download Widget', {
	           'user_agent': '{{ user_agent }}',
	           'user': '{{ current_user.key().name() }}',
	           'book': $(this).parents('.book_profile_inner:first').attr('id')
	        });    
    
}); 

// Navigate widget types

$('a', '#widget_book_type').live('click', function(){
   $(this).addClass('active').siblings().removeClass('active');
   console.log($(this).parents('.widget_profile_inner:first').find('#book_types'),
   $(this).parents('.widget_profile_inner:first').find('#book_types')
   .find('#' + $(this).attr('id'))
   )
   $(this).parents('.widget_profile_inner:first').find('#book_types')
   .find('#' + $(this).attr('id')).show().siblings().hide();
});


function resetNewWidget(){
    
    //$('#mybooks_link:first').hide();
      console.log('reset new widget');
    $('#new_widget').show().find('#widget_media_type').find('.active').removeClass('active');
    $('#new_widget').find('.fill_in_preview_wrapper:first').hide();
    $('#new_widget').find('#mc_correct_intro').hide();
    $('#new_widget').find('#mc_intro').fadeIn();
    
    $('#new_widget').find('#widget_save_wrapper:first').hide();
    $('#new_widget').find('.widget_details:visible').hide();
    $('#new_widget').find('#widget_media_type').find('a:first').click();

    $('#new_widget').find('#twitter_preview_wrapper_new').html('');

    
    $(':input','#new_widget')
     .not(':button, :submit, :reset')
     .val('')
     .removeAttr('checked')
     .removeAttr('selected');
     
     $('textarea','#new_widget').val('');
     
     $('#new_widget').find('.mc_questions').html('');
     $('#new_widget').find('#review_type').find('a:first').click();
     $('#new_widget').find('#create_intro').fadeIn();

    
           
};

         

$('#cancel_new_widget').live('click', function(){
    console.log('cancelling',  $('#book_nav:first').find('ul:first').show().end().find('li.bl:first'));
    $('#book_nav:first').find('ul:first').show().end().find('li.bl:first').find('a').click();
    $('#mybooks_link:first').show();
});

if ($('#book_profile').children(':first').hasClass('book_profile_inner')){
    // render profile and index.js procedure will show it if there is no url frag
    // this is because url fragment isn't sent to server
    $('#book_profile').hide();
    
   renderBookProfile($('#book_profile').html(), {'hide_profile':true});
 
}
    
$('#book_profile').find('.book_widget_link').live('click', function(){
    
  
  if (!$(this).hasClass('paid')) 
 {
$(this).parent().removeClass('active');
if ($(this).hasClass('preview'))
        return bootbox.dialog('This feature is not available for demo accounts', {"label" : "Continue", "class" : "error"});  
   $('#paymentModal').find('#analytics_payment').show().end()
                                 .modal({'show': true});
     
    return;
 }
   window.location.hash = '#book/' 
   + $(this).parents('.book_profile_inner:first').attr('id') 
   + '/' + $(this).attr('href');
});    

    
$('#book_profile').find('a.book_link').live('click', function(){
    window.location.hash = '#book/' + $(this).parents('.book_profile_inner:first').attr('id');
});    

     $('#book_profile').find('#book_title_wrapper').live('click', function(){
       
         $('#book_profile').find('#book_nav_list:first').find('li.active').removeClass('active');
           $(this).addClass('active');
           $('#book_profile_content').find('.book_pane.active').removeClass('active');
            $('#book_profile_content').find('#book_details:first').addClass('active')
    });
                 
$('#book_profile').find('#book_nav_list:first').find('li').live('click', function(){
    
$('#book_profile').find('#book_title_wrapper:first').removeClass('active');
    
  setTimeout(function(){
      return;
      // TODO: this is very inefficient!
      setupUploaders($('#book_profile').find('.tab-pane:visible').find('.edit_form:first'));
            // initialize preview
         $('#book_profile').find('.tab-pane:visible').find('.carousel').each(function(){
           $(this).carousel().carousel('pause')
         .data('carousel').cycle = function(){ return false; };
     });
   }, 300);
});    


$('.widget_link_html').live('focus', function() {
    var $this = $(this);

    $this.select();

    window.setTimeout(function() {
        $this.select();
    }, 1);

    // Work around WebKit's little problem
    $this.mouseup(function() {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
});


book_thumbnail_uploader = false;

function setupBookUploaders(){

    
    // thumbnail
    if ($('#book_profile').find('#book_thumbnail_upload:first').length > 0){
        book_thumbnail_uploader = new uploader($('#book_profile').find('#book_thumbnail_upload:first').get(0), {
     			url:'/ajax/book.image_upload',
     			multiple: true,
     			progress:function(ev){ console.log('progress', ((ev.loaded/ev.total)*100)+'%', ev); /* $p.css('width',$p.html()); */ },
     			error:function(ev){ console.log('error', ev);  },
     			success:function(response){ $('#book_profile').html(LOADING_BOOK_HTML).show(); renderBookProfile(response); }
     		});
     console.log('completed setup for book thumbnail uploader', book_thumbnail_uploader);
     }else book_thumbnail_uploader = false;
        
};




$(".marketing_lab_link").live('click', function(e){
 
    /*
      bootbox.dialog('This feature is not available for demo accounts', {"label" : "Continue", "class" : "error"});  
        return false;
        */
        
        
 });    
       
$("#save_book_upload").live('click', function(){
      return bootbox.dialog('This feature is not available for demo accounts', {"label" : "Continue", "class" : "error"});  
       
       
   $(this).button('loading');
   setTimeout(function(){ $("#save_book_upload").button('reset'); 
   
    return bootbox.dialog('This book could not be recognized. Contact us at support@hiptype.com', {"label" : "Continue", "class" : "error"});  
            
            
    }, 1500);
});

    
