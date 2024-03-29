
function updatePassTemplates(){
	$.ajax({
	type: "GET",
	url: "/api/1/pass.find",
	data: {'output': 'html', 'order': '-views', 'code': $(document).data('account') },
	success: function(response){
	// TODO: JS templating with JSON
	renderPassTemplates(response);

	},
	error: function(response){
		showDialog('Error: Unable to retrieve passes');
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


$('#pass_list').find('tr').live('click', function(){
	editPass($(this));
});

function editPass(el){
 	$('#content_edit_wrapper').html(el.find('.edit').html()).show();

	$('#content_edit_wrapper').find('#passOptions').find('a').on('click',function (e) {
 		 $(this).tab('show');
 		 	$('#content_edit_wrapper').find('#passOptionsContent').find($(this).attr('data-target')).siblings().removeClass('active').end().addClass('active');

	}).filter(':first').click();

}

$('a.edit_pass').live('click', function(){
      editPass($(this).parent());
});

$('a#new_pass').on('click', function(){

     $('#content_edit_wrapper').html($('#new_pass_wrapper').html()).show();

});

	  $('#content_edit_wrapper').find('#pass_activity_accordian').live('show', function() {
    // Replace the icon by switching out the class
   $('#pass_activity_accordian_icon').removeClass('icon-plus').addClass('icon-minus');
   });
	  $('#content_edit_wrapper').find('#pass_activity_accordian').live('hide', function() {
    // Replace the icon by switching out the class
   $('#pass_activity_accordian_icon').removeClass('icon-minus').addClass('icon-plus');
   });





function SavePassTemplate(fieldset){

	var pass_data = {'output': 'html', 'code': $(document).data('account')};

		input_vals = ['name','slug','image_url', 'url','description','neighborhood_name','location_code',
		'price', 'starts','ends','weekday_range','times','delete','organizationName','organizationUrl', 
		'changeMessage'];
	$(input_vals).each(function(i, f){
		if (fieldset.find('#' + f).val())
			pass_data[f] = fieldset.find('#' + f).val();
	});

	var price_rating = fieldset.find('#price_rating').find('option:selected');
	if (price_rating.length > 0)
		pass_data['price_rating'] = price_rating.val();		

							
console.log(pass_data);

if (!pass_data['name'])
	return showDialog('A pass name is required');

	$.ajax({
	type: "GET",
	url: "/api/1/pass.update",
	data: pass_data,
	success: function(response){
	// TODO: JS templating with JSON
	renderPassTemplates(response);

	},
	error: function(response){
		showDialog('Error: Unable to save pass');
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
