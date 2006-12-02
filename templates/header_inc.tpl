{* $Header: /cvsroot/bitweaver/_fckeditor/templates/header_inc.tpl,v 1.3 2006/12/02 20:43:28 nickpalmer Exp $ *}
{if $gBitSystem->isPackageActive('fckeditor')}
<script type="text/javascript" src="{$smarty.const.FCKEDITOR_PKG_URL}jscripts/fckeditor.js"></script>
<script type="text/javascript">
<!--
function FCKall() {ldelim}
	var allTextAreas = document.getElementsByTagName("textarea");
	for (var i=0; i < allTextAreas.length; i++) {ldelim}
		var oFCKeditor = new FCKeditor( allTextAreas[i].name ) ;
		// TODO: Hook things from admin panel in here.
		oFCKeditor.BasePath = "/fckeditor/jscripts/";
		test = "{$gBitSystem->getConfig('fckedit_toolbars')}";
		{if !$gBitSystem->getConfig('fckedit_toolbars')}
			oFCKeditor.ToolbarSet = "Basic";
		{else}
			oFCKeditor.ToolbarSet = "{$gBitSystem->getConfig('fckedit_toolbars')}";
		{/if}
		{if $gBitSystem->getConfig('fckedit_skin')}
			oFCKeditor.Config['SkinPath'] = oFCKeditor.BasePath + 'editor/skins/{$gBitSystem->getConfig('fckedit_skin')}/';
		{/if}
		{if $gBitSystem->getConfig('fckedit_debug')}
			oFCKeditor.Config['Debug'] = 1;
		{/if}
		oFCKeditor.ReplaceTextarea() ;
		if (!document.FCKeditors) {ldelim}
			document.FCKeditors = new Array();
		{rdelim}
		document.FCKeditors[allTextAreas[i].id] = allTextAreas[i].name;
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
{/if}
