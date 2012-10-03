function renderWidgets(){   

console.log('rendering widgets');
     
     
    // TODO: only include sortable plugin and this code when editing gallery
    // refactoring of edit/profile code is needed, only running code when its needed

{% comment "gallery/sort.js" %}
    
//sortInit();    
//sortBookInit();
        
var fill_in_preview = $('#book_profile').find('.fill_in_preview').each(function(){
    var fill_in_preview = $(this);
    fill_in_preview.parent().find('.answer').each(function(i, el){
        fill_in_preview.find('.fill_in_section:eq(' + i + ')').text($(this).attr('id'));
    });
});

 
} // end render Widget Profile

    
    
    $('#book_profile').find('#gallery_items').find('.close').live('click', function(){
        
       if (!confirm('Are you sure you want to remove this item?'))
            return false;
        
        var media_key = $(this).parents('.gallery_item:first').attr('id');
        $(this).parents('.gallery_item:first').fadeOut('fast', function(){ $(this).remove(); });
            $.ajax({
      type: "POST",
      url: "/ajax/media.delete",
      data: {
          media: media_key
      },
      success: function(){},
       error: function(){

       },
       complete: function(){

       }
    });
        
        
    });
    

{% comment "../../widget/server/multiple_choice.js" %}