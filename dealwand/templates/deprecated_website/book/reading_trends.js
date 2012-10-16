
$('#top_books_type').find('a').live('click', function(){
       $(this).siblings().removeClass('active');
    $(this).addClass('active');
    var top_books_type = $(this).attr('id');
    $('#top_books_wrapper').find('.top_books_list').hide(); 
     $('#top_books_wrapper').find('#top_books_' + top_books_type).show();
});