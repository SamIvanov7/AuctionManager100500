<?php

header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Pragma: no-cache'); // HTTP/1.0
session_start();

$loc = preg_replace('/[^0-9]/', '', $_GET['loc']);

if ($loc != 1 && $loc != 2 && $loc != 3 && $loc != 4 && $loc != 5 && $loc != 6 && $loc != 7 && $loc != 8) {
	$loc = 3;
}

$size_w = 130;
$size_h = 32;
$fsize = 10;
// For Linux: fonts/SF Collegiate Solid.ttf
// For Windows: C://nginx/public/fonts/SF Collegiate Solid.ttf
$font = 'C://nginx/public/fonts/SF Collegiate Solid.ttf'; 
$letters = array(	'a',	'b',	'c',	'd',	'e',	'f',	'g',	'h',	'j',	'k',	'm',	'n',	'p',	'q',	'r',	's',	't',	'u',	'v',	'w',	'x',	'y',	'z',	'2',	'3',	'4',	'5',	'6',	'7',	'9');
$colors = array(	'30',	'50',	'70',	'90',	'110',	'130',	'150',	'170',	'190',	'210');

$src = imagecreatetruecolor($size_w, $size_h);
imagesavealpha($src, true);
$fon = imagecolorallocatealpha($src, 0, 0, 0, 127);
//$fon = imagecolorallocate($src, 255, 255, 255);
imagefill($src, 0, 0, $fon);
$wo = 20;
$arr = array();

for ($i = 0;$i < 5;$i++) {
	$color = imagecolorallocatealpha($src, $colors[mt_rand(0, sizeof($colors) - 1) ], $colors[mt_rand(0, sizeof($colors) - 1) ], $colors[mt_rand(0, sizeof($colors) - 1) ], mt_rand(1, 40));
	$letter = $letters[mt_rand(0, sizeof($letters) - 1) ];
	$size = mt_rand($fsize * 2.1 - 2, $fsize * 2.1 + 2);
	if ($i == 0) {
		$x = 20;
	}
	else {
		$x = $wo;
	}
	$wo = ($wo + 20);
	$y = (($size_h * 2) / 3) + mt_rand(0, 5);
	$arr[] = $letter;
	imagettftext($src, $size, (mt_rand(1, 2) === 1 ? mt_rand(0, 35) : mt_rand(330, 350)) , $x, $y, $color, $font, $letter);
}

$r = mt_rand(5, 8);
for ($i = 0;$i < $r;$i++) {
	$color = imagecolorallocatealpha($src, $colors[mt_rand(0, sizeof($colors) - 1) ], $colors[mt_rand(0, sizeof($colors) - 1) ], $colors[mt_rand(0, sizeof($colors) - 1) ], mt_rand(1, 40));
	$x1 = mt_rand(0, $size_w);
	$y1 = mt_rand(0, $size_h / 2);
	$x2 = mt_rand(0, $size_w);
	$y2 = mt_rand($size_h / 2, $size_h);
	imageline($src, $x1, $y1, $x2, $y2, $color);
}

$_SESSION['captcha'.$loc] = strtolower(implode('', $arr));
session_write_close();

header('Content-type: image/png');
imagepng($src);
imagedestroy($src);
