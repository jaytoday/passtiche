LOADING_RELATED_BOOKS_HTML = '<div class="loading_book" style="padding:30px; font-size:30px; opacity:.6;"><i class="icon-download-alt"></i> Loading...</div>';

$('#book_profile').find('.related_books').find('tbody').find('tr')
.live('click', function(){
   
   if ($(this).hasClass('active')) return;
   related_books = $(this).parents('#related_books:first');
   $(this).siblings().removeClass('active').end().addClass('active'); 
   
   related_books.find('#related_book_details:first').html(LOADING_RELATED_BOOKS_HTML);
       $.ajax({
      type: "POST",
      url: "/ajax/book.details",
      data: {
          ibook: $(this).attr('id')
      },
      success: function(response){
          related_books.find('#related_book_details:first').html($(response));
          
          // TODO: better solution than just renaming variables
          book_key = related_books.find('.book_key:first').attr('id');     
          audience_insights_wrapper = $('#book_profile').find('#related_book_details:first');
          console.log('key', book_key);
          console.log('wrapper', audience_insights_wrapper);
          renderAudienceActivity();
          renderAudienceDemographics();

          
      },
       error: function(){

       },
       complete: function(){

       }
    });
    
    
});