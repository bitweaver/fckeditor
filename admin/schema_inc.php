<?php
global $gBitInstaller;
$gBitInstaller->registerPackageInfo( FCKEDITOR_PKG_NAME, array(
	'description' => "FCKEditor is a 'What You See Is What You Get' textarea HTML editor. It works with IE 5.5+ Firefox 1.0+ Mozilla 1.3+ and Netscape 7+. It CAN NOT be used with TinyMCE active!",
	'license' => '<a href="http://www.gnu.org/licenses/licenses.html#LGPL">LGPL</a>',
	'important' => 'When using this WYSIWYG, we recommend that you either use HTML as the only content format or at least set it as default (formats can be set in Administration --> Liberty --> Liberty plugins).',
	'version' => '2.3.2',
) );

$gBitInstaller->registerPreferences( FCKEDITOR_PKG_NAME, array(
	array(FCKEDITOR_PKG_NAME,'fckeditor_debug','n'),
) );

?>
