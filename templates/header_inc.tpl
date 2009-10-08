{* $Header: /cvsroot/bitweaver/_fckeditor/templates/header_inc.tpl,v 1.29 2009/10/08 15:31:08 wjames5 Exp $ *}
{strip}
{if $gBitUser->hasPermission( 'p_liberty_enter_html' ) && $gContent && $gLibertySystem->mPlugins.bithtml && $gBitSystem->isPackageActive('fckeditor')}
		<script type="text/javascript">/*<![CDATA[*/
			BitFCK = {ldelim}{rdelim};
			BitFCK.instances = [];

			BitFCK.FCKify = function (name) {ldelim}
				var oFCKeditor = new FCKeditor( name );
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
				oFCKeditor.ReplaceTextarea();
				BitFCK.instances.push(oFCKeditor);
			{rdelim};

			BitFCK.unFCKifyAll = function (name){ldelim} 
				var n = BitFCK.instances.length - 1;  
				while( n > -1 ){ldelim}
					var fck = BitFCK.instances.pop();
					var api = FCKeditorAPI.GetInstance( fck.InstanceName );
					{* copy text to original textarea *}
					api.UpdateLinkedField();
					{* remove editor *}
					a = document.getElementById( fck.InstanceName + '___Config' );
					b = document.getElementById( fck.InstanceName + '___Frame' );
					a.parentNode.removeChild( a );
					b.parentNode.removeChild( b );
					{* display original textarea *}
					BitBase.setElementDisplay( api.LinkedField, 'block' );
					{* destroy the instance *}
					delete api;
					delete fck;
					n--;
				{rdelim}
			{rdelim};
			
			BitFCK.FCKprompt = function (textarea) {ldelim}
				if (!textarea.promptedFCK) {ldelim}
					textarea.useFCK=confirm("{tr}Would you like to use the HTML WYSIWYG editor for this text area?{/tr}");
					textarea.promptedFCK=1;
				{rdelim}
				if (textarea.useFCK) {ldelim}
					BitFCK.FCKify(textarea.name);
				{rdelim}
			{rdelim};
			
			BitFCK.FCKall = function () {ldelim}
				var allTextAreas = document.getElementsByTagName("textarea");
				for (var i=0; i < allTextAreas.length; i++) {ldelim}
					if (allTextAreas[i].className.substr(0,7) == 'wysiwyg') {ldelim}
						{if $gBitSystem->isFeatureActive("fckeditor_ask") ||
						    $gBitSystem->isFeatureActive("fckeditor_on_click")}
							allTextAreas[i].onclick = function() {ldelim} BitFCK.FCKprompt(this); {rdelim};
							{if !$gBitSystem->isFeatureActive("fckeditor_ask")}
								allTextAreas[i].promptedFCK=1;
								allTextAreas[i].useFCK=1;
							{/if}
						{else}
							var id;
							if (typeof(allTextAreas[i].id) != 'undefined' && allTextAreas[i].id != null){ldelim}
								id = allTextAreas[i].id;
							{rdelim}else{ldelim}
								id = allTextAreas[i].name;
							{rdelim}
							BitFCK.FCKify(id);
						{/if}
					{rdelim}
				{rdelim}
			{rdelim};

			BitFCK.bindFormatListener = function() {ldelim}
				var radios = document.getElementsByName( 'format_guid' );
				for( n in radios ){ldelim}
					var el = radios[n];
					if( el.type == 'radio' ){ldelim}
						el.onclick = el.value == 'bithtml'?BitFCK.FCKall:BitFCK.unFCKifyAll;
					{rdelim}
				{rdelim}
			{rdelim};

			/* services */
			BitFCK.prepRequest = function(formid) {ldelim}
				if( typeof( FCKeditorAPI ) != 'undefined' ){ldelim}
					var fck = FCKeditorAPI.GetInstance( 'commentpost' );
					if( fck ){ldelim}
						fck.UpdateLinkedField();
					{rdelim}	
				{rdelim}	
			{rdelim};

			if ( typeof(LibertyComment) != 'undefined' ) {ldelim}
				if( typeof(LibertyComment.prepRequestSrvc) != 'undefined' ) {ldelim}
					LibertyComment.prepRequestSrvc.push( BitFCK.prepRequest );
				{rdelim}
			{rdelim}

			/* init */
			{* this is mess - BitBase has utility for binding onload events, look into it soon *}
			{if ( $gContent->isValid() && $gContent->mInfo.format_guid eq 'bithtml' ) || 
				(!$gContent->isValid() && $gBitSystem->getConfig( 'default_format' ) eq 'bithtml') }
				if ( typeof window.addEventListener != "undefined" ) {ldelim}
					window.addEventListener( "load", BitFCK.FCKall, false );
				{rdelim} else if ( typeof window.attachEvent != "undefined" ) {ldelim}
					window.attachEvent( "onload", BitFCK.FCKall );
				{rdelim} else {ldelim}
					if ( window.onload != null ) {ldelim}
						var oldOnload = window.onload;
						window.onload = function ( e ) {ldelim}
							oldOnload( e );
							BitFCK.FCKall();
						{rdelim};
					{rdelim} else {ldelim}
						window.onload = BitFCK.FCKall;
					{rdelim}
				{rdelim}
			{else}
				if ( typeof window.addEventListener != "undefined" ) {ldelim}
					window.addEventListener( "load", BitFCK.bindFormatListener, false );
				{rdelim} else if ( typeof window.attachEvent != "undefined" ) {ldelim}
					window.attachEvent( "onload", BitFCK.bindFormatListener );
				{rdelim} else {ldelim}
					if ( window.onload != null ) {ldelim}
						var oldOnload = window.onload;
						window.onload = function ( e ) {ldelim}
							oldOnload( e );
							BitFCK.bindFormatListener();
						{rdelim};
					{rdelim} else {ldelim}
						window.onload = BitFCK.bindFormatListener;
					{rdelim}
				{rdelim}
			{/if}
		/*]]>*/</script>
{/if}
{/strip}
