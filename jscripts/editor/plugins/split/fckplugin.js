//Begin Code 
var FCKSplit = function(name)  
{  
	this.Name = name;  
}  
 
FCKSplit.prototype.Execute = function()  
{
	if(document.all)  
	{  
	alert('in all');
		mySelection = FCK.EditorDocument.selection;

		myTextRange= mySelection.createRange(); 
	
		FCK.InsertHtml("\n...split...");
	
		myTextRange.select();
	}  
	else  
	{
		if ( this.Exist() )
		{
			//language connection is busted somewhere deeper in FCK
			//alert( FCKLang.SplitErrNameInUse );
			alert( 'There is already a split in your document.' ) ;
			return false ;
		}

		mySelection = FCK.EditorWindow.getSelection();
		this.Add();
		return true;
	}  

}  

FCKSplit.prototype.Add = function()
{
	var oDiv = FCK.CreateElement( 'DIV' ) ;
	this.SetupDiv( oDiv );
}


FCKSplit.prototype.SetupDiv = function( div )
{
	div.innerHTML = 'READ MORE BREAK -- EVERYTHING BELOW WILL BE IN THE READ MORE SECTION' ;

	//div.style.backgroundColor = '#ffff33' ;
	div.style.color = '#ff3300' ;
	div.style.textAlign = 'center' ;
	div.style.borderBottom = "1px dotted #ff3300";
	div.style.fontSize = ".9em";
	div.style.margin = "4px 0";

	if ( FCKBrowserInfo.IsGecko )
		div.style.cursor = 'default' ;

	div._fcksplit = '\n...split...' ;
	
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
		if ( aSpans[i]._fcksplit == '\n...split...' )
			return true ;
	}
}



/* NEED TO TEST IN IE - May not need any custom parsing
 * IE code here is from placeholder.js model. 
 */
/*
if ( FCKBrowserInfo.IsIE )
{
	FCKSplit.prototype.Redraw = function()
	{
		
		var aPlaholders = FCK.EditorDocument.body.innerText.match( /\[\[[^\[\]]+\]\]/g ) ;
		if ( !aPlaholders )
			return ;

		var oRange = FCK.EditorDocument.body.createTextRange() ;

		for ( var i = 0 ; i < aPlaholders.length ; i++ )
		{
			if ( oRange.findText( aPlaholders[i] ) )
			{
				var sName = aPlaholders[i].match( /\[\[\s*([^\]]*?)\s*\]\]/ )[1] ;
				oRange.pasteHTML( '<span style="color: #000000; background-color: #ffff00" contenteditable="false" _fcksplit="' + sName + '">' + aPlaholders[i] + '</span>' ) ;
			}
		}
	}
}
else
{
*/
	FCKSplit.prototype.Redraw = function()
	{
		if ( FCK.EditorDocument.getElementById('_fcksplit' ) != null ){
			var oNode = FCK.EditorDocument.getElementById('_fcksplit');
			var tNode = oNode.previousSibling;
			
			var nIndex = tNode.nodeValue.indexOf( '\n...split...' ) ;
			
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
		if ( /\n...split.../.test( node.nodeValue ) )
			return NodeFilter.FILTER_ACCEPT ;
		else
			return NodeFilter.FILTER_SKIP ;
	}
//}

FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKSplit.prototype.Redraw ) ;


// We must process the DIV tags to replace it with the real resulting value of the placeholder.
FCKXHtml.TagProcessors['div'] = function( node, htmlNode )
{
	if ( htmlNode._fcksplit ){	
		node = document.createDocumentFragment();
		node.appendChild( FCKXHtml.XML.createTextNode( htmlNode._fcksplit ) );
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