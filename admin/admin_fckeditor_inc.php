<?php

$formFckeditorFeatures = array(
	"fckeditor_debug" => array(
		'label' => 'Enabled debugging',
		'note' => 'If the value of this option is set to "true" some debugging information will appear.',
		'page' => '',
	),
);

$gBitSmarty->assign( 'formFckeditorFeatures', $formFckeditorFeatures );

if( !empty( $_REQUEST['change_prefs'] ) ) {
	foreach( $formFckeditorFeatures as $item => $data ) {
		simple_set_toggle( $item, FCKEDITOR_PKG_NAME );
	}
}
?>
