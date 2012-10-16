
$('#view_pricing').on('click', function(){
    
    $('.inner_page:visible').hide();
    $('#home_link:first').css({'opacity': .6});
   // $('#intro_video:first').hide();
   $('#pricing_page').show();
});

$('#pricing_page').find('#billing_signup').on('click', function(){
        return bootbox.dialog('You need an invite to access this feature!', {"label" : "Continue", "class" : "error"});    
});
