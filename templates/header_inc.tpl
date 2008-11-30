{* $Header: /cvsroot/bitweaver/_fckeditor/templates/header_inc.tpl,v 1.19 2008/11/30 06:45:01 tekimaki_admin Exp $ *}
{strip}
{if $gBitUser->hasPermission( 'p_liberty_enter_html' )}
	{if $gBitSystem->isPackageActive('fckeditor')}
		<script type="text/javascript">/*<![CDATA[*/
			
			function FCKify(textarea) {ldelim}
				var oFCKeditor = new FCKeditor( textarea.name );
				{* TODO: Hook things from admin panel in here. *}
				oFCKeditor.BasePath = "{$smarty.const.FCKEDITOR_PKG_URL}jscripts/";
				
				{* config file? from fckeditor directory, or from theme directory, or standard *}
				{if $gBitSystem->isFeatureActive('fckeditor_custom_config')}
					{if is_file($smarty.const.THEMES_STYLE_PATH|cat:"fckeditor/fckconfig.custom.js")}
						oFCKeditor.Config['CustomConfigurationsPath'] = "{$smarty.const.THEMES_STYLE_URL}fckeditor/fckconfig.custom.js";
					{else}
						oFCKeditor.Config['CustomConfigurationsPath'] = "{$smarty.const.FCKEDITOR_PKG_URL}fckconfig.custom.js";
					 {/if}
				{else}
					oFCKeditor.Config['CustomConfigurationsPath'] = "{$smarty.const.FCKEDITOR_PKG_URL}fckconfig.bitweaver.js";
				{/if}
				
				{if !$gBitSystem->isFeatureActive('fckedit_toolbars')}
					oFCKeditor.ToolbarSet = "Basic";
				{else}
					oFCKeditor.ToolbarSet = "{$gBitSystem->getConfig('fckedit_toolbars')}";
				{/if}
				{if $gBitSystem->isFeatureActive('fckedit_skin')}
					oFCKeditor.Config['SkinPath'] = oFCKeditor.BasePath + 'editor/skins/{$gBitSystem->getConfig('fckedit_skin')}/';
				{/if}
				{if $gBitSystem->isFeatureActive('fckedit_debug')}
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
					textarea.useFCK=confirm("{tr}Would you like to use the WYSIWYG editor for this text area?{/tr}");
					textarea.promptedFCK=1;
				{rdelim}
				if (textarea.useFCK) {ldelim}
					FCKify(textarea);
				{rdelim}
			{rdelim}
			
			function FCKall() {ldelim}
				var allTextAreas = document.getElementsByTagName("textarea");
				for (var i=0; i < allTextAreas.length; i++) {ldelim}
					if (allTextAreas[i].className.substr(0,7) == 'wysiwyg') {ldelim}
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
		/*]]>*/</script>
	{/if}
{/if}
{/strip}
