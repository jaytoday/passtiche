


if (!window.location.hash)
    $('#subnav').find('li').removeClass('active').filter(':first').addClass('active');


{% include "../pass/gallery.js" %}




// detect if pass should be opened



if ('{{ linked_pass_template }}' && window.location.hash.indexOf('#') < 0){
$(document).live('passtiche-loaded', function(){
    console.error($('.pass_item[code="{{ linked_pass_template }}"]').find('a.passtiche-link'), $('.pass_item[code="{{ linked_pass_template }}"]'));
        $('.pass_item[code="{{ linked_pass_template }}"]').find('a.passtiche-link').click();
    });
    
}


/*
bootbox.dialog("Plenty of buttons...", [{
    "label" : "Cancel",
    "class" : "error",
    "callback": function() {
     
    }
}, {
    "label" : "Continue",
}], {
    "backdrop" : "static",
    "onEscape": "close",
    "keyboard" : true,
    "show"     : true,
    "animate": false
});
*/
