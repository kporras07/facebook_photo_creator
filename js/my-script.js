$(document).ready(function(){
    $('#fileupload').bootstrapFileInput();
    $('.file-input-wrapper').removeClass('btn-default');
});
$('#s1').click(function(){
    c.setWidth(851);
    c.setHeight(397);
    c.setOverlayImage('img/foreground-personal.png', c.renderAll.bind(c));
    $('.st').removeClass('active');
    $('#timeline_header').removeClass('switch_gplus').addClass('switch_fb');
    $(this).addClass('active');
    set = 'personal';
});
$('#s2').click(function(){
    c.setWidth(851);
    c.setHeight(397);
    c.setOverlayImage('img/foreground-page.png', c.renderAll.bind(c));
    $('.st').removeClass('active');
    $('#timeline_header').removeClass('switch_gplus').addClass('switch_fb');
    $(this).addClass('active');
    set = 'page';
}); 
