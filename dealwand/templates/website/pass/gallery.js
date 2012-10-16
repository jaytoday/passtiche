



$('i', '.stats').tooltip();


function requestPass(){

	openPassDialog('Request', $(this));
};

function offerPass(){
	openPassDialog('Offer',  $(this));
};




$('.img', '.pass_item').on('click', requestPass);
$('.request_pass').on('click', requestPass);

$('.offer_pass').on('click',offerPass);


// click on pass item 
$('.pass_item').find('.targ').on('click', requestPass);

//add pass
$('#add_pass').on('click', function(){

	bootbox.dialog("This feature requires an account", [{
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
});
