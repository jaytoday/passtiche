
/*
$('#app_title').find('#hip').arctext({radius: 500});
$('#app_title').find('#type').arctext({radius: 500, dir: -1});

$('#home_link').find('#hip').arctext({radius: 90});
$('#home_link').find('#type').arctext({radius: 110, dir: -1});
*/


/* Landing Page */

function resetLandingPage(){
$('#previewCarousel').carousel({
  interval: 3000
});

};

//resetLandingPage();


// Beta Signup 

     		
function afterSignup(){
  $('#signup_box:first').find('#before_signup').hide().end().find('#after_signup').show();   
}

	$('#signup_link:first').on('click', function(){
        
	    var email_input = $('input#signup_email:first');
	    if (email_input.val().indexOf('@') < 1)
	        return bootbox.dialog('A valid email address is required to sign up', {"label" : "Continue", "class" : "error"});
	   
        $(this).button('loading');

	    var form_data = {
	    'email': email_input.val(),
	    //'type': $('#signup_type:first').find('option:selected').val()
	    };

	    // TODO: ajax save
		   $.ajax({
	         url: "/ajax/invite.request",
	         type: "POST",
	         data: form_data,
	         success: function(response){
	             return afterSignup();
	      
	         }
	       });
	       mixpanel.track('Submitted Sign Up Form', {
	           'user_agent': '{{ user_agent }}',
	           'email': email_input.val(),
	        });
	});

	

/* Main Index */

 initial_url_frag = window.location.hash;

  
{% if current_user %}

    {% include "nav.js" %}
    {% include "../utils/channel.js" %}

    {% include "../book/books.js" %}
    {% include "../book/profile.js" %}
    {% include "account.js" %}
    {% include "../widget/edit.js" %}
    {% include "../widget/list.js" %}
    {% comment "../widget/profile.js" %}


    function loadLandingPage(){
        // don't do this if something is already showing (this is only meant to load landing page as default)
   {% if current_user and not book_profile %}
       $('#cancel_newbook').hide();
       return $('a#newbook_link:first').click();
     {% end %}          
        if ($('.inner_page:visible').length > 0)
            return console.log('not loading landing page, another page is showing');
    
                   
    // just the landing page
    $('a#home_link').click();
};
    /* URL Hash */
    
    
    setTimeout(function(){
    // add scripts that aren't needed at first    
    // is raphael needed for anything besides analytics?
    // $('body').append("<script src='/static/js/raphael.js'>\x3C/script>");
  
    if (!initial_url_frag) 
       return loadLandingPage();// $('#intro_video:first').show();
    if (initial_url_frag == '#newbook')
        return $('a#newbook_link:first').click();
    if (initial_url_frag == '#mybooks')
        return $('a#mybooks_link:first').click();
        
        
    if (initial_url_frag == '#pricing')
        return $('#view_pricing:first').click();
        
                
    if (initial_url_frag.indexOf('#book/') > -1){
        var book_id = initial_url_frag.split('#book/')[1];
        console.log('book_id', book_id, $('#book_profile').children(':first').attr('id'));
        if ($('#book_profile').children(':first').attr('id') == book_id){
            console.log('book already loaded'); 
            return $('#book_profile').show();   
        }
        if (book_id.indexOf('/') > -1){
             var split_id = book_id.split('/');
             var book_id = split_id[0];
             var link_id = split_id[1];
             link_selector = 'a[href="' + link_id + '"]';
             if (link_id == 'new')
                 var link_selector = '#new_widget_btn';

                   $('#book_profile').data('callback', function(){
                       setTimeout(function(){
                        console.log('link', $('#book_profile').find(link_selector));
                        $('#book_profile').find(link_selector).click();
                    }, 500);
                    });
           
        }
        return loadBookProfile(book_id);   
  }
   console.log(('{{ current_user }}' && '{{ book_profile is None }}' == 'True'));

   
   return loadLandingPage();
    

    
    }, 50);
    
    

{% end %}


    setTimeout(function(){
    $('#intro_video:first').css({
        'display': 'block',
        'height': 'auto' 
}).on('click', function(){
    	       mixpanel.track('Intro Video', {
	           'user_agent': '{{ user_agent }}'
	        });
}); 
}, 2500);




