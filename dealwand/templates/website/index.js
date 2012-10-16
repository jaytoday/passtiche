
// send Pass
var send_pass_modal = $('#sendPass:first');


if (!window.location.hash)
    $('#subnav').find('li').removeClass('active');

{% include "pass/gallery.js" %}

{% include "pass/send_dialog.js" %}


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
