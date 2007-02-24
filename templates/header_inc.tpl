{* $Header: /cvsroot/bitweaver/_fckeditor/templates/header_inc.tpl,v 1.7 2007/02/24 16:00:59 nickpalmer Exp $ *}
{if $gBitSystem->isPackageActive('fckeditor') && $textarea_id}
<script type="text/javascript" src="{$smarty.const.FCKEDITOR_PKG_URL}jscripts/fckeditor.js"></script>
<script type="text/javascript">
<!--
function FCKify(textarea) {ldelim}
	var oFCKeditor = new FCKeditor( textarea.name ) ;
	// TODO: Hook things from admin panel in here.
	oFCKeditor.BasePath = "{$smarty.const.FCKEDITOR_PKG_URL}jscripts/";
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
	document.FCKeditors[textarea.id] = textarea.name;
{rdelim}
function FCKprompt(textarea) {ldelim}
	if (!textarea.promptedFCK) {ldelim}
		textarea.useFCK=confirm("Would you like to use the WYSIWYG editor for this box?");
		textarea.promptedFCK=1;
	{rdelim}
	if (textarea.useFCK) {ldelim}
		FCKify(textarea);
	{rdelim}
{rdelim}
function FCKall() {ldelim}
	var allTextAreas = document.getElementsByTagName("textarea");
	for (var i=0; i < allTextAreas.length; i++) {ldelim}
		{if $gBitSystem->isFeatureActive("fckeditor_ask") ||
		    $gBitSystem->isFeatureActive("fckeditor_on_click")}
			allTextAreas[i].onclick = function() {ldelim} FCKprompt(this); {rdelim};
			{if !$gBitSystem->isFeatureActive("fckeditor_ask")}
				allTextAreas[i].promptedFCK=1;
				allTextAreas[i].useFCK=1;
			{/if}
		{else}
			FCKify(allTextAreas[i]);
		{/if}
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
