$('a', '#comments_type').live('click', function(){

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
});