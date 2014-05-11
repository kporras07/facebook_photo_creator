<?php
$dir = 'default/images/';
$files = scandir($dir);
$images = array();
foreach($files as $file)
{
    if(is_file($dir.$file)){
        $image = $dir.$file;
        $image_data = base64_encode(file_get_contents($image));
        $dataUri = 'data: '.mime_content_type($image).';base64,'.$image_data;
        $images[] = $dataUri;
    }
}
$handle = fopen("default/strings.txt", "r");
$lines = array();
if ($handle) {
    while (($line = fgets($handle)) !== false) {
        $line = substr($line, 0, -1);
        $lines[] = $line;
    }
}
fclose($handle);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Facebook Image Editor</title>

    <!-- Styles -->
    <link href="css/styles.css" rel="stylesheet">
    <link href="css/minicolors.css" rel="stylesheet">

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">


    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
  <div class="main">
      <h1>Facebook cover and profile picture maker</h1>
      <div class="toolbars-set app_toolbar main-toolbars">
          <div id="toolbar-main" class="btn-toolbar" role="toolbar">
              <div id="add-buttons" class="btn-group">
                  <span class="btn btn-success glyphicon glyphicon-plus">
                      <input type="file" class="btn btn-file fileupload" id="fileupload" title="Agregar Imagen">
                  </span>
                  <span class="btn btn-success glyphicon glyphicon-plus" id="addtext">Agregar Texto</span>
                  <span id="save" class="btn btn-success glyphicon glyphicon-floppy-save">Guardar</span>
              </div>
              <div id="clear-buttons" class="btn-group">
                  <span id="remove" class="btn glyphicon glyphicon-trash btn-danger remove" description="Remover Seleccionado"></span>
                  <span>
                      <button title="Clear All" class="btn btn-danger clear-all" id="clear">Limpiar Todo</button>
                  </span>
              </div>
          </div>
          <div id="toolbar-text" class="btn-toolbar" role="toolbar">
              <span class="glyphicon glyphicon-th-large btn btn-default oi" id="image_crop" disabled="disabled">Recortar</span>
              <span class="glyphicon glyphicon-resize-horizontal btn btn-default oi ot" id="image_fliph"></span>
              <span class="glyphicon glyphicon-resize-vertical btn btn-default oi ot" id="image_flipv"></span>
              <span class="glyphicon glyphicon-bold btn tt ot btn-default" id="text_bold" disabled="disabled"></span>
              <span class="glyphicon glyphicon-italic btn tt ot btn-default" id="text_italic" disabled="disabled"></span>
              <span class="glyphicon glyphicon-underline btn tt ot btn-default" id="text_underline" disabled="disabled" style="font-family:'Times New Roman', Times; font-weight:bold;font-size:18px">U</span>
              <span class="glyphicon glyphicon-shadow btn tt ot btn-default" id="text_shadow" disabled="disabled">Sombra</span>
              <input type="text" size="12" class="tt ot input-text" name="color2" id="text_text" data-original-title="  Texto  " disabled="disabled">
              <select class="tt ot" name="" id="text_font" data-original-title="Font Family" disabled="disabled"> 
                  <option style="font-family:'Arial'">Arial</option>
                  <option style="font-family: 'Tahoma, Geneva, sans-serif'">Tahoma</option>
                  <option style="font-family:'Times New Roman'">Times New Roman</option>
                  <option style="font-family:'Georgia'">Georgia</option>
                  <option style="font-family:'Comic Sans MS'">Comic Sans MS</option>
                  <option style="font-family:'Courier New', Courier, monospace">Courier New</option>
                  <option style="font-family:'Tangerine'">Tangerine</option>
                  <option style="font-family:'Cantarell'">Cantarell</option>
                  <option style="font-family:'Reenie Beanie'">Reenie Beanie</option>
                  <option style="font-family:'Lobster'">Lobster</option>
                  <option style="font-family:'Finger Paint'">Finger Paint</option>
                  <option style="font-family:'Emblema One'">Emblema One</option>
                  <option style="font-family:'ECarrois Gothic SC'">Carrois Gothic SC</option>
                  <option style="font-family:'Eater'">Eater</option>
                  <option style="font-family:'Griggy'">Griffy</option>
                  <option style="font-family:'Ruge Boogie'">Ruge Boogie</option>
                  <option style="font-family:'Nosifer'">Nosifer</option>
              </select>
              <span>
                  <input type="text" id="text_color" size="7" class="color-picker black tt ot miniColors" name="color2" data-original-title="Text Color" maxlength="7" autocomplete="off" disabled="disabled">
              </span>
          </div>
      </div>
      <div class="preview_timeline">
          <div class="toolbars-set app_toolbar download-toolbar inner-cover_1">
              <h3 class="download-text">Descargar</h3>
              <div id="toolbar-download" class="btn-toolbar">
                  <div id="group-download" class="btn-group">
                      <span class="btn btn-primary glyphicon glyphicon-picture" id="d1">Portada</span>
                      <span class="btn btn-primary glyphicon glyphicon-user" id="d2">Perfil</span>
                      <span class="btn btn-primary glyphicon glyphicon-film" id="d3">Ambas</span>
                  </div>
              </div>
          </div>
          <div class="timeline_canvas">
              <canvas height="397" width="851" id="cc" class="lower-canvas" style="position: absolute; width: 851px; height: 397px; left: 0px; top: 0px; -moz-user-select: none;"></canvas>
          </div>
          <div id="crop_control">
              <button id="crop_ok" class="btn btn-primary tt glyphicon glyphicon-ok" type="button" data-original-title="Crop"></button>
              <button id="crop_cancel" class="btn btn-inverse tt glyphicon glyphicon-remove" type="button" data-original-title="Cancel"></button>
          </div>
          <div class="predefined-content">
            <h3 class="text-center">Haga click sobre una imagen o un texto para añadirlo al área de trabajo</h3>
              <div class="predefined-images">
<?php
foreach($images as $image){
    print '<img class="predefined-image" src="' . $image .'"/>';
}
?>
              </div>
              <div class="predefined-texts">
<?php
foreach($lines as $line){
        print '<span class="predefined-text" data-text="' . $line . '">' . $line . '</span>';
}
?>
              </div>
          </div>
          <div class="preview_wrap">
              <h3>Arrastre para ajustar las capas</h3>
              <ul id="object_layers" class="ui-sortable">
              </ul>
          </div>
      </div>
  </div>
    <form id="download" method="post" action="download.php">
        <input type="hidden" id="type" name="type">
        <input type="hidden" id="set" name="set">
        <input type="hidden" id="img" name="img">
    </form>
  <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="js/bootstrap.min.js"></script>
  <script src="js/bootstrap.file-input.js"></script>
  <!-- Include my scripts -->
  <script src="js/jquery.ui.widget.js" type="text/javascript"></script>
  <script src="js/jquery.iframe-transport.js" type="text/javascript"></script>
  <script src="js/jquery.fileupload.js" type="text/javascript"></script>
  <script src="js/fab.js"></script>
  <script src="js/minicolors.js"></script>
  <script src="js/scripts.js"></script>
  <script src="js/my-script.js"></script>
  </body>
  </html>

