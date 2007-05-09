/*
 * Attachment plugin for FCKeditor for Bitweaver CMS
 * Copyright (C) 2007 Will James, Bitweaver.org
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * File Authors:
 * 		Will James (will@onnyturf.com)
 *
 * Instructions:
 * 		To add Attachment to your FCKeditor include the following in your fckconfig.js file: 
 * 		FCKConfig.Plugins.Add( 'attachment' ) ; 
 *
 * 		And add the following to your FCKConfig.ToolbarSets:
 * 		['Attachment']
 *
 */


/* 
// manage the plugins' button behavior  
FCKAttachment.prototype.GetState = function()  
{  
	return FCK_TRISTATE_OFF;  
}  
 
FCKCommands.RegisterCommand( 'Attachment', new FCKAttachment('Attachment')) ;  

// Create the toolbar button. 
var oAttachmentItem = new FCKToolbarButton( 'Attachment', 'Insert Attachment', 'Insert a attachment to create a Read More area', FCK_TOOLBARITEM_ONLYTEXT, false, true );
//oAttachmentItem.IconPath = FCKPlugins.Items['attachment'].Path + 'attachment.gif' ; 
FCKToolbarItems.RegisterItem( 'Attachment', oAttachmentItem ) ;  
*/

FCKAttachment_Data = [];

// Register the related command.
FCKCommands.RegisterCommand( 'Attachment', new FCKDialogCommand( 'Attachment', 'Insert Image', FCKPlugins.Items['attachment'].Path + 'fck_attachment.html', 550, 500) );

// Create the "Plaholder" toolbar button.
var oAttachmentItem = new FCKToolbarButton( 'Attachment', 'Add Image' ) ;
//oAttachmentItem.IconPath = FCKPlugins.Items['attachment'].Path + 'attachment.gif' ;

FCKToolbarItems.RegisterItem( 'Attachment', oAttachmentItem ) ;


// The object used for all Attachment operations.
var FCKAttachment = function(name)  
{  
	this.Name = name;  
}  


FCKAttachment.prototype.Init = function()  
{
	if(document.all)  
	{  
		mySelection = FCK.EditorDocument.selection;
	}  
	else  
	{
		mySelection = FCK.EditorWindow.getSelection();
	}  
	//this.Add();
	return true;
}


// Add a new attachment at the actual selection.
FCKAttachment.prototype.AddAttachment = function( obj, size )
{
	FCKAttachment_Data.push(obj);
	// construct an image elm
	var oImg = FCK.CreateElement( 'IMG' ) ;
	this.SetupImg( oImg, obj, size );
}

// Add a new attachment at the actual selection.
FCKAttachment.prototype.Add = function()
{
	var oImg = FCK.CreateElement( 'IMG' ) ;
	this.SetupImg( oImg );
}


FCKAttachment.prototype.SetupImg = function( img, obj, size )
{
	// attach the url
	var url;
	switch (size)
	{
		case 'avatar':
			url = obj.avatar;
			break;
		case 'small':
			url = obj.small;
			break;
		case 'medium':
			url = obj.medium;
			break;
		case 'large':
			url = obj.large;
			break;
		case 'original':
			url = obj.url;			
			break;
	}

	img.src = url;
	
	if ( FCKBrowserInfo.IsGecko )
		img.style.cursor = 'default' ;

	// attach its id
	img._fck_attachment_id = obj.id;
	// attach the selected size
	img._fck_attachment_size = size;

	img._fck_attachment = '{attachment id=' + obj.id + ' size=' + size + '}' ;
	
	img.contentEditable = false ;

	// To avoid it to be resized.
	img.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}


FCKAttachment.prototype.Redraw = function(){
	// Walk the body DOM tree and grab all nodes that have an attachment tag in them
	// FCKAttachment._AcceptNode
	var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, FCKAttachment._AcceptNode, true ) ;
	var	aNodes = new Array() ;
	while ( oNode = oInteractor.nextNode() ){
		aNodes[ aNodes.length ] = oNode ;
	}
	for ( var n = 0 ; n < aNodes.length ; n++ ){			
		// Get all attachment tags in each Node
		var aPieces = [];
		var aStrings = [];
		if ( /\{attachment\s+([^\}]*)\}/.test( aNodes[n].nodeValue ) ){
			aPieces = aPieces.concat( aNodes[n].nodeValue.match(/\{attachment\s+([^\}]*)\}/g) );
			aStrings = aNodes[n].nodeValue.split( /\{attachment\s+([^\}]*)\}/g ) ;
		}

		var x = 0;
		for ( var i = 0 ; i < aStrings.length ; i++ ){
			if ( i%2 ){					
				// Get the ID for the attachment
				var id = aPieces[x].match( /\{attachment\b.*\bid=['"]?(\d+)[^\}]*\}/ )[1];
				var size = /\{attachment\b.*\bsize=['"]?(\w+)[^\}]*\}/.test(aPieces[x]) ? aPieces[x].match( /\{attachment\b.*\bsize=['"]?(\w+)[^\}]*\}/ )[1] : 'medium';
				var obj;
				var match = false;
				// first look for a matching record in memory for the id given
				for(o in FCKAttachment_Data){
					if ( FCKAttachment_Data[o].id == id ){
						obj = FCKAttachment_Data[o];
						var match = true;
						break;
					}
				}
				//if we don't have a matching attachment id in memory we ask the server for it
				if ( match == false ){
					//var match = true;						
				}
				//if we still don't have a matching id then bail out
				if ( match == true ){
					var oImg = FCK.EditorDocument.createElement( 'IMG' ) ;
					var FCKA = new FCKAttachment();
					FCKA.SetupImg( oImg, obj, size ) ;

					aNodes[n].parentNode.insertBefore( oImg, aNodes[n] ) ;						
				}else{
					alert('No record for specified attachment id:'+id+' could be found! No image or file will be displayed.');
				}
				
				x++;
			}else{
				aNodes[n].parentNode.insertBefore( FCK.EditorDocument.createTextNode( aStrings[i] ) , aNodes[n] ) ;
			}
		}
		aNodes[n].parentNode.removeChild( aNodes[n] ) ;
	}
}


FCKAttachment.prototype._AcceptNode = function( node )
{
	if ( /\{attachment\s+([^\}]*)\}/.test( node.nodeValue ) )
		return NodeFilter.FILTER_ACCEPT ;
	else
		return NodeFilter.FILTER_SKIP ;
}


FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKAttachment.prototype.Redraw ) ;


// We must process the DIV tags to replace it with the real resulting value of the placeholder.
FCKXHtml.TagProcessors['img'] = function( node, htmlNode )
{
	if ( htmlNode._fck_attachment){
		node = document.createTextNode( htmlNode._fck_attachment );
	}else{
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;
	}
	return node;
}

