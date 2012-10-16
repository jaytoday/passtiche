$('#mybooks_link').live('click', loadMyBooks);

$('#newbook_link').live('click', loadNewBook);

$(function(){
    Stripe.setPublishableKey('{{ stripe_key }}');
});

function loadMyBooks(){
    
    console.log('loading my books');
    $('.inner_page:visible').hide();
   // $('#intro_video:first').hide();
    $('#home_link:first').css({'opacity': .6});
    $('#mybooks:first').find('#book_list_wrapper:first').html('<div id="loading_text" style="padding:30px; font-size:30px; opacity:.6;"><i class="icon-download-alt"></i> Loading...</div>').end().show();
    $.ajax({
      type: "POST",
      url: "/ajax/book.list",
      data: {},
      success: function(response){
          console.log('got response')
          if ($(response).find('.book_item:first').length < 1){
            $('#cancel_newbook').hide();
            return $('#newbook_link').click();
            
          }
          $('#mybooks:first').find('#book_list_wrapper:first').html($(response));
          
          console.log('rendering');
          renderMyBooks();

         },
       error: function(){

       },
       complete: function(){

       }
    });
    
    mixpanel.track('Loading Book List', {
   'user_agent': '{{ user_agent }}'
});

    
}; // end loadMyBooks

function renderMyBooks(){
    
         /*
         $('#mybooks:first').find('.view_sparkline').each(function(){
             
              
         $(this).sparkline({
             attributes: {
                 stroke: '#a7a7a7',
                 'stroke-width': 3,
                 'opacity': .1,
                 'fill-opacity': .1,
                 'stroke-linecap': 'round',
                 'stroke-linejoin': 'miter'
             }
         });
        

     });  */
     
window.location.hash = '#mybooks';

} // end renderMyBooks


$('.book_item').live('click', function(){
    $('#mybooks_link').parent().removeClass('active');
   loadBookProfile($(this).attr('id'));
  
});


function loadNewBook(){
    $('#mybooks_link').parent().removeClass('active');
    $('.inner_page:visible').hide();
  // $('#intro_video:first').hide();
    $('#home_link:first').css({'opacity': .6});
    
    
    $(':input','#newbook')
     .not(':button, :submit, :reset')
     .val('')
     .removeAttr('checked')
     .removeAttr('selected');
     
     $('a#unpublished', '#newbook').click();
         
    $('#newbook:first').show();
   window.location.hash = '#newbook';
    
       mixpanel.track('Loading New Book', {
   'user_agent': '{{ user_agent }}'
});
    
    
}; // end loadMyBooks

$('#book_status').find('a').live('click', function(){
   $(this).siblings().removeClass('active').end().addClass('active'); 
   var book_form = $(this).parents('.edit_book:first');
   if ($(this).attr('id') == 'published')   
            book_form.find('#book_platforms_control').show();
            //book_form.find('#example_data_control').hide();
    else 
        book_form.find('#book_platforms_control').hide();
});


$('#book_platforms').find('a').live('click', function(){
   if ($(this).hasClass('active'))
        $(this).removeClass('active');
   else
        $(this).addClass('active'); 
});

$('#disable_example_data').live('click', function(){
    $(this).text('Loading...');
    $('#example_data').find('#disabled').click();
    $('#save_book').click();
});
$('#enable_example_data').live('click', function(){
    $(this).text('Loading...');
    $('#example_data').find('#enabled').click();
    $('#save_book').click();
});

$('#example_data').find('a').live('click', function(){
   $(this).siblings().removeClass('active').end().addClass('active'); 
});

$('#cancel_newbook').on('click', function(){
      if ($('#mybooks:first').find('#loading_text').length > 0)
        return loadMyBooks();
     $('.inner_page:visible').hide();
     $('#mybooks:first').show();
});


