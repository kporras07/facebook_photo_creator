var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP.lineTo) {
    CP.dashedLine = function(x, y, x2, y2, da) {
        if (!da) da = [10,5];
        this.save();
        var dx = (x2-x), dy = (y2-y);
        var len = Math.sqrt(dx*dx + dy*dy);
        var rot = Math.atan2(dy, dx);
        this.translate(x, y);
        this.moveTo(0, 0);
        this.rotate(rot);       
        var dc = da.length;
        var di = 0, draw = true;
        x = 0;
        while (len > x) {
            x += da[di++ % dc];
            if (x > len) x = len;
            draw ? this.lineTo(x, 0): this.moveTo(x, 0);
            draw = !draw;
        }       
        this.restore();
    }
}

$(function() {
	
	
	var customSelection = {
		/*borderColor: 'rgba(0,0,0,0.3)',
		cornerColor: 'rgba(0,0,0,0.6)',
		cornersize: 10*/
	};
	
	var fontDefinitions = {
		'Myriad_Pro':                   120,
		'Capitalist':                   70,
		'Times_New_Roman':              110,
		'Delicious_500': 	0,
		'CA_BND_Web_Bold_700': 70,
		'Quake_Cyr': 60,
		'OdessaScript_500': 160,
		'CrashCTT_400': 70,
		'DejaVu_Serif_400': 70,
		'Encient_German_Gothic_400': 70,
		'Globus_500': 70,
		'Modernist_One_400': 70,
		'Tallys_400': 70,
		'Terminator_Cyr': 30,
		'Vampire95': 100
	};

	var fontNames = [     
       'Arial',
       'Georgia',
       'Helvetica',
       'Impact',
       'Tahoma',
       'Delicious',        //0
       'Quake',            //1
       'OdessaScript',     //2
       'CA BND Web Bold',  //3
       'CrashCTT',         //4
       'DejaVu Serif',     //5
       'Encient German Gothic',//6
       'Globus',           //7
       'Modernist One',    //8
       'Tallys',           //9
       'Terminator',       //10
       'Times New Roman',      //11
       'Vampire'             //12
       ];
	
	var font = [    
       'Arial',
       'Georgia',
       'Helvetica',
       'Impact',
       'Tahoma',
       'Delicious_500',        //0
       'Quake_Cyr',            //1
       'OdessaScript_500',     //2
       'CA_BND_Web_Bold_700',  //3
       'CrashCTT_400',         //4
       'DejaVu_Serif_400',     //5
       'Encient_German_Gothic_400',//6
       'Globus_500',           //7
       'Modernist_One_400',    //8
       'Tallys_400',           //9
       'Terminator_Cyr',       //10
       'Times_New_Roman',      //11
       'Vampire95'             //12
       ];

   for (var prop in fontDefinitions) {
		if (Cufon.fonts[prop.toLowerCase()]) {
			Cufon.fonts[prop.toLowerCase()].offsetLeft = fontDefinitions[prop];
		}
   }

   var canvas = new fabric.Canvas('c');

   //$('.canvas-container').css('position','absolute');

	/*
	* UTILS
	*/

	function getIndex(object){
		var objects = canvas.getObjects();
		for(var i in objects){
			if(objects[i]==object){
				return i;
			}
		}
	}

	function getFontIndex(fontName){
		for(var i in font){
			if(font[i] == fontName){
				return i;
			}
			
		}
		return null;
	}

	/*
	* EVENT CALLBACKS
	*/

	function reloadLayers(){
		$($("#sortable li").get().reverse()).each(function(){
			if($(this).data('object') !== undefined) canvas.bringToFront($(this).data('object'));
		});
		reloadData();
	}
	
	function reloadData(){
		var objects = canvas.getObjects();
		var lis = $($( "#sortable li" ).get().reverse());
		for(var i in objects){
			if(objects[i] !== undefined){
				$(lis.get(i)).data('object',objects[i]);
			}
		}
	}
	
	function reloadThumbs(object){
		
    if(!cropping){
  		var lis = $($( "#sortable li" ).get().reverse());
  		
  		if(object){
  			var objects = [];
  			var index = getIndex(object);
  			objects[index] = object;
  		}else{
  			var objects = canvas.getObjects();
  			var dataURL = '';
  			if(objects.length !== lis.length){
  				$("#sortable").empty();
  				for(var i=0;i<objects.length;i++){
  					var image = $('<image width="120" height="71" />').attr('src',dataURL);
  					$( "<li/>" ).prependTo( "#sortable" ).append(image);
  				}
  				lis = $($( "#sortable li" ).get().reverse());
  			}
  		}


  		for(i in objects){
        
  			if(objects[i] !== undefined){
  				
  				var el = fabric.document.createElement('canvas');
  				
  				if (!el.getContext && typeof G_vmlCanvasManager != 'undefined') {
  					G_vmlCanvasManager.initElement(el);
  				}
  				
  				el.width = $('#c').width();
  				el.height = $('#c').height();

  				fabric.util.wrapElement(el, 'div');

  				var _canvas = new fabric.Canvas(el);
  				_canvas.backgroundColor = 'transparent';
  				
          var active = objects[i].isActive();
  				
          objects[i].setActive(false);
          objects[i].selectable = false;

  				_canvas.add(objects[i]);
  				_canvas.renderAll();

  				//var dataURL = _canvas.toDataURL('png');
  				var dataURL = _canvas.toDataURLWithMultiplier('png',0.14101058);

          

  				if(active){
             
             objects[i].setActive(true);
             objects[i].selectable = true;

          }

  				_canvas.dispose();
  				_canvas = null;

  				$(lis.get(i)).find('img').attr('src',dataURL);
  			}
  		}
  		reloadData();
    }

	}



	 /*
     * INIT
     */
     var history = [];

    function init(){

     	canvas.setOverlayImage('css/foreground-page.png', canvas.renderAll.bind(canvas));
     	canvas.selection = false;


     	canvas.freeDrawingLineWidth = 5;


     	$("#sortable").sortable({axis:'y', change: function(event, ui) { 
     		//setTimeout(function(){reloadLayers();},100);
     	},deactivate:function(event,ui){
     		if(!cropping){
          setTimeout(function(){reloadLayers();},100);
        }
     	}});

     	$('#sortable').bind('mousedown',function(e){
			 if(!cropping){
        var $target = $(e.target);
  			
  			if($target.is("li") || $target.is("img")){
  				if(!$target.is("li")) $target = $target.parent("li");
  				if(!$target.data('object')) reloadData();

  				//canvas.deactivateAllWithDispatch();
  				canvas.setActiveObject($target.data('object'));


          canvas.forEachObject(function(obj) {
            obj.selectable = false;
          });

          $target.data('object').selectable = true;


  			}
        
      }
  			return true;


		});

		//$( "#container,#app,#app,#social,#header,.colorpicker *,.colorpicker" ).disableSelection();
		$( "#app,#app-menu,#social,#header,.colorpicker *,.colorpicker" ).disableSelection();
     	canvas.backgroundColor = '#3f5992';

     	$('#backgroundColor').ColorPicker({
     		color: '#3f5992',
     		onShow: function (colpkr) {
     			$(colpkr).stop().fadeTo(300,1);
     			return false;
     		},
     		onHide: function (colpkr) {
     			$(colpkr).stop().fadeTo(300,0,function(){
     				$(colpkr).hide();
     			});

     			return false;
     		},
     		onChange: function (hsb, hex, rgb) {
     			$('#backgroundColor div').css('backgroundColor', '#' + hex);
     			canvas.backgroundColor = '#'+hex;
  				canvas.renderAll();
  				
  			}
  		});
  		$('#backgroundColor div').css('backgroundColor', '#3f5992');


  		$('#text-color').ColorPicker({
     		color: '#FFFFFF',
     		onShow: function (colpkr) {
     			$(colpkr).stop().fadeTo(300,1);
     			return false;
     		},
     		onHide: function (colpkr) {
     			$(colpkr).stop().fadeTo(300,0,function(){
     				$(colpkr).hide();
     				var activeObject = canvas.getActiveObject();
     				if(activeObject !== null){

     					pushHistoryState(activeObject);
     					reloadThumbs(activeObject);

     				}else{
     					if($(this).data('modified')){
     						activeObject =$ (this).data('activeObject');
     						if(activeObject !== null){
     							pushHistoryState(activeObject);
     							reloadThumbs(activeObject);
     						}
     					}else{
     						reloadThumbs();
     					}
     					
     				}
     				
     			});
     			$(this).data('modified',false);
     			return false;
     		},
     		onChange: function (hsb, hex, rgb) {
     			$('#text-color div').css('backgroundColor', '#' + hex);
     			var activeObject = canvas.getActiveObject();
  				if(activeObject !== null && activeObject.type == "text"){
  					activeObject.setColor('#'+hex);
  					canvas.renderAll();
  					$(this).data('activeObject',activeObject);
  					$(this).data('modified',true);
  				}
  				
  			}
  		});


     	$('.alpha-slider').slider({
			min: 0,
			max: 1,
			step: 0.05,
  			slide: function(event, ui) {
  				var activeObject = canvas.getActiveObject();
  				if(activeObject !== null){
  					activeObject.setOpacity(ui.value);
  					canvas.renderAll();
  					$(this).data('modified',true);
  				}

  			},
  			change: function(event, ui) {
  				var activeObject = canvas.getActiveObject();
				if(activeObject !== null && $(this).data('modified')){
					pushHistoryState(activeObject);
					reloadThumbs(activeObject);
				}
				$(this).data('modified',false);
  				
  			}
  		});


  		$('#text-color div').css('backgroundColor', '#FFFFFF');

  		$('#text-controls').hide();
  		$('#image-controls').hide();

  		$('#addText').click(function(){
        if(!cropping){
      			var textObj = new fabric.Text('Text', { 
    	      		fontFamily: font[3], 
    	      		left: 425,
    	      		top: 150,
    	      		fontSize: 60,
    	      		textAlign: "center",
    	      		fill:"#FFFFFF",
    	      		textShadow: 'rgba(0,0,0,0.2) 2px 2px 10px',
    	      	});
    	      	textObj.set(customSelection);
              ////fabric.util.makeElementUnselectable(textObj);


              textObj.setActive(true);


    	      	canvas.add(textObj);
              

    	      	//created new object (add to history?)

    			reloadThumbs();
        }
  			return false;
  		});

  		$('#drawingMode').click(function(){
        if(!cropping){
    			canvas.isDrawingMode = !canvas.isDrawingMode;
    			if(canvas.isDrawingMode){
  				$('#app-main')
  				$(this).addClass('disabled');
    			}else{

    				$(this).removeClass('disabled');
    			}
        }

  			return false;
  		});

  		$('#image-fliph').click(function(){
  			var activeObject = canvas.getActiveObject();

  			if(activeObject !== null){
  				activeObject.flipX = !activeObject.flipX;
				canvas.renderAll();

				pushHistoryState(activeObject);
  				reloadThumbs(activeObject);
  			}

  			return false;
  		});

  		$('#image-flipv').click(function(){
  			var activeObject = canvas.getActiveObject();

  			if(activeObject !== null){
  				activeObject.flipY = !activeObject.flipY;
  				canvas.renderAll();

  				pushHistoryState(activeObject);
  				reloadThumbs(activeObject);
  			}

  			return false;
  		});

  		$('#text-bold,#text-italic,#text-underline,#text-linethrough,#text-overline,#text-shadow').click(function(){
  			var activeObject = canvas.getActiveObject();

  			if(activeObject !== null && activeObject.type == "text"){

  				var $this = $(this);

  				if($this.is("#text-bold")){
  					activeObject.fontWeight = (activeObject.fontWeight == 500)?100:500;
  					//console.log(activeObject.fontWeight);
  				}else if($this.is("#text-italic")){
  					activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
  				}else if($this.is("#text-underline")){
  					activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
  					$('#text-linethrough,#text-overline').removeClass('disabled');
  				}else if($this.is("#text-linethrough")){
  					activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
  					$('#text-underline,#text-overline').removeClass('disabled');
  				}else if($this.is("#text-overline")){
  					activeObject.textDecoration = (activeObject.textDecoration == 'overline' ? '' : 'overline');
  					$('#text-underline,#text-linethrough').removeClass('disabled');
  				}else if($this.is("#text-shadow")){
  					activeObject.textShadow = !activeObject.textShadow ? 'rgba(0,0,0,0.2) 2px 2px 10px' : '';
  				}
  				$this.toggleClass('disabled');
	  			canvas.renderAll();

	  			pushHistoryState(activeObject);
	  			reloadThumbs(activeObject);
	  		}
  			return false;
  		});
      
      $('#image-rotate').click(function(){
        var activeObject = canvas.getActiveObject();

        if(activeObject !== null){
          var angle = activeObject.getAngle()+90;  
          activeObject.setAngle(angle);
          canvas.renderAll();
        }

        return false;
      });

  		$('#text-family').empty();
  		$('#text-family').change(function(e){
  			var activeObject = canvas.getActiveObject();
  			if(activeObject !== null && activeObject.type == "text"){
  				var fontId = $(this).find("option:selected").val();
  				activeObject.set({fontFamily:font[fontId]});
  				canvas.renderAll();

  				pushHistoryState(activeObject);
  				reloadThumbs(activeObject);
  			}
		});

		for(var i in fontNames){
  			var option = $('<option value="'+i+'">'+fontNames[i]+'</option>');

  			$('#text-family').append(option);

  		}

		$('#text-text').bind('keyup change',function(){
			var activeObject = canvas.getActiveObject();
			//console.log(activeObject);
  			if(activeObject !== null){
  				var text = $(this).val();
  				activeObject.setText(text);
  				canvas.renderAll();

  				pushHistoryState(activeObject);
  				reloadThumbs(activeObject);
  			}
			
			
		});

		$('#text-reset,#image-reset').click(function(){
			var activeObject = canvas.getActiveObject();
  			if(activeObject !== null){
  				canvas.straightenObject(activeObject);
  				activeObject.scale(1);
  				canvas.renderAll();

  				pushHistoryState(activeObject);
  				reloadThumbs(activeObject);
  			}
		});

		//$('#text-color')


		$('#download-cover,#download-profile,#download-thumb1,#download-thumb2,#download-thumb3,#download-all').click(function(){
			var $this = $(this);

			var activeObject = canvas.getActiveObject();
			if(activeObject) activeObject.setActive(false);

			if($this.is('#download-cover')){
				$('#form-part').val('cover');
			}else if($this.is('#download-profile')){
				$('#form-part').val('profile');
			}else if($this.is('#download-thumb1')){
				$('#form-part').val('thumb1');
			}else if($this.is('#download-thumb2')){
				//console.log('thumb2');
				$('#form-part').val('thumb2');
			}else if($this.is('#download-thumb3')){
				$('#form-part').val('thumb3');
			}else{
				$('#form-part').val('all');
			}

			var overlayImage = canvas.overlayImage;
			canvas.overlayImage = null;
			$('#form-image').val(canvas.toDataURL('png'));
			if(activeObject) activeObject.setActive(true);

			canvas.overlayImage = overlayImage;
			canvas.renderAll();

			$('#download-form').submit();


		});

    $('#save').click(function(){
        $('#save-data').val(JSON.stringify(canvas));
        $('#save-form').submit();
    });



     	$('#container').mousedown(function(e){
     		var $target = $(e.target);
     		//console.log($target);


        if(cropping && cropObject){

          cropObject.setActive(true);
          canvas.renderAll();
        }else 
     		if(!$target.is('.upper-canvas,#app-menu img,#app-menu li,#social,#toolbar *oji,#text-controls,#image-controls,#text-controls *,#image-controls *')){
     			//console.log($target);
     			canvas.deactivateAllWithDispatch();
     			canvas.renderAll();
     		}

        


     	});

		canvas.observe('path:created', function() {
			canvas.isDrawingMode = false;
			$('#drawingMode').removeClass('disabled');
			reloadThumbs();
		});

     	canvas.observe('object:selected',function(e){
     		
        if(!cropping){

          //console.log(e);
       		var activeObject = e.target;

       		var index = getIndex(activeObject);
       		var lis = $($( "#sortable li" ).get().reverse());

       		lis.removeClass('current');
       		$(lis[index]).addClass('current');



       		if(activeObject !== undefined || activeObject !== null){

       			if(activeObject.type == "text"){
  	     			//console.log(activeObject);

  	     			$('#text-controls .alpha-slider').slider( "value" , activeObject.get('opacity'));

  	     			$('#text-text').val(activeObject.text);
  	     			$('#text-family').val(getFontIndex(activeObject.fontFamily));
  	     			
  	     			if(activeObject.fontWeight == 500) $("#text-bold").addClass('disabled');
  	     			else $("#text-bold").removeClass('disabled');

  	     			if(activeObject.fontStyle == 'italic') $("#text-italic").addClass('disabled');
  	     			else $("#text-italic").removeClass('disabled');

  	     			if(activeObject.textDecoration == 'underline') $("#text-underline").addClass('disabled');
  	     			else $("#text-underline").removeClass('disabled');

  	     			if(activeObject.textDecoration == 'line-through') $("#text-linethrough").addClass('disabled');
  	     			else $("#text-linethrough").removeClass('disabled');

  	     			if(activeObject.textDecoration == 'overline') $("#text-overline").addClass('disabled');
  	     			else $("#text-overline").removeClass('disabled');

  	     			if(activeObject.textShadow) $("#text-shadow").addClass('disabled');
  	     			else $("#text-shadow").removeClass('disabled');

  	     			
  	     			//console.log(activeObject.get('fill'));

  	     			$('#text-color').ColorPickerSetColor(activeObject.get('fill'));
  	     			$('#text-controls').stop().slideDown('fast');
  	     			$('#text-controls').css('z-index',1000);




  	     		}else{
  	     			$('#text-controls').stop().slideUp('fast');
  	     			$('#text-controls').css('z-index',1);
  	     		}

  	     		if(activeObject !== null && activeObject.type == "image"){
  	     			
  	     			$('#image-controls .alpha-slider').slider( "value" , activeObject.get('opacity'));
  	     			$('#image-controls').stop().slideDown('fast');
  	     			$('#image-controls').css('z-index',1000);

  	     		}else{
  	     			$('#image-controls').stop().slideUp('fast');
  	     			$('#image-controls').css('z-index',1);
  	     		}
  	     	}
        }
     	});
      
      function hideControls(){
        $('#text-controls').stop().slideUp('fast');
        $('#text-controls').css('z-index',1);
        $('#image-controls').stop().slideUp('fast');
        $('#image-controls').css('z-index',1);
      }

     	canvas.observe('selection:cleared',function(e){


        //console.log(cropping,cropObject);
        if(cropping && cropObject){

          cropObject.setActive(true);
          canvas.renderTop();

        }else{

       		$( "#sortable li" ).removeClass('current');

        }
        hideControls();
     	});

     	function pushHistoryState(target){
     		var activeObject = target;
     		if(activeObject){
     			if(history.length > 50) history.shift();
     			history.push([activeObject,activeObject.originalState]);
     			
     		}
     		
     		//console.log('modified');
     		
     	}

     	canvas.observe('object:modified', function(e) {
     		pushHistoryState(e.target);
     		reloadThumbs(e.target);
     	});

     	$('.button-undo').click(function(){
        if(!cropping){
    			var data = history.pop();
    			if(data){
    				var object = data[0];
    				var props = data[1];

    				object.setOptions(props);
    				canvas.renderAll();
    				reloadThumbs(object);
    			
    			}
        }
  			return false;
    	});


		$('.btn[title],#backgroundColor,#text-family,#text-color,#text-text,.alpha-slider').qtip({
	      content: {
	         text: false // Use each elements title attribute
	      },
	      style: {
	      	name:'blue',
	      	background: '#3f5992',
	      	color:'#FFF',
	      	padding:0,
	      	border:{
	      		color:'#3f5992',
	      		width:0,
	      		radius: 5
	      	}
	      },
	      "margin-bottom":'5px',
	      	 // Give it some style
	      position: {
		      corner: {
		         target: 'topMiddle',
		         tooltip: 'bottomMiddle'
		      }
		   }
	   });

     	

     	$('#upload').fileupload({
     		add:function (e, data) {
          if(!cropping){
            if (typeof FileReader !== "undefined"){
       			$(data.files).each(function(i){

       				var file = this;
              var isJSON = (file.name.substr(-5) == '.tlsp' || file.name.substr(-5) == '.json');

       				var fileReader = new FileReader();

       				fileReader.onload = function(e) {

       					var dataURL = e.target.result;
               

                if(isJSON){
                 
                  canvas.loadFromJSON(dataURL,function(){
                    canvas.renderAll();
                    reloadThumbs();
                  });
                  
                  /*fabric.parseSVGDocument(dataURL,function(data){
                    console.log(data);
                  });*/
                  /*fabric.loadSVGFromString(dataURL,function(objects,options){
                     var loadedObject;
                     console.log(objects);
                      if (objects.length > 1) {
                        loadedObject = new fabric.PathGroup(objects, options);
                      } else {
                        loadedObject = objects[0];
                      }
                      
                      canvas.add(loadedObject);

                      canvas.renderAll();

                    reloadThumbs();

                  });*/

                }else{
                  fabric.Image.fromURL(dataURL, function(oImg) {

                    canvas.add(oImg);

                    var image = $('<image width="120" height="71" />').attr('src',dataURL);
                    $( "<li/>" ).prependTo( "#sortable" ).append(image);

                    oImg.set(customSelection);

                    if (oImg.getWidth() > 850) {
                      oImg.scaleToWidth(850);
                    }

                    if (oImg.getHeight() > 500) {
                      oImg.scaleToHeight(500);
                    }

                    ///fabric.util.makeElementUnselectable(oImg);

                    canvas.forEachObject(function(obj) {
                      obj.selectable = false;
                    });

                    oImg.selectable = true;
                    oImg.setActive(true);

                    canvas.centerObjectH(oImg).centerObjectV(oImg);
                    oImg.setCoords();
                    canvas.renderAll();



                    reloadThumbs();

                  });
                }


       					



       				};
              if(isJSON){
                fileReader.readAsText(file);
              }else{
         				fileReader.readAsDataURL(file);
              }
         			});

         			canvas.deactivateAllWithDispatch();
            }else{
                data.submit();
            }
         }


     		},
     		progress: function (e, data) {
     			var progress = parseInt(data.loaded / data.total * 100, 10);
     		},
     		dataType: 'json',
        done: function (e, data) {
            //console.log(data);
            $.each(data.result, function (index, file) {
               if(file!==null && file.contents !== null){

                  var filename = file.name;

                  var dataURL = file.contents;

                  var isJSON = (filename.substr(-5) == '.tlsp' || filename.substr(-5) == '.json');

                  if(isJSON){
                    canvas.loadFromJSON(dataURL);
                  }else{
                   fabric.Image.fromURL(dataURL, function(oImg) {

                    canvas.add(oImg);

                    var image = $('<image width="120" height="71" />').attr('src',dataURL);
                    $( "<li/>" ).prependTo( "#sortable" ).append(image);

                    oImg.set(customSelection);

                    if (oImg.getWidth() > 850) {
                      oImg.scaleToWidth(850);
                    }

                    if (oImg.getHeight() > 500) {
                      oImg.scaleToHeight(500);
                    }

                    ////fabric.util.makeElementUnselectable(oImg);

                     canvas.forEachObject(function(obj) {
                      obj.selectable = false;
                    });


                    oImg.selectable = true;
                    oImg.setActive(true);

                    canvas.centerObjectH(oImg).centerObjectV(oImg);
                    oImg.setCoords();
                    canvas.renderAll();

                    reloadThumbs();

                  });
                }
               }
            });
        },
     		fail: function (e, data) {
     			alert('an Error has ocurred, please try again');
     		},
     		acceptFileTypes: /\.(gif|jpe?g|png)$/i
     		,fileInput:$('#upload,#toolbar-upload')
     	});



		$(document).keydown(function(e) {
      if(!$('#text-text').is(":focus") && !$('input').is(":focus")){
        //console.log(e.which);
        if(e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40){
          var activeObject = canvas.getActiveObject();
          if(activeObject){

            if(e.which == 37){ //left
              activeObject.left -= 5;
            }else if(e.which == 38){//up
              activeObject.top -= 5;
            }else if(e.which == 39){//right
              activeObject.left += 5;
            }else if(e.which == 40){//down
              activeObject.top += 5;
            }

            canvas.renderAll();

            return false;
          }
              
  			}else if(e.which == 46 || e.which == 8){

          
           removeActive();
          

  				return false;
  			}
      }

		});

    function removeActive(){
      if(!cropping){
        var activeObject = canvas.getActiveObject();
        var current = $('#sortable li.current');
        if(activeObject){ 
          canvas.remove(activeObject);
          current.remove();
        } 
      }



    }

    $('.button-remove').click(function(){

      hideControls();
      removeActive();

      return false;
    });



		/*$('#remove-all').click(function(){

      canvas.dispose();
      reloadThumbs();

      return false;
    });*/



		/*
  		* DEFAULTS
  		*/

  		//fabric.Image.fromURL('css/demobg.jpg', function(obj) {

    	 //  obj.set({left: 425, top: 250});
    	 //  canvas.add(obj);

    	   /*var circle = new fabric.Circle({ radius: 90, fill: '#f55', top: 100, left: 100 });
	      	circle.set(customSelection);
	      	canvas.add(circle);*/
	      	
      	var textObj = new fabric.Text('Drop an image here', { 
      		fontFamily: font[3], 
      		left: 425,
      		top: 150,
      		fontSize: 60,
      		textAlign: "center",
      		fill:"#FFFFFF",
      		textShadow: 'rgba(0,0,0,0.2) 2px 2px 10px',
      		fontStyle: 'italic'
      	});

      	textObj.setAngle(-5);

      	textObj.set(customSelection);
      	//textObj.scale(0.7);

        
      	canvas.add(textObj);

       textObj.setActive(true);

      	canvas.renderAll();

      	reloadThumbs();

        var c = {"x":13,"y":7,"x2":487,"y2":107,"w":474,"h":100};

      /*$('#c').Jcrop({
        bgFade: true,
        //setSelect: [c.x,c.y,c.x2,c.y2]
      });*/
      
      $('#image-crop').click(function(){

        cropStart();

        return false;
      });


      var cropObject = null;

      function cropStart(){

        hideControls();

        cropping = true;

        $("#sortable").sortable("disable");

        canvas.forEachObject(function(obj) {
          obj.selectable = false;
        });

        var activeObject = canvas.getActiveObject();
        var d = {left:450,top:150,width:300,height:200};

       /* if(activeObject){
          d.left = 
          d.left = (activeObject.left < 5)?activeObject.left:5;
          d.top = (activeObject.top < 5)?activeObject.top:5;
          d.width = (activeObject.width+activeObject.left > 845)?activeObject.width:845-activeObject.left;
          d.height = (activeObject.height+activeObject.top > 500)?activeObject.height:500-activeObject.top;
        }*/

        console.log(d);
        //add cropsides alpha black

        //console.log(cropObject);

        cropObject = new Crop({ left: d.left, top: d.top, fill: 'rgba(255,255,255,0)', width: d.width, height: d.height });
        canvas.add(cropObject);

        //cropObject.lockUniScaling = true;
        canvas.deactivateAll();

        cropObject.selectable = true;
        canvas.setActiveObject(cropObject);
        canvas.bringToFront(cropObject);
        
        canvas.renderAll();

        $('#crop-buttons').addClass('show');

      }

      function crop(){

        //
        var w = cropObject.width*cropObject.scaleX;
        var h = cropObject.height*cropObject.scaleY;
        var x = cropObject.left-w/2;
        var y = cropObject.top-h/2;

        var activeObject = $('#sortable .current').data('object');

        
        
        activeObject.clone(function(object){
          var el = fabric.document.createElement('canvas');

          if (!el.getContext && typeof G_vmlCanvasManager != 'undefined') {
            G_vmlCanvasManager.initElement(el);
          }
          
          el.width = w;
          el.height = h;

          fabric.util.wrapElement(el, 'div');

          var _canvas = new fabric.Canvas(el);
          _canvas.backgroundColor = 'transparent';

          object.setOpacity(1);

          _canvas.add(object);

          object.left -= x;
          object.top -= y;

           _canvas.renderAll();

          //var object = _canvas.toObject().objects[0];
          var dataurl = _canvas.toDataURL();

          //console.log(object);
          //if(object){
            var element = $('<img src='+dataurl+' />').get(0);
            //console.log(element);

            activeObject.scaleX = 1;
            activeObject.scaleY = 1;
            activeObject.setElement(element);
            activeObject.width = w;
            activeObject.height = h;
            activeObject.setAngle(0);
            //activeObject.setOpacity(1);

        // }
          //console.log(activeObject);

          //canvas.add(cobject.objects[0]);

          canvas.setActiveObject(activeObject);

         
          canvas.renderAll();

          setTimeout(function(){
            canvas.renderAll();
            reloadThumbs(activeObject);
          },100);

        });

        


        cropFinish();
      }
      


      function cropFinish(){
        $('#crop-buttons').removeClass('show');
        cropping = false;
        canvas.remove(cropObject);
        cropObject = null;
        $("#sortable").sortable("enable");
        


        /*////canvas.forEachObject(function(obj) {
          obj.selectable = true;



        });*/
      }

      $('#crop-crop').click(function(){
        crop();
        return false;
      });

      $('#crop-cancel').click(function(){
        cropFinish();
        setTimeout(function(){
          var activeObject = $('#sortable .current').data('object');
          canvas.setActiveObject(activeObject);
          canvas.renderAll();
          reloadThumbs(activeObject);
        },100);
        return false;
      });


      canvas.observe('mouse:move', function(e) {
        //console.log(e);
        //var p = canvas.getPointer(e.e);

      });

      canvas.observe('mouse:down', function(e) {
        if(cropping){

        }
      });

      canvas.observe('mouse:up', function(e) {
        
      });

     //cropStart();
   		//});

	}
  
  var Crop = fabric.util.createClass(fabric.Object, {

  type: 'crop',

  initialize: function(options) {
    this.callSuper('initialize', options);
    this.set(customSelection);
    this.borderColor = 'rgba(255,255,255,0.9)';
    this.borderScaleFactor = 1;
    this.lockRotation = true;
  },

  drawBorders: function(ctx) {
    
    var padding = this.padding,
        padding2 = padding * 2;

    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    ctx.strokeStyle = this.borderColor;

    var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
        scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);

    ctx.lineWidth = 1 / this.borderScaleFactor;

    ctx.scale(scaleX, scaleY);

    var w = this.getWidth(),
        h = this.getHeight();

    var x1 = ~~(-(w / 2) - padding) + 0.5;
    var x2 = ~~(w + padding2);
    var y1 = ~~(-(h / 2) - padding) + 0.5;
    var y2 = ~~(h + padding2);
    
    ctx.strokeRect(
      ~~(-(w / 2) - padding) + 0.5, // offset needed to make lines look sharper
      ~~(-(h / 2) - padding) + 0.5,
      ~~(w + padding2),
      ~~(h + padding2)
    );

    /*ctx.dashedLine(x1,y1,x2,y1,[30,10]);
    ctx.dashedLine(x2,y1,x2,y2,[30,10]);
    ctx.dashedLine(x2,y2,x1,y2,[30,10]);
    ctx.dashedLine(x1,y2,x1,y1,[30,10]);
*/
    ctx.restore();
    return this;
  },

  /*drawCorners: function(ctx) {

    
    this.callSuper('drawCorners', ctx);


  },*/
  drawCorners: function(ctx) {
      if (!this.hasControls) return;

      var size = this.cornersize,
          size2 = size / 2,
          padding = this.padding,
          left = -(this.width / 2),
          top = -(this.height / 2),
          _left,
          _top,
          sizeX = size / this.scaleX,
          sizeY = size / this.scaleY,
          scaleOffsetY = (padding + size2) / this.scaleY,
          scaleOffsetX = (padding + size2) / this.scaleX,
          scaleOffsetSizeX = (padding + size2 - size) / this.scaleX,
          scaleOffsetSizeY = (padding + size2 - size) / this.scaleY,
          height = this.height;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.fillStyle = this.cornerColor;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1;
      // top-left
      _left = left - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // top-right
      _left = left + this.width - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // bottom-left
      _left = left - scaleOffsetX;
      _top = top + height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // bottom-right
      _left = left + this.width + scaleOffsetSizeX;
      _top = top + height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // middle-top
      _left = left + this.width/2 - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // middle-bottom
      _left = left + this.width/2 - scaleOffsetX;
      _top = top + height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // middle-right
      _left = left + this.width + scaleOffsetSizeX;
      _top = top + height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      // middle-left
      _left = left - scaleOffsetX;
      _top = top + height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);
      ctx.strokeRect(_left, _top, sizeX, sizeY);

      ctx.restore();

      return this;
    },

  _render: function(ctx) {

    var cw,ch,hw,hh,x1,x2,x3,x4,y1,y2,y3,y4;



    cw = canvas.getWidth()/this.scaleX;
    ch = canvas.getHeight()/this.scaleY;
    hw = this.width/2;
    hh = this.height/2;

    ctx.fillStyle = "rgba(0,0,0,0.5)";

    x1 = -cw-hw;
    x2 = -hw;
    x3 = hw;
    x4 = cw+hw;

    y1 = -ch-hh;
    y2 = -hh;
    y3 = hh;
    y4 = ch+hh;

    /*


      x1   x2    x3    x4
  y1   .    .     .     .
    
  y2   .    +     +     .
               c
  y3   .    +     +     .

  y4   .    .     .     .
    

    */

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x4,y1);
    ctx.lineTo(x4,y2);
    ctx.lineTo(x1,y2);
    ctx.closePath();

    ctx.moveTo(x3,y1);
    ctx.lineTo(x4,y1);
    ctx.lineTo(x4,y4);
    ctx.lineTo(x3,y4);
    ctx.closePath();

    ctx.moveTo(x1,y3);
    ctx.lineTo(x4,y3);
    ctx.lineTo(x4,y4);
    ctx.lineTo(x1,y4);
    ctx.closePath();

    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y1);
    ctx.lineTo(x2,y4);
    ctx.lineTo(x1,y4);
    ctx.closePath();


    ctx.fill();


  }

  
});


  var cropping = false;

	init();

  $('#mode-page').click(function(){
    switchPageMode();
  });

  $('#mode-personal').click(function(){
    switchPersonalMode();
  });

  function switchPageMode(){
    $('#mode-page').addClass('active');
    $('#mode-personal').removeClass('active');
    $('#mode-field').val('page');
    canvas.setOverlayImage('css/foreground-page.png', canvas.renderAll.bind(canvas));
    $('#app-main').addClass('page');
    $('#app-main').removeClass('personal');

  }

  function switchPersonalMode(){
    $('#mode-personal').addClass('active');
    $('#mode-page').removeClass('active');
    $('#mode-field').val('personal');
    canvas.setOverlayImage('css/foreground-personal.png', canvas.renderAll.bind(canvas));
    $('#app-main').addClass('personal');
    $('#app-main').removeClass('page');
  }

  switchPageMode();





	/*canvas.clipTo = function(ctx) {
	  ctx.arc(0, 0, 300, 0, Math.PI*2, true);
	};*/

});