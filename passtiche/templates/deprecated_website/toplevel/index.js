$(function() {
    
    $('#jms-slideshow').click(function(){
        	    mixpanel.track('Slideshow Inner Click', {
	           'user_agent': '{{ user_agent }}'
	        });
	        
	        
       window.location.hash = '#invite'; 
        
    });
    
    var info_img = $('#infographic_wrapper').find('img');
    info_img.attr('src', info_img.attr('_src'));
    
    $('#infographic_wrapper').find('img,div#checkout_inner').click(function(){
        var wrapper =  $('#infographic_wrapper');
        wrapper.toggleClass('active');    
         var infotop = $('#infographic_wrapper').position().top + 450;
                         $(window).scrollTop( infotop );

    });
    
    $('#launch_partner_btn').click(function(){
       if ($(this).hasClass('active'))
            return $(this).removeClass('active').find('i').hide();
            $(this).addClass('active').find('i').show();
    });
			   signed_up = false; 
	
				
				$('#about_link').click(function(){
				    if ($('#about_page').is('visible'))
				        return;				    
				    $('.inner-page:visible').hide();
				    $('#about_page').show();					    
				});

				$('#pricing_link').click(function(){
		    mixpanel.track('Pricing Link Click', {
	           'user_agent': '{{ user_agent }}'
	        });
	        
				    if ($('#pricing_page').is('visible'))
				        return;
				    $('.inner-page:visible').hide();
				    $('#pricing_page').show();
				});

				$('.privacy_link').click(function(){
						    mixpanel.track('Privacy Link Click', {
	           'user_agent': '{{ user_agent }}'
	        });
				    if ($('#privacy_page').is('visible'))
				        return ;
				    $('.inner-page:visible').hide();
				    $('#privacy_page').show();		    
				});
				
				$('#jobs_link').click(function(){
				    
				    		    mixpanel.track('Jobs Link Click', {
	           'user_agent': '{{ user_agent }}'
	        });
			
				    if ($('#jobs_page').is('visible'))
				        return ;
				    $('.inner-page:visible').hide();
				    $('#jobs_page').show();		    
				});				

				$('.landing_page_link').click(function(){
				    
				    		    mixpanel.track('Landing Page Link Click', {
	           'user_agent': '{{ user_agent }}'
	        });
	        
				    if ($('#landing_page').is('visible'))
				        return;				    
				    $('.inner-page:visible').hide();
				    $('#landing_page').show();
				});	
				
				$('.signup').click(function(){
				    if (!signed_up){
    				 window.location.hash = '#';
    				   $('.logo:first').click();
    				   setTimeout(function(){
    				       //$('#invite_link').click();
    				        window.location.hash = '#invite';
    				     }, 100);
				    return;
				    };
		if ($('#signup_alert:first').find('#after_signup').is(':visible'))	return console.log('already completed signup');	 
		
		var form_data = {
	        'email': user_email,
	        'plan': $(this).parents('.tier:first').attr('id'),
	       //'launch_partner': $('#launch_partner_btn').hasClass('active')
	    };
	    
	    		    mixpanel.track('Pricing Plan Signup', {
	           'user_agent': '{{ user_agent }}',
	           'form_data': form_data
	        });
	    
	    $('#signup_alert:first').css('margin-top',100).find('#before_signup').hide().end().find('#after_signup').show();
	    			 
	    			 $('.pricing-wrapper').parent().hide();   
		$.ajax({
	         url: "/ajax/invite.request",
	         type: "POST",
	         data: form_data,
	         success: function(response){
	            
	      
	         }
	       });
	       
				});
				
				$(document).keyup(function(e){

    if (e.keyCode == 37){ // left
           $('.jms-arrows-prev:first').click();      
    } 
    
    if (e.keyCode == 39){ // right
          $('.jms-arrows-next:first').click();
}

	$('span', '.jms-arrows').click(function(){
	    
	    	    mixpanel.track('Slideshow Arrows Click', {
	           'user_agent': '{{ user_agent }}'
	        });     
	        
	    });	
	    

	        
	        $('a', '#blog_posts').click(function(){
	            mixpanel.track('Blog Post Link Click', {
	           'user_agent': '{{ user_agent }}',
	           'post': $(this).parents('.row:first').find('a:first').text()
	        });   
	            
	        });
	        	    

});


		     initial_url_frag = window.location.hash;
			        if (initial_url_frag == '#pricing')
                        $('a#pricing_link:first').click();
			        if (initial_url_frag == '#privacy')
                        $('a#privacy_link:first').click();
			        if (initial_url_frag == '#about')
                        $('a#about_link:first').click();                                                
			        if (initial_url_frag == '#jobs')
			            $('a#jobs_link:first').click();   
			          if (initial_url_frag == '#dna' || initial_url_frag == '#infographic' || initial_url_frag == '#research'){
			              $('#infographic_wrapper').show().find('img').click();
			             setTimeout(function(){
			             var infotop = $('#infographic_wrapper').position().top + 450;
                         $(window).scrollTop( infotop );
                        }, 1500);

		              }
			                 
			

			if (initial_url_frag && (navigator.userAgent.indexOf('iPhone') < 0)) 
			    $('#landing_page').find('.promo:first').animate({'height': 254}, 0, function(){ $('#landing_page').find( '#jms-slideshow' ).fadeTo(0, 1).jmslideshow();
		    });
			
			else if (navigator.userAgent.indexOf('iPhone') < 0)
			    setTimeout(function(){
			        if (document.width < 769) return;
			        	$('#landing_page').find('.promo:first').animate({'height': 254}, 2000, function(){ $('#landing_page').find( '#jms-slideshow' ).fadeTo(0, .01).jmslideshow().fadeTo(2000, 1);	});
		}, 1500);


				 			
								
				
			
function afterSignup(){
     // $('#invite:first').find('#before_signup').hide().end().find('#after_signup').show(); 
     $('body:first').animate({scrollTop:100}, 0);
     setTimeout(function(){
     
     $('#pricing_link:first').click();
     $('#signup_alert:first').show();
 
     }, 250);
    
}

$(document).keyup(function(e){

    if (e.keyCode == 13){ // enter, space is 32
              if ($('.bootbox.modal:visible').length > 0)
            return $('.bootbox.modal:visible').find('a.btn:first').click(); // TODO: only primary button
        
        
          $('input:focus').parents('.form-inline:first').find('a:first').click();  

    } 
    

});



	$('#signup_link:first').on('click', function(e){
        
	    var email_input = $('input#signup_email:first');
	    if (email_input.val().indexOf('@') < 1){
	        
	        	       mixpanel.track('Invalid Sign Up Form', {
	           'user_agent': '{{ user_agent }}',
	           'email': email_input.val(),
	        });
	        
	   
	        return bootbox.dialog('A valid email address is required to sign up', {"label" : "Continue", "class" : "error"});
	    };
	    user_email = email_input.val();
	    var form_data = {
	    'email': user_email,
	    //'type': $('#signup_type:first').find('option:selected').val()
	    };
	    
	    signed_up = true;

	    // TODO: ajax save
		   $.ajax({
	         url: "/ajax/invite.request",
	         type: "POST",
	         data: form_data,
	         success: function(response){
	            
	      
	         }
	       });
	       mixpanel.track('Submitted Sign Up Form', {
	           'user_agent': '{{ user_agent }}',
	           'email': email_input.val(),
	        });
	         return afterSignup();
	});

	
			});