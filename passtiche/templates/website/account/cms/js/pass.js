
function updatePassTemplates(){
	$.ajax({
	type: "GET",
	url: "/api/1/pass.find",
	data: {'output': 'html', 'account': $(document).data('current_user') },
	success: function(response){
	// TODO: JS templating with JSON
	renderPassTemplates(response);

	}
	});	   
};

function renderPassTemplates(resp_html){
     $('#pass_template_list').html(resp_html);
     $('#pass_template_list').find('.edit_pass:first').click();
};

$('#pass_link').parent().on('click', function(){
	updatePassTemplates();
});


$('a.edit_pass').live('click', function(){
       $('#content_edit_wrapper').html($(this).parent().find('.edit').html()).show();
});

$('a#new_pass').on('click', function(){

     $('#content_edit_wrapper').html($('#new_pass_wrapper').html()).show();

});




function SavePassTemplate(fieldset){

	var pass_data = {'output': 'html', 'account': $(document).data('current_user')};

		input_vals = ['name','slug','image_url', 'description','neighborhood_name','location_code','price', 'starts','ends','weekday_range','times','delete','organization','website'];
	$(input_vals).each(function(i, f){
		if (fieldset.find('#' + f).val())
			pass_data[f] = fieldset.find('#' + f).val();
	});

	var price_rating = fieldset.find('#price_rating').find('option:selected');
	if (price_rating.length > 0)
		pass_data['price_rating'] = price_rating.val();		

							
console.log(pass_data);

	$.ajax({
	type: "GET",
	url: "/api/1/pass.update",
	data: pass_data,
	success: function(response){
	// TODO: JS templating with JSON
	renderPassTemplates(response);

	}
	});	   
};

$('.save_pass').live('click', function(){
	var fieldset = $(this).parents('fieldset:first');
	SavePassTemplate(fieldset);

});
$('.delete_pass').live('click', function(){
	if (!confirm('Are you sure you want to delete this?'))
		return;
	var fieldset = $(this).parents('fieldset:first');
	fieldset.find('#delete').val('true');
	SavePassTemplate(fieldset)
});
