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
        'width' => 160,
        'height' => 160,
        'x' => 27,
        'y' => 197,
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
    $filename_profile = generatePicture($filename, 'profile', $picture_data);
    $filename_cover = generatePicture($filename, 'cover', $picture_data);
    $destination = 'files/facebook_pictures_' . uniqid() . '.zip';
    $files = array($filename_profile, $filename_cover);
    if(!create_zip($files, $destination, TRUE)){
        die('Error creando el zip');
    }
    else{
        setZipHeaders($destination);
        readFile($destination);
    }

}
else{
    die('Error');
}

// Output the actual image data
/*
 *echo $content;
 *die;
 */
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
    if($type == 'profile'){
        $result = $image->resizeImage(180, 180, Imagick::FILTER_LANCZOS, 1);
        if(!$result){
            die('Error haciendo resize');
        }
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

function setZipHeaders($filename){
    // Output the correct HTTP headers (may add more if you require them)
    // fix for IE catching or PHP bug issue
    header("Pragma: public");
    header("Expires: 0"); // set expiration time
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
    // browser must download file from server instead of cache

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
/* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {
    //if the zip file already exists and overwrite is false, return false
    if(file_exists($destination) && !$overwrite) {
error_log('DIE 3');
        return false;
    }
    //vars
    $valid_files = array();
    //if files were passed in...
    if(is_array($files)) {
        //cycle through each file
        foreach($files as $file) {
            //make sure the file exists
            if(file_exists($file)) {
                $valid_files[] = $file;
            }
        }
    }
    //if we have good files...
    if(count($valid_files)) {
        //create the archive
        $zip = new ZipArchive();
        if ($zip->open($destination, $overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
error_log('DIE 1');
            return false;
        }
        //add the files
        foreach($valid_files as $file) {
            $zip->addFile($file,$file);
        }
        //debug
        //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

        //close the zip -- done!
        $zip->close();

        //check to make sure the file exists
        return file_exists($destination);
    }
    else
    {
error_log('DIE 2');
        return false;
    }
}

?>
