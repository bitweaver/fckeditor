/*
 * Split plugin for FCKeditor for Bitweaver CMS
 * Copyright (C) 2007 Will James, Bitweaver.org
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * File Authors:
 * 		Will James (will@onnyturf.com)
 *
 * Instructions:
 * 		To add Split to your FCKeditor include the following in your fckconfig.js file: 
 * 		FCKConfig.Plugins.Add( 'split' ) ; 
 *
 * 		And add the following to your FCKConfig.ToolbarSets:
 * 		['Split']
 *
 */

//Begin Code 
var FCKSplit = function(name)  
{  
	this.Name = name;  
}  
 
FCKSplit.prototype.Execute = function()  
{
	if ( this.Exist() )
	{
		//language connection is busted somewhere deeper in FCK
		//alert( FCKLang.SplitErrNameInUse );
		alert( 'There is already a split in your document.' ) ;
		return false ;
	}
	if(document.all)  
	{  
		mySelection = FCK.EditorDocument.selection;
	}  
	else  
	{
		mySelection = FCK.EditorWindow.getSelection();
	}  
	this.Add();
	return true;
}  

FCKSplit.prototype.Add = function()
{
	var oDiv = FCK.CreateElement( 'DIV' ) ;
	this.SetupDiv( oDiv );
}


FCKSplit.prototype.SetupDiv = function( div )
{
	div.innerHTML = 'READ MORE SPLIT -- EVERYTHING BELOW WILL BE IN THE READ MORE SECTION' ;

	//div.style.backgroundColor = '#ffff33' ;
	div.style.color = '#ff3300' ;
	div.style.textAlign = 'center' ;
	div.style.borderBottom = "1px dotted #ff3300";
	div.style.fontSize = ".9em";
	div.style.margin = "4px 0";

	if ( FCKBrowserInfo.IsGecko )
		div.style.cursor = 'default' ;

	div._fcksplit = '...split...' ;
	
	div.contentEditable = false ;

	// To avoid it to be resized.
	div.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}




// Check if a Placholder name is already in use.
FCKSplit.prototype.Exist = function()
{
	var aSpans = FCK.EditorDocument.getElementsByTagName( 'DIV' )

	for ( var i = 0 ; i < aSpans.length ; i++ )
	{
		if ( aSpans[i]._fcksplit == '...split...' )
			return true ;
	}
}


FCKSplit.prototype.Redraw = function()
{
	if ( FCK.EditorDocument.getElementById('_fcksplit' ) != null ){
		var oNode = FCK.EditorDocument.getElementById('_fcksplit');
		var tNode = oNode.previousSibling;
		
		var nIndex = tNode.nodeValue.indexOf( '...split...' ) ;
		
		var oDiv = FCK.EditorDocument.createElement( 'DIV' ) ;
		var split = new FCKSplit();
		split.SetupDiv( oDiv );
			
		var str1 = tNode.nodeValue.substring(0,nIndex);
		var node1 = FCK.EditorDocument.createTextNode( str1 );

		tNode.parentNode.insertBefore( oDiv, tNode );
		tNode.parentNode.insertBefore( node1, oDiv );
		
		tNode.parentNode.removeChild( oNode ) ;
		tNode.parentNode.removeChild( tNode ) ;
		
	}
}

FCKSplit.prototype._AcceptNode = function( node )
{
	if ( /...split.../.test( node.nodeValue ) )
		return NodeFilter.FILTER_ACCEPT ;
	else
		return NodeFilter.FILTER_SKIP ;
}


FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKSplit.prototype.Redraw ) ;


// We must process the DIV tags to replace it with the real resulting value of the placeholder.
FCKXHtml.TagProcessors['div'] = function( node, htmlNode )
{
	if ( htmlNode._fcksplit ){	
		node = document.createDocumentFragment();
		var txt = document.createTextNode( htmlNode._fcksplit );
		node.appendChild( txt );
		var br = document.createElement('BR');
		br.id = "_fcksplit";
		node.appendChild( br );		
	}else{
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;
	}
	return node;
}



 
// manage the plugins' button behavior  
FCKSplit.prototype.GetState = function()  
{  
	return FCK_TRISTATE_OFF;  
}  
 
FCKCommands.RegisterCommand( 'Split', new FCKSplit('Split')) ;  


// Create the toolbar button. 
var oSplitItem = new FCKToolbarButton( 'Split', 'Insert Split', 'Insert a split to create a Read More area', FCK_TOOLBARITEM_ONLYTEXT, false, true );
//oSplitItem.IconPath = FCKPlugins.Items['split'].Path + 'split.gif' ; 
FCKToolbarItems.RegisterItem( 'Split', oSplitItem ) ;  
 
//End Code 