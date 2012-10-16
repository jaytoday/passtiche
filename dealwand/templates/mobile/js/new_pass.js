			$('#new_pass_link').live('click',function(event){
				return;
				setTimeout(function(){
					$('#image_upload').click();
				}, 500);
				
			});


			$('#preview_pass').on('click', function(){
				// TODO: check values

				$(this).parents('form:first').submit();

			});

			$('#image_upload').live('change', function(){

				// TODO: check on input to see if it has file 
				console.log($(this).val());
				if (!$(this).val())
						return alert('image is needed');

				$(this).parents('form:first').submit();

			});