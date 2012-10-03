$('#account_link').on('click', function(){

    $('.inner_page:visible').addClass('prev').hide();
    $('.inner_page#account').find('#account_page_wrapper').html('<div id="loading_text" style="padding:30px; font-size:30px; opacity:.6;"><i class="icon-download-alt"></i> Loading....</div>');
           
    $('.inner_page#account').show();
    
             $.ajax({
              type: "POST",
              url: "/ajax/account.page",
              data: {  },
              success: function(response){
                  $('#account_page_wrapper').html(response);
              }
          });
                  
});

$('.inner_page#account').find('#account_back').live('click', function(){
    $('#account_link').parent().removeClass('active');
    $('.inner_page#account').hide();
    $('.inner_page.prev').show().removeClass('prev');
});

$('.inner_page#account').find('#invite_user').live('click', function(){

var invite_email = $('.inner_page#account').find('#invite_user_email').val();

 if (!invite_email)
    return bootbox.dialog('An email is required', {"label" : "Continue", "class" : "error"});         
           
           
    $('.inner_page#account').find('#account_page_wrapper').html('<div id="loading_text" style="padding:30px; font-size:30px; opacity:.6;"><i class="icon-download-alt"></i> Loading....</div>');
  
         $.ajax({
              type: "POST",
              url: "/ajax/account.invite",
              data: { 'invite_email': invite_email },
              success: function(response){
                  $('#account_page_wrapper').html(response);
              }
          });    
    
});