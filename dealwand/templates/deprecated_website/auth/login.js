	$('a','#social_login').on('click', function(){
		        return bootbox.dialog('This feature is unavailable', {"label" : "Continue", "class" : "error"});    
	});
	
		$('#submit_login').on('click', function(){
		       // TODO: secure. 
		       var email = $('input#email:first').val();
		       var password = $('input#password:first').val();

		       if (!email)
		        return bootbox.dialog('You forgot to enter an email address!', {"label" : "Continue", "class" : "error"});  
		       if (email.indexOf('@') < 1)
		        return bootbox.dialog("Check your email address to make sure it's valid", {"label" : "Continue", "class" : "error"});  
		       if (!password)
		        return bootbox.dialog('You forgot to enter a password!', {"label" : "Continue", "class" : "error"});  
		       if (password.length < 4)
		        return bootbox.dialog('Your password must be at least 4 characters', {"label" : "Continue", "class" : "error"});  
  
        if ($('#terms_agree').not(':checked').length > 0)
            return bootbox.dialog('Please agree to the terms of service', {"label" : "Continue", "class" : "error"});  
      
            
        
        if ($('input#code:first').val())
            code = $('input#code:first').val()
        else 
            code = '';
        
        $(this).button('loading');

    	       mixpanel.track('Register', {
	           'user_agent': '{{ user_agent }}',
	           code: code,
	           email: email
	        });
	        
        $.ajax({
             type: "POST",
             url: "/login",
             data: {
                    email: email,
                    password: password,
                    code: code
                 },
             success: function(response){   
                 var response_dict = $.parseJSON(response);

                 if (response_dict['error']){
                    $('#submit_login').button('reset');
                    return bootbox.dialog(response_dict['error'], {"label" : "Continue", "class" : "error"});    
                }
                window.location.href = '/dashboard';
            },
              error: function(){
                   // delete_book_btn.button('reset');
              },
              complete: function(){
           
              }
           });
   
		       
	});
	
