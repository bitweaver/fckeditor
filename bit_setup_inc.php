<?php
global $gBitSystem, $gBitSmarty, $gBitThemes;

$registerHash = array(
	'package_name' => 'fckeditor',
	'package_path' => dirname( __FILE__ ).'/',
);

$gBitSystem->registerPackage( $registerHash );

// Add our plugin directory.
$gBitSmarty->plugins_dir[] = $registerHash['package_path']."smarty";

if( $gBitSystem->isPackageActive( 'fckeditor' ) && $gBitUser->hasPermission( 'p_liberty_edit_html_style' ) ){
	$gBitThemes->loadJavascript( FCKEDITOR_PKG_PATH.'jscripts/fckeditor.js' );
}

?>
