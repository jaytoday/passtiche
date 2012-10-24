
$('.pass_title').textfill(30);


$('i', '.stats').tooltip();


function downloadPass(){

	openPassDialog('Download', $(this));
};

function sharePass(){

	openPassDialog('Share',  $(this));
};


// resect selected item on scroll
$('window').on('scroll', function(){
    $('.pass_item.selected').removeClass('selected');
});


// click on pass item - non-timed double click on mobile
$('.pass_item').find('.targ').on('click', function(){

    if ($(this).hasClass('is_mobile')){
        var pass_item = $(this).parents('.pass_item:first');
         if (!pass_item.hasClass('selected')){
             $('.pass_item.selected').removeClass('selected');
            return $(pass_item).addClass('selected');
        }
        
    $('.pass_item.selected').removeClass('selected');
    return pass_item.find('.download_pass:first').click();

    }

    openPassDialog('Download', $(this));

});




$('.img', '.pass_item').on('click', downloadPass);
$('.download_pass').on('click', downloadPass);

$('.share_pass').on('click', sharePass);



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
