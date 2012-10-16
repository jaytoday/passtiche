
$('#edit_widget_link').live('click', function(){
   sortInit(); 
});

$('a', '#review_type').live('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    sortInit();
    
    $(this).parents('.review_item').find('#review_type_sections:first').find('.review_type_section').hide().filter('#' + $(this).attr('id')).show('fast');
});



$('.add_mc_question', '.review_item').live('click', function(){
   var review_section = $(this).parents('.review_type_section:first');
   var new_val = review_section.find('#new_mc_value').val(); 
   if (!new_val) return;
   var new_html = '<li class="mc_question"><input type="radio" name="optionsRadios" id="optionsRadios1">' + 
   '&nbsp; <span class="correct_prefix">Correct Answer: &nbsp;</span> <span class="mc_value">' + new_val + '</span> &nbsp; <a class="close">&times;</a><div class="adjust"></div></li>';
   
   review_section.find('#mc_intro').fadeOut(0);
   review_section.find('.mc_questions').append(new_html);
   review_section.find('#new_mc_value').val('');
   
   if (review_section.find('.mc_question').length > 1 && review_section.find('.mc_question.correct').length < 1)
        review_section.find('#mc_correct_intro').fadeIn();
   
   sortInit();

    
});


$('a.close', '.mc_question').live('click', function(e){
   $(this).parents('.mc_question:first').hide('fast', function(){ $(this).remove(); }); 
    e.stopPropagation();
});

$('.mc_question').live('click', function(e){
   $(this).find('input:not(:checked)').click();
});

$('.adjust', '.mc_question').live('click', function(e){
    e.stopPropagation();
});


$('input', '.mc_question').live('click', function(e){
    e.stopPropagation();
});

$('input', '.mc_question').live('change', function(e){
    var parent = $(this).parents('.mc_question:first');
    parent.addClass('correct').siblings().removeClass('correct');
    parent.parents('.review_type_section:first').find('#mc_correct_intro').fadeOut();
    e.stopPropagation();
});


$('#fill_in_value', '.review_item').live('keyup', function(){
    console.log($(this).parents('.review_type_section:first').find('.fill_in_preview:first').length, $(this).val());
    
    var fill_in_preview = $(this).parents('.review_type_section:first').find('.fill_in_preview:first');
    if (! $(this).val())
        return fill_in_preview.parents('.fill_in_preview_wrapper:first').hide();
    
    $(this).val( $(this).val().replace('__','_').replace('__','_').replace('__','_') );
    // TODO: make this into jQuery plugin
    // TODO: maintain answers after edit
    var preview_text = $(this).val().replace(' _ ',' <section contenteditable="true" class="fill_in_section"></section> ')
    .replace(' _ ',' <section contenteditable="true" class="fill_in_section"></section> ')
    .replace(' _ ',' <section contenteditable="true" class="fill_in_section"></section> ');
    
    fill_in_preview.html(preview_text).parents('.fill_in_preview_wrapper:first').show();
    fill_in_preview.parent().find('.answer').each(function(i, el){
        fill_in_preview.find('.fill_in_section:eq(' + i + ')').text($(this).attr('id'));
    });
});

$('#submit', '#review_frame').live('click', function(){
       return bootbox.dialog('nothing to see here...move along', {"label" : "Continue", "class" : "info"}); 
           
});

