
$('.pass_title').textfill(30);


//$('i', '.stats').tooltip();



// resect selected item on scroll
$('window').on('scroll', function(){
    $('.pass_item.selected').removeClass('selected');
});


// click on pass item - non-timed double click on mobile
$('.pass_item').find('.targ').on('click', function(){

    var pass_item = $(this).parents('.pass_item:first');

    if ($(this).hasClass('is_mobile')){
    
         if (!pass_item.hasClass('selected')){
             $('.pass_item.selected').removeClass('selected');
            return $(pass_item).addClass('selected');
        }
        
    $('.pass_item.selected').removeClass('selected');
    return pass_item.find('a:first').click();

    }

   pass_item.find('a:first').click();

});


