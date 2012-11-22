

{% include "pass.js" %}

{% include "location.js" %}

{% include "list.js" %}


/* Tabs */
$('#main-nav').find('li').on('click',function (e) {
	$('#content_edit_wrapper').html('');
  $(this).find('a').tab('show');
}).filter(':first').click();


/* Filepicker */

// filepicker
filepicker.setKey('ATRlBg2IJSykUmbd13td0z');



$('#upload_img').live('click', function(){
   
	filepicker.pick({
	    mimetype: 'image/*',
	    container: 'window',
	   // services:['COMPUTER', 'FACEBOOK', 'GMAIL'],
	  },
	  function(FPFile){ // success
	    console.log(JSON.stringify(FPFile));
	  },
	  function(FPError){ // error
	    console.log(FPError.toString());
	  }
	);

});

