{% include "navbar.js" %}
{% include "signup.js" %}

{% if is_mobile %}
	$(document).data('is-mobile', true);
	
{% end %}

$(document).data('base-url', '{{ base_url }}');
$(document).data('domain', '{{ domain }}');

$(document).keyup(function(e){

    if (e.keyCode == 13){ // enter, space is 32

     console.log( $('input:focus').closest('.continue'));
          $('.continue:visible').click();    
    } 
    
    if (e.keyCode == 27){ // escape
    	// click the cancel button if there is one     

    	$('.escape:visible').click();  

    }
        
});

$('.not_available').live('click', function(){

  bootbox.dialog("This feature is not available", [{
    "label" : "Continue",
    
    "callback": function() {
     
    }
}], {
    "backdrop" : "static",
    "onEscape": "close",
    "keyboard" : true,
    "show"     : true,
    "animate": false
});

});