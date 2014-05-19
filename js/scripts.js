function getIndex(object){
	var objects = c.getObjects();
	for(var i in objects){
		if(objects[i]==object){
			return i;
		}
	}
}

var cropping = false;
var c = new fabric.Canvas('cc');
if(window.localStorage['fpc-canvas']){
    c.loadFromJSON(window.localStorage['fpc-canvas']);
}
else{
    var textSample = new fabric.Text("Agregue o arrastre imagen",{
        fontFamily: "Tiki Island",
        left: 425,
        top: 140,
        fontSize: 60,
        textAlign: "center",
        fill:"#FFFFFF",
        textShadow: 'rgba(0,0,0,0.2) 2px 2px 10px',
    });
    c.add(textSample);
}
var start, set = 'personal';
c.setOverlayImage('img/foreground-personal.png', c.renderAll.bind(c));
c.backgroundColor = 'rgba(59,89,152,1)';

reloadThumbs();

$(function() {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
  	// Great success! All the File APIs are supported.
	}else{
		//alert('Your browser do not support some of the applications functionality. Please upgrade your browser to the latest version.');
	}

$('#fileupload').fileupload({
	add: function (e, data) {
					if (typeof FileReader !== "undefined"){
					$(data.files).each(function(i){
						var file = this;
						var fileReader = new FileReader();

						fileReader.onload = function(e) {

							var dataURL = e.target.result;
							fabric.Image.fromURL(dataURL, function(oImg) {
									if (oImg.getWidth() > 800) {
										oImg.scaleToWidth(800);
									}

									if (oImg.getHeight() > 400) {
										oImg.scaleToHeight(400);
									}
									c.add(oImg);

									oImg.setActive(true);
									c.centerObjectH(oImg).centerObjectV(oImg);
									oImg.setCoords();
									c.renderAll();
									var image = $('<image width="120" height="55" />').attr('src',dataURL);
									$( "<li/>" ).prependTo( "#object_layers" ).append(image);
									reloadThumbs();
								});
						};

						fileReader.readAsDataURL(file);

						});

					}else{
							data.submit();
					}
	},
	dataType: 'json',
	done: function (e, data) {
			$.each(data.result, function (index, file) {
				$('<p/>').text(file.name).appendTo(document.body);
				fabric.Image.fromURL(file.url, function(img) {
					var oImg = img.set({ left: 110, top: 75}).scale(0.7);
					c.add(oImg).renderAll();
				});
			});
	}
});
		
	
$(document).keydown(function(e) {
	if(e.which == 46 && !cropping){
		var activeObject = c.getActiveObject();
		if(activeObject){
			c.remove(activeObject);
			reloadThumbs();
		}
	}
});

$('.tt2').tooltip({'placement':'left'});$('.tt').tooltip();

$('#remove').click(function(){
	var activeObject = c.getActiveObject();
	if(activeObject){
			c.remove(activeObject);
			reloadThumbs();
	}
});
	
$('#addtext').click(function(){
	var textObj = new fabric.Text('Texto', { 
			fontFamily: 'Tiki Island',
			left: 425,
			top: 150,
			fontSize: 60,
			textAlign: "center",
			fill:"#FFFFFF",
			textShadow: 'rgba(0,0,0,0.3) 2px 2px 10px',
		});
		textObj.setActive(true);
		c.add(textObj);
		reloadThumbs();
});
	
$("#object_layers").sortable({ change: function(event, ui) { 
		//setTimeout(function(){reloadLayers();},100);
	},deactivate:function(event,ui){
		if(!cropping){
			setTimeout(function(){
				reloadLayers();
			},100);
		}
}});
		
$("#clear").click(function(){
	if(confirm("Are you sure to clear all including saved data?")){
		c.clear();
        if(window.localStorage['fpc-canvas']){
            window.localStorage.removeItem('fpc-canvas');
        }
		reloadThumbs();
	}
});


$('#cover_color .color-picker').miniColors({
		letterCase:'uppercase',
		change: function(hex, rgb) {
			$('#console').prepend('change: ' + hex + ', rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
			c.backgroundColor = hex;
			c.renderAll();
		}
});
		
$('#text_color').miniColors({
		letterCase:'uppercase',
		change: function(hex, rgb) {
			$('#console').prepend('change: ' + hex + ', rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
			var activeObject = c.getActiveObject();
			if(activeObject !== null && activeObject.type == "text"){
				activeObject.setColor(hex);
				c.renderAll();
				$(this).data('activeObject',activeObject);
				$(this).data('modified',true);

			}
			c.renderAll();
		}
});
		
$('#text_font').change(function(e){
		var activeObject = c.getActiveObject();
		if(activeObject !== null && activeObject.type == "text"){
			var font = $(this).val();
			activeObject.set({fontFamily:font});
			c.renderAll();
			reloadThumbs(activeObject);
		}
});
		
$('#text_bold,#text_italic,#text_underline,#text_shadow,#text_underline').click(function(){
		var activeObject = c.getActiveObject();

		if(activeObject !== null && activeObject.type == "text"){
			var $this = $(this);

			if($this.is("#text_bold")){
				activeObject.fontWeight = (activeObject.fontWeight == 'bold')?'normal':'bold';
			}else if($this.is("#text_italic")){
				activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
			}else if($this.is("#text_underline")){
				activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
			}else if($this.is("#text_shadow")){
  					activeObject.textShadow = !activeObject.textShadow ? 'rgba(0,0,0,0.2) 2px 2px 10px' : '';
  		}
			
			c.renderAll();
			reloadThumbs(activeObject);
		}
		return false;
});
		
$('#text_text').bind('keyup change',function(){
		var activeObject = c.getActiveObject();
		if(activeObject !== null  && activeObject.type == "text"){
			var text = $(this).val();
			activeObject.setText(text);
			c.renderAll();
			reloadThumbs(activeObject);
		}
});

		
$('#image_fliph').click(function(){
	var activeObject = c.getActiveObject();

	if(activeObject !== null){
		activeObject.flipX = !activeObject.flipX;
		c.renderAll();

		reloadThumbs(activeObject);
	}

	return false;
});

$('#image_flipv').click(function(){
	var activeObject = c.getActiveObject();

	if(activeObject !== null){
		activeObject.flipY = !activeObject.flipY;
		c.renderAll();

		reloadThumbs(activeObject);
	}

	return false;
});

$('#d1').click(function(){dload('cover');});
$('#d2').click(function(){dload('profile');});
$('#d3').click(function(){dload('all');});

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

$('#s3').click(function(){
	c.setWidth(932);
	c.setHeight(532);
	c.setOverlayImage('img/new_gplus.png', c.renderAll.bind(c));
	$('.st').removeClass('active');
	$('#timeline_header').removeClass('switch_fb').addClass('switch_gplus');
	$(this).addClass('active');
	set = 'gplus';
});
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
$("#save").click(function(){
		var sve = JSON.stringify(c);
        if(supports_html5_storage()){
            window.localStorage['fpc-canvas'] = sve;
            alert('Guardado');
        }
        else{
            alert('Tu navegador no soporta la funcionalidad de almacenamiento de datos.');
        }
//		$.ajax({type: "POST",url: "ajax.php",data: { d: sve}}).done(function( msg ) {alert( "Data Saved!");});
});
		
		
});

function dload(t){
	var activeObject = c.getActiveObject();
	if(activeObject) activeObject.setActive(false);

	var overlayImage = c.overlayImage;
	c.overlayImage = null;
	$('#download #type').val(t);
	$('#download #set').val(set);
	$('#download #img').val(c.toDataURL('png'));
	if(activeObject) activeObject.setActive(true);

	c.overlayImage = overlayImage;
	c.renderAll();

	if($('#download').submit()){
		//$.ajax({type: "POST",url: "counter.php",data:{ x:"add"},success:function(data){
		//	$("#ctr").html(data);
		//}});
	}
	
}

function getData(){
	var d = $('body').data('dats');
}


/*
	FUNCTIONS
*/

function reloadThumbs(object){
    if(!cropping){
  		var lis = $($("#object_layers li" ).get().reverse());
  		
  		if(object){
  			var objects = [];
  			var index = getIndex(object);
  			objects[index] = object;
  		}else{
  			var objects = c.getObjects();
  			var dataURL = '';
  			if(objects.length !== lis.length){
  				$("#object_layers").empty();
  				for(var i=0;i<objects.length;i++){
  					var image = $('<image width="120" height="75" />').attr('src',dataURL);
  					$( "<li/>" ).prependTo( "#object_layers").append(image);
  				}
  				lis = $($( "#object_layers li" ).get().reverse());
  			}
  		}


  		for(i in objects){
  			if(objects[i] !== undefined){
  				var el = fabric.document.createElement('canvas');
  				
  				if (!el.getContext && typeof G_vmlCanvasManager != 'undefined') {
  					G_vmlCanvasManager.initElement(el);
  				}
  				
  				el.width = $('#cc').width();
  				el.height = $('#cc').height();

  				fabric.util.wrapElement(el, 'div');

  				var _canvas = new fabric.Canvas(el);
  				_canvas.backgroundColor = 'transparent';
          var active = objects[i].isActive();
					
  				_canvas.add(objects[i]);
  				_canvas.renderAll();

  				var dataURL = _canvas.toDataURLWithMultiplier('png',0.35101058);

  				if(active){
          //   objects[i].setActive(false);
          //   objects[i].selectable = true;
          }
  				//_canvas.dispose();
  				//_canvas = null;

  				$(lis.get(i)).find('img').attr('src',dataURL);
					$('#object_layers li').click(function(){
						$('#object_layers li').removeClass('layer_selected');
						$(this).addClass('layer_selected');
					});
  			}
  		}
  		reloadData();
    }
}

function reloadLayers(){
	$($("#object_layers li").get().reverse()).each(function(){
		if($(this).data('object') !== undefined) c.bringToFront($(this).data('object'));
	});
	reloadData();
}

function reloadData(){
	var objects = c.getObjects();
	var lis = $($( "#object_layers li" ).get().reverse());
	for(var i in objects){
		if(objects[i] !== undefined){
			$(lis.get(i)).data('object',objects[i]);
		}
	}
	c.selection = false;
}
	


c.observe('object:modified', function(e) {
	reloadThumbs(e.target);
});

c.observe('object:selected', function(e) {
	var so = e.target;
    var index = getIndex(so);
		
		if(so.type =="image"){
			 $('.ot').attr('disabled','disabled').val("");
			 $('.oi').removeAttr('disabled');
		}else if(so.type =="text"){
			 
			
			 $('.oi').attr('disabled','disabled');
			 $('.ot').removeAttr('disabled');
			 var fi = so.toObject();
			 var fc = so.getFill();
			 
			 if(start && fi.text =='Click here to start'){ c.clear(); reloadThumbs(); start = false;}

			 $('#text_text').val((fi.text));
			 $('#text_color').val(fc.toUpperCase());
			 $('#text_font').val(fi.fontFamily);
		}
		
});

c.observe('selection:cleared', function(e) {
	$('.ot').val("").attr('disabled','disabled');
	$('.oi').val("").attr('disabled','disabled');
});
var cropObject = null;
var actObj;
$('#image_crop').click(function(){
	$(this).attr('disabled','disabled');
	$('#toolbar-main .btn, #toolbar-download .btn, #image_fliph, #image_flipv').attr('disabled','disabled');
	$("#object_layers").sortable('disable');
	actObj = c.getActiveObject();
	cropStart();

	return false;
});
$('.predefined-text').click(function(){
    var textObj = new fabric.Text($(this).attr('data-text'), {
        fontFamily: 'Tiki Island',
        left: 425,
        top: 150,
        fontSize: 60,
        textAlign: "center",
        fill:"#FFFFFF",
        textShadow: 'rgba(0,0,0,0.3) 2px 2px 10px',
    });
    textObj.setActive(true);
    c.add(textObj);
    reloadThumbs(); 
});
$('.predefined-image').click(function(){
    var dataURL = $(this).attr('src');
    fabric.Image.fromURL(dataURL, function(oImg) {
        if (oImg.getWidth() > 800) {
            oImg.scaleToWidth(800);
        }
        if (oImg.getHeight() > 400) {
            oImg.scaleToHeight(400);
        }
        c.add(oImg);
        oImg.setActive(true);
        c.centerObjectH(oImg).centerObjectV(oImg);
        oImg.setCoords();
        c.renderAll();
        var image = $('<image width="120" height="55" />').attr('src',dataURL);
        $( "<li/>" ).prependTo( "#object_layers" ).append(image);
        reloadThumbs();
    }); 
});
function cropStart(){
	cropping = true;

	c.forEachObject(function(obj) {
		obj.selectable = false;
	});

	var activeObject = actObj;
	var d = {left:450,top:150,width:300,height:200};


	cropObject = new Crop({ left: d.left, top: d.top, fill: 'rgba(255,255,255,0)', width: d.width, height: d.height });
	c.add(cropObject);

	c.deactivateAll();

	cropObject.selectable = true;
	c.setActiveObject(cropObject);
	c.bringToFront(cropObject);
	
	c.renderAll();

	$('#crop_control').show();
}
function crop(){
	var w = cropObject.width*cropObject.scaleX;
	var h = cropObject.height*cropObject.scaleY;
	var x = cropObject.left-w/2;
	var y = cropObject.top-h/2;

	var activeObject = actObj;
	
	activeObject.clone(function(object){
		var el = fabric.document.createElement('canvas');

		if (!el.getContext && typeof G_vmlCanvasManager != 'undefined') {
			G_vmlCanvasManager.initElement(el);
		}
		
		el.width = w;
		el.height = h;

		fabric.util.wrapElement(el, 'div');

		var _c = new fabric.Canvas(el);
		_c.backgroundColor = 'transparent';
		object.setOpacity(1);

		_c.add(object);

		object.left -= x;
		object.top -= y;

		_c.renderAll();

		var dataurl = _c.toDataURL();

		var element = $('<img src='+dataurl+' />').get(0);


		activeObject.scaleX = 1;
		activeObject.scaleY = 1;
		activeObject.setElement(element);
		activeObject.width = w;
		activeObject.height = h;
		activeObject.setAngle(0);

		c.setActiveObject(activeObject);
		c.renderAll();
		
		setTimeout(function(){
				c.renderAll();
				reloadThumbs(activeObject);
    },100);
		reloadThumbs();
	});
	cropFinish();
}
function cropFinish(){
	$('#crop_control').hide();
	$('#toolbar-main .btn, #toolbar-download .btn, #image_fliph, #image_flipv').removeAttr('disabled');
	$("#object_layers").sortable('enable');
	cropping = false;
	c.remove(cropObject);
	cropObject = null;
}
$('#crop_ok').click(function(){
	crop();
	c.forEachObject(function(obj) {
		obj.selectable = true;
	});
});
$('#crop_cancel').click(function(){
	cropping = false;
	cropFinish();
	c.setActiveObject(actObj);
	c.forEachObject(function(obj) {
		obj.selectable = true;
	});
	return false;
});
