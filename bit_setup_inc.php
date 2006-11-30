<?php
global $gBitSystem, $gBitSmarty;

$registerHash = array(
	'package_name' => 'fckeditor',
	'package_path' => dirname( __FILE__ ).'/',
);

$gBitSystem->registerPackage( $registerHash );

// Add our plugin directory, overriding the default plugins.
$gBitSmarty->plugins_dir = array_merge($registerHash['package_path']."smarty",
	$gBitSmarty->plugins_dir);

?>
