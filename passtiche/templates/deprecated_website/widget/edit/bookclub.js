

$('a','#bookclub_types').live('click', function(){
   $(this).siblings().removeClass('active').end().addClass('active'); 
});
// Below code is deprecated (for manually configuring with a list)

$('.add_book','#edit_bookclub').live('click', function(){
    console.log('clicked');
   var edit_bookclub = $(this).parents('#edit_bookclub:first');
   var new_val = edit_bookclub.find('#new_bookclub_book').val(); 
   if (!new_val) return;
   var new_html = '<li class="bookclub_book"><span class="book_name">' + new_val + '</span> &nbsp; <a class="close">&times;</a><div class="adjust"></div></li>';
   edit_bookclub.find('.bookclub_books').append(new_html);
   sortBookInit();
   
   edit_bookclub.find('#new_bookclub_book').val('');
   

    
});

$('select#my_books').live('change', function(){
   var selected_book = $(this).find('option[selected]:first');
   var new_val = selected_book.text();
      var new_html = '<li class="bookclub_book"><span class="book_name">' + new_val + '</span> &nbsp; <a class="close">&times;</a><div class="adjust"></div></li>';
   $(this).parents('#edit_bookclub:first').find('.bookclub_books').append(new_html);
   sortBookInit();
   $(this).find('option[selected]:first').attr('selected','').end().find('option:first').attr('selected','true');
    
});



$('a.close', '.bookclub_book').live('click', function(e){
   $(this).parents('.bookclub_book:first').hide('fast', function(){ $(this).remove(); }); 
    e.stopPropagation();
});