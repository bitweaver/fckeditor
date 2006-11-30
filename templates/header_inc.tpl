{* $Header: /cvsroot/bitweaver/_fckeditor/templates/header_inc.tpl,v 1.1 2006/11/30 22:10:05 nickpalmer Exp $ *}
<script type="text/javascript" src="{$smarty.const.FCKEDITOR_PKG_URL}jscripts/fckeditor.js"></script>
<script type="text/javascript">
<!--
function FCKall() {ldelim}
	var allTextAreas = document.getElementsByTagName("textarea");
	for (var i=0; i < allTextAreas.length; i++) {ldelim}
		var oFCKeditor = new FCKeditor( allTextAreas[i].name ) ;
		// TODO: Hook things from admin panel in here.
		oFCKeditor.BasePath = "/fckeditor/jscripts/";
		oFCKeditor.ToolbarSet = "Bitweaver";
		oFCKeditor.ReplaceTextarea() ;
	{rdelim}
{rdelim}
if ( typeof window.addEventListener != "undefined" ) {ldelim}
	window.addEventListener( "load", FCKall, false );
{rdelim} else if ( typeof window.attachEvent != "undefined" ) {ldelim}
	window.attachEvent( "onload", FCKall );
{rdelim} else {ldelim}
	if ( window.onload != null ) {ldelim}
		var oldOnload = window.onload;
		window.onload = function ( e ) {ldelim}
			oldOnload( e );
			FCKall();
		{rdelim};
	{rdelim} else {ldelim}
		window.onload = FCKall;
	{rdelim}
{rdelim}

// -->
</script>
