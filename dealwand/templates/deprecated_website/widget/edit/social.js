$('a', '#social_options').live('click', function(){
   $(this).toggleClass('active'); 
   
   var social_options = $(this).parents('#social_options');
   s = '';
   social_options.find('a.active').each(function(){
       s += $(this).attr('id');
    });
    
    if (s)
        social_options.find('img:first').attr('src', '/static/images/social/' + s + '.png');
    
});