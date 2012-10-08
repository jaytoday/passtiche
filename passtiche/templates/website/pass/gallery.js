



$('i', '.stats').tooltip();


function requestPass(){
	openPassDialog('Request', $(this));
};

function offerPass(){
	openPassDialog('Offer',  $(this));
};


function openPassDialog(pass_action, el){
	var pass_name = el.parents('.pass_item:first').attr('name');
	var pass_id = el.parents('.pass_item:first').attr('pass_id');
	resetSendDialog();
	sendPassInit(pass_name, pass_id, pass_action);
	var pass_link = 'http://passtiche.com/p/' + pass_id;
	send_pass_modal.find('#inputLink').val(pass_link);	

	send_pass_modal.find('button', '#pass_action_choices').removeClass('active').filter('#' + pass_action).click();

	send_pass_modal.find('#inputThemes input:first').click();

}


$('.img', '.pass_item').on('click', requestPass);
$('.request_pass').on('click', requestPass);

$('.offer_pass').on('click',offerPass);



