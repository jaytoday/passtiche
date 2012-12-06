
// send Pass
var send_pass_modal = $('#sendPass:first');


if (!window.location.hash)
    $('#subnav').find('li').removeClass('active').filter(':first').addClass('active');


{% include "../pass/gallery.js" %}

{% include "../pass/send_dialog.js" %}




// detect if pass should be opened

if ('{{ linked_pass_template }}' && window.location.hash.indexOf('#') < 0){
    $('.pass_item[code="{{ linked_pass_template }}"]').find('.download_pass').click();
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
