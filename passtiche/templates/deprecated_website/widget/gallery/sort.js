$('#book_profile').find('#gallery_items').dragsort({ 
        dragSelector: "li", 
        dragEnd: function() { 
            media_items = Array();
            edit_widget_form.find('#gallery_items').find('.gallery_item').each(function(){
                media_items.push($(this).attr('id'));
            });
    
            console.log('dragging ended');
            $.ajax({
                 type: "POST",
                 url: "/ajax/widget.save",
                 data: {
                    'sequence': media_items,
                    'widget': edit_widget_form.attr('id')
                 },
                 success: function(response){
                     console.log('successful save');
                 }});
         
            }, 
        dragBetween: false, 
        placeHolderTemplate: "<li></li>" });
	
console.log('finished');