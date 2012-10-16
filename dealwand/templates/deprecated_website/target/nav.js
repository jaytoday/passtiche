
$('a#create_link').live('click', function(){
    // deprecated 
    $('.inner_page:visible').hide();
   // $('#intro_video:first').hide();

});


$('#learn_more').on('click', function(){
   $(this).hide();
   $('#more_section').show('fast', function(){  document.getElementById('more_section').scrollIntoView(); }); 
  
});

$('a#home_link').live('click', function(){
    $('.inner_page:visible').hide();
    $('#inner_index:first').show();
   // $('#intro_video:first').show();
    $('#home_link:first').css({'opacity': 0});

     window.location.hash = '#';
    resetLandingPage();
});

$('#inner_index:first').on('hide',function(){
$('#home_link:first').css({'opacity': .6});
});

$('#page_nav:first').find('.nav').find('a').on('click', function(){
    $('#page_nav:first').find('.btn-navbar:visible').click();
});

