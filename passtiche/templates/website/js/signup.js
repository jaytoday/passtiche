
 $('.submit_email').on('click', function(){
  // TODO: validate and ajax call

    var signup_form = $(this).parents('form:first');
    
    var email_val = signup_form.find('#email').val();
    if (email_val.indexOf('@') < 1)
        return bootbox.dialog("A valid email address is required", [{
    "label" : "Continue",
}], {
    "backdrop" : "static",
    "onEscape": "close",
    "keyboard" : true,
    "show"     : true,
    "animate": false
});
    
   signup_form.find('#before').hide().end().find('#after').show();
   var signup_data = {
         "signup": signup_form.attr('id'),
         "email": email_val
        };
    
   if (signup_form.find('.dev_type:checked').length > 0)
        signup_data['dev_type'] = signup_form.find('.dev_type:checked').val();
   $.ajax({
     type: "POST",
     url: "/ajax/user.email_signup",
     data: signup_data,
     success: function(response){
     	console.log(response)

     }
     });


});