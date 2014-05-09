$(document).ready(function(){
    $('#fileupload').bootstrapFileInput();
    $('.file-input-wrapper').removeClass('btn-default');
    var span = $('#add-buttons').children(':first-child');
    span.removeClass('glyphicon');
    span.removeClass('glyphicon-plus');
    span.children('a').addClass('glyphicon');
    span.children('a').addClass('glyphicon-plus');
    $('#crop_control').hide();
});
