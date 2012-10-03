$('a', '#reward_action').live('click', function(){
    return bootbox.dialog('This feature is unavailable', {"label" : "Continue", "class" : "error"}); 

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
    var edit_widget_form = $(this).parents('.edit_widget_form:first');
    console.log(edit_widget_form.find('.reward_action_details:first').find('#' + $(this).attr('id')));
    edit_widget_form.find('.reward_action_details:first').find('#' + $(this).attr('id')).show().siblings().hide();
    
});

$('a', '#reward_type').live('click', function(){

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
    var edit_widget_form = $(this).parents('.edit_widget_form:first');
    console.log(edit_widget_form.find('.reward_type_details:first').find('#' + $(this).attr('id')));
    edit_widget_form.find('.reward_type_details:first').find('#' + $(this).attr('id')).show().siblings().hide();    
    
    
});