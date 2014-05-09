<?php
$imgstr = $_POST['img'];
$type = $_POST['type'];
$set = $_POST['set'];
// Grab the MIME type and the data with a regex for convenience
if (!preg_match('/data:([^;]*);base64,(.*)/', $imgstr, $matches)) {
    die("error");
}

// Decode the data
$content = base64_decode($matches[2]);
$picture_data = array(
    'profile' => array(
        'width' => 180,
        'height' => 180,
        'x' => 8,
        'y' => 170,
    ),
    'cover' => array(
        'width' => 851,
        'height' => 315,
        'x' => 0,
        'y' => 0,
    ),
);
$filename = uniqid();
$result = file_put_contents('files/' . $filename, $content);
if($result){
if($type == 'profile'){
    $filename = generatePicture($filename, $type, $picture_data);
    setPictureHeaders($filename);
    readFile($filename);
}
elseif($type == 'cover'){
    $filename = generatePicture($filename, $type, $picture_data);
    setPictureHeaders($filename);
    readFile($filename);
}
elseif($type == 'all'){
}
else{
    die('Error');
}

// Output the actual image data
echo $content;
die;
}
else{
    die('Error de escritura en archivo temporal');
}
function generatePicture($filename, $type, $picture_data){
    $image = new Imagick('files/' . $filename);
    $x = $picture_data[$type]['x'];
    $y = $picture_data[$type]['y'];
    $width = $picture_data[$type]['width'];
    $height = $picture_data[$type]['height'];
    $result = $image->cropImage($width, $height, $x, $y);
    if(!$result){
        die('Error haciendo el crop');
    }
    $filename = 'files/' . $type . '-' . $filename . '.png';
    $result_write = $image->writeImage('png:' . $filename);
    if(!$result_write){
        die('Error guardando nueva imagen');
    }
    return $filename;
}

function setPictureHeaders($filename){
    // Output the correct HTTP headers (may add more if you require them)
    // fix for IE catching or PHP bug issue
    header("Pragma: public");
    header("Expires: 0"); // set expiration time
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
    // browser must download file from server instead of cache

    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($filename));
    // force download dialog
    header("Content-Type: application/force-download");
    header("Content-Type: application/octet-stream");
    header("Content-Type: application/download");

    // use the Content-Disposition header to supply a recommended filename and 
    // force the browser to display the save dialog. 
    header("Content-Disposition: attachment; filename=$filename;");
    header("Content-Transfer-Encoding: binary");
}

?>
