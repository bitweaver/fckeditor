<?php

$formFckeditorFeatures = array(
	"fckeditor_custom_config" => array(
		'label' => 'Custom Config File',
		'note' => 'If enabled, a custom configuration is included, either <kbd>' . THEMES_PKG_DIR . '/styles/&lt;current-style&gt;/fckeditor/fckconfig.custom.js</kbd>, or <kbd>' . FCKEDITOR_PKG_DIR . '/fckconfig.custom.js</kbd>. It may be a modified copy of <kbd>jscripts/fckconfig.js</kbd> or of <kbd>fckconfig.bitweaver.js</kbd>. Depending on the modifications, a few of the settings below might not work anymore as expected (e.g., toolbar or skin settings).'
	),
	"fckeditor_debug" => array(
		'label' => 'Enabled debugging',
		'note' => 'Enable support for debug message output. On first debug message a window will pop up.'
	),
	"fckeditor_on_click" => array(
		'label' => 'Load FCKEditor on Click',
		'note' => 'Delay loading the FCKEditor until the user clicks on the text area.'
	),
	"fckeditor_ask" => array(
		'label' => 'Ask to use FCKEditor',
		'note' => 'If set the user will be prompted if they want to use FCKEditor for a given textbox. This option implies Load FCKEditor on Click even if it is not set.'
	),
);


// Toolbars

$gBitSmarty->assign( 'formFckeditorFeatures', $formFckeditorFeatures );

$formToolbars = array( 'fckedit_toolbars' => array(
		'label' => 'Toolbar Set',
		'note' => 'The toolbar set to use. "All" includes functionality not supported by Bitweaver. Use at your own risk!'
		)
);

$gBitSmarty->assign( 'formToolbars', $formToolbars );
$gBitSmarty->assign( 'formToolbarChoices', array('Basic', 'Beginner', 'Intermediate', 'Advanced', 'Supported', 'All'));


// Skin 

$formSkin = array( 'fckedit_skin' => array(
		'label' => 'Skin',
		'note' => 'The skin to use.',
		)
);
$gBitSmarty->assign( 'formSkin', $formSkin );
$gBitSmarty->assign( 'formSkinChoices', array('default', 'silver', 'office2003'));


if( !empty( $_REQUEST['change_prefs'] ) ) {
	foreach( $formFckeditorFeatures as $item => $data ) {
		simple_set_toggle( $item, FCKEDITOR_PKG_NAME );
	}

	$fckeditorSets = array_merge( $formToolbars , $formSkin);
	foreach( $fckeditorSets as $item => $data ) {
		simple_set_value( $item, FCKEDITOR_PKG_NAME );
	}
}
?>
