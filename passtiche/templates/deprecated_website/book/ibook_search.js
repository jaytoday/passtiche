function iBookSearchInit(){
  $('#ibook_id').typeahead({
    source: function(typeahead, query){
      $.get('ajax/ibooks.search', {'query': query}, function(data){
          typeahead.process(data['results']);
    }, 'json');
    },  
         onselect: function(obj) { 
           $('#ibook_id').attr('ibook_id', obj['id']);  
           $('#save_bookid').click();
              },
         property: "title"
    }).on('keydown', function(){ $(this).attr('ibook_id',''); });
        
};         
  
$('#save_bookid').live('click', function(){
    // we can pretty easily tell if this is an ID
   var search_el = $(this).parent().find('#ibook_id');
   if (search_el.attr('ibook_id'))
   // typeahead
        var ibook_id = search_el.attr('ibook_id');
   else 
        // the user has pasted an ID
        var ibook_id = search_el.val();    
 
   if (!ibook_id) 
        return bootbox.dialog('An iBook ID is required', {"label" : "Continue", "class" : "error"});  
   if (!parseInt(ibook_id))
     return bootbox.dialog('The iBook ID must be numerical', {"label" : "Continue", "class" : "error"});         
  
   $(this).button('loading');
   
   $.ajax({
     type: "POST",
     url: "/ajax/book.ibook_id",
     data: {
         'ibook_id': ibook_id,
         'book': book_key
     },
     success: function(response){
         if (response == "inprogress"){
             $('#analytics_preview').html('<b>These analytics are a preview.</b>  Your book is being indexed and you will receive an email when indexing is completed.');
             return bootbox.dialog('Your book is being indexed. You will receive an email when indexing is completed.', 
                {"label" : "Continue", "class" : "info"});  
         }
         
         if (response == "unavailable"){
                return bootbox.dialog('This iBook is already connected to another book project', 
                {"label" : "Continue", "class" : "error"});  
         }

        $('#book_profile').html(LOADING_BOOK_HTML).show();
        return renderBookProfile(response); 
     },
     complete: function(){
         
     }
 });
                 
            
});