{% include "navbar.js" %}
{% include "signup.js" %}

{% if is_mobile %}
	$(document).data('is-mobile', true);
	
{% end %}

$(document).data('base-url', '{{ base_url }}');
$(document).data('domain', '{{ domain }}');

{% if current_user %}
// sometimes current user ID is used for direct API access
  $(document).data('current_user', '{{ current_user.key().name() }}');  
{% end %}

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

function showDialog(msg){


  bootbox.dialog(msg, [{
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

};

$('.not_available').live('click', function(){

  showDialog("This feature is not available");
});

window.showDialog = showDialog;