<?php

$formFckeditorFeatures = array(
	"fckeditor_debug" => array(
		'label' => 'Enabled debugging',
		'note' => 'Enable support for debug message output. On first debug message a window will pop up.'
	),
);


// Toolbars

$gBitSmarty->assign( 'formFckeditorFeatures', $formFckeditorFeatures );

$formToolbars = array( 'fckedit_toolbars' => array(
		'label' => 'Toolbar Set',
		'note' => 'The toolbar set to use. "All" includes functionality not supported by BitWeaver. Use at your own risk!'
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
