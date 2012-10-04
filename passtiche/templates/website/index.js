$('i', '.stats').tooltip();


// send Pass
var send_pass_modal = $('#sendPass:first');

function sendPassInit(pass_template, pass_action){
// use el instead of pass template id?

	

	send_pass_modal.data('pass_template', pass_template);
	send_pass_modal.data('pass_action', pass_action)

	send_pass_modal.find('.pass_action:first').text(pass_action);

	send_pass_modal.find('.pass_template:first').text(pass_template);

	if (pass_action == 'Request')
		other_action = 'Offer'
	else
		other_action = 'Request'

	send_pass_modal.find('.other_action:first').text(other_action + ' This');


};

send_pass_modal.find('.other_action:first').on('click',function(){

	var pass_action = send_pass_modal.data('pass_action');
	if (pass_action == 'Request')
		other_action = 'Offer'
	else
		other_action = 'Request'
	sendPassInit(send_pass_modal.data('pass_template'), other_action);
});


$('.request_pass').on('click', function(){
	var pass_name = $(this).parents('.pass_item:first').attr('name');
	sendPassInit(pass_name, 'Request');

});

$('.offer_pass').on('click', function(){
	var pass_name = $(this).parents('.pass_item:first').attr('name');
	sendPassInit(pass_name, 'Offer');

});