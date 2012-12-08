

{% include "pass.js" %}

{% include "location.js" %}

{% include "list.js" %}

{% include "settings.js" %}


/* Tabs */
$(function(){
$('#main-nav').find('li').on('click',function (e) {

	$('#content_edit_wrapper').html('').hide();

  $(this).find('a').tab('show');
}).filter(':first').click();
});


/* Filepicker */

// filepicker
filepicker.setKey('ATRlBg2IJSykUmbd13td0z');



$('.upload_img').live('click', function(){
   img_uploader = $(this);

   // TODO: dimensions should be 600w x 225h
	filepicker.pick({
	    mimetype: 'image/*',
	    container: 'window',
	   // services:['COMPUTER', 'FACEBOOK', 'GMAIL'],
	  },
	  function(FPFile){ // success
	    edit_form = img_uploader.parents('fieldset:first');
	    edit_form.find('img.pass_img').attr('src', FPFile['url']);
	    edit_form.find('#image_url').val(FPFile['url']);
	    edit_form.find('.save_btn').click();

	  },
	  function(FPError){ // error
	    console.log(FPError.toString());
	  }
	);

});