// typeahead for book name search
$('input#book_name').live('keydown', function(){
    
    var book_form = $(this).parents('.edit_book:first');
    var published_status = book_form.find('#book_status:first').find('a.active:first').attr('id'); 
    if (published_status == "published"){
        if ($(this).hasClass('typeahead')) return;
        book_name_input = $(this);
        $(this).addClass('typeahead').typeahead({
    source: function(typeahead, query){
      $.get('ajax/ibooks.search', {'query': query}, function(data){
          typeahead.process(data['results']);
    }, 'json');
    },  
         onselect: function(obj) { 
           book_name_input.attr('ibook_id', obj['id']);  
           book_name_input.parents('.edit_book:first').find('#save_book:first').click();
           
           
              },
         property: "short_title" // TODO: show publisher in parens but not in input
    });
    
    }else{
        if (!$(this).hasClass('typeahead')) return;
            $(this).removeClass('typeahead').typeahead('destroy');
    }
    
});

$('#save_book').live('click', function(){
        var save_book_btn = $(this);
        save_book_btn.button('loading');
        var book_form = $(this).parents('.edit_book:first');
        var book_data = {};
        
        $('.typeahead:visible').hide();
        
        book_data['name'] = book_form.find('#book_name:first').val(); 
        book_data['published'] = book_form.find('#book_status:first').find('a.active:first').attr('id'); 
        if (book_form.find('#example_data:first').find('a.active:first').attr('id') == 'enabled')
            book_data['example_data'] = true; 
        if (book_form.find('#example_data:first').find('a.active:first').attr('id') == 'enabled2')
            book_data['example_data2'] = true; 
        if (book_form.find('#example_data:first').find('a.active:first').attr('id') == 'enabled3')
            book_data['example_data3'] = true;                               
        
        
        book_data['platforms'] = [];
        book_form.find('#book_platforms:first').find('a.active').each(function(){
            book_data['platforms'].push($(this).attr('id'));
        });
            
        
        var ibook_id = book_form.find('#book_name:first').attr('ibook_id');
        if (book_data['published'] && ibook_id)
            book_data['ibook_id'] = ibook_id;
        
        if (book_form.find('#book_description:first').val())
            book_data['description'] = book_form.find('#book_description:first').val();
        
        if (book_form.attr('id'))
            book_data['book'] = book_form.attr('id');

        if (book_form.find('#book_url:first').val())
            book_data['url'] = book_form.find('#book_url:first').val();

        if (book_form.find('#fb_url:first').val()){
            if (book_form.find('#fb_url:first').val().indexOf('pages/') < 0)
                return bootbox.dialog('Use the version of your Facebook Page URL that contains "/pages/"', {"label" : "Continue", "class" : "error"});         
            book_data['fb_url'] = book_form.find('#fb_url:first').val();
        }
        

        if (book_form.find('#twitter').val())
              book_data['twitter'] = book_form.find('#twitter:first').val(); 
                        
                        
       $.ajax({
      type: "POST",
      url: "/ajax/book.save",
      data: book_data,
      success: function(response){
            save_book_btn.button('reset');
            $('#site_nav').find('#newbook_link:first').parent().remove();
            $('#site_nav').find('#mybooks_link:first').parent().show();
            if (book_thumbnail_uploader && book_thumbnail_uploader.input.files.length > 0){
                book_thumbnail_uploader.settings.form_data = [['book', book_data['book']]];
                return book_thumbnail_uploader.send();
            }
            $('#book_profile').html(LOADING_BOOK_HTML);
            renderBookProfile(response);
            $('#cancel_newbook').show();
                          

         },
       error: function(){
            save_book_btn.button('reset');
       },
       complete: function(){

       }
    });
    
mixpanel.track('Saving Book', {
   'user_agent': '{{ user_agent }}'
});
  
});


$('#delete_book').live('click', function(){
   
   if (!confirm('Are you sure you want to delete this book?'))
        return false;
    var delete_book_btn = $(this);
    delete_book_btn.button('loading');
    var book_id = $(this).parents('.edit_book').attr('id');
   $.ajax({
     type: "POST",
     url: "/ajax/book.delete",
     data: {
            book: book_id
         },
     success: function(response){   
         
    },
      error: function(){
            delete_book_btn.button('reset');
      },
      complete: function(){
           return loadMyBooks();
      }
   });
           
    
});


