



$('i', '.stats').tooltip();


// send Pass
var send_pass_modal = $('#sendPass:first');

function sendPassInit(pass_template, pass_template_id, pass_action){
// use el instead of pass template id?

	resetSendDialog();

	send_pass_modal.data('pass_template', pass_template);
	send_pass_modal.data('pass_template_id', pass_template_id);
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
		other_action = 'Offer';
	else
		other_action = 'Request';
	sendPassInit(send_pass_modal.data('pass_template'), send_pass_modal.data('pass_template_id'), other_action);
});


function requestPass(){
	openPassDialog('Request', $(this));
};

function offerPass(){
	openPassDialog('Offer',  $(this));
};


function openPassDialog(pass_action, el){
	var pass_name = el.parents('.pass_item:first').attr('name');
	var pass_id = el.parents('.pass_item:first').attr('pass_id');
	sendPassInit(pass_name, pass_id, pass_action);

}


$('.img', '.pass_item').on('click', requestPass);
$('.request_pass').on('click', requestPass);

$('.offer_pass').on('click',offerPass);



