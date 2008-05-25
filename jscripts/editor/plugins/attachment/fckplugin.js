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

MochiKit = parent.MochiKit;

FCKAttachment_Data = [];

// Register the related command.
FCKCommands.RegisterCommand( 'Attachment', new FCKDialogCommand( 'Attachment', 'Insert Image', FCKPlugins.Items['attachment'].Path + 'fck_attachment.html', 550, 500) );

// Create the "Plaholder" toolbar button.
var oAttachmentItem = new FCKToolbarButton( 'Attachment', 'Insert Image', 'Insert/Upload Image', FCK_TOOLBARITEM_ONLYTEXT, false, true );
//oAttachmentItem.IconPath = FCKPlugins.Items['attachment'].Path + 'attachment.gif' ;

FCKToolbarItems.RegisterItem( 'Attachment', oAttachmentItem ) ;


// The object used for all Attachment operations.
var FCKAttachment = function()  
{  
	this.aNodes = [];
	this.aStrings = [];
	this.aPieces = [];
	this.aIds = [];
	this.aSizes = [];
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

	img._fck_attachment = '{attachment id=' + obj.id + ' size=' + size + '}';
	
	img.contentEditable = false;

	// To avoid it to be resized.
	img.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}


// Redraw
FCKAttachment.prototype.Redraw = function(){
	if ( FCKBrowserInfo.IsIE ){
		this.aNodes = new Array() ;
		this.aNodes[0] = FCK.EditorDocument.body.innerText;
		this.ProcessNodeForIE(0);
		this.VerifyAttachmentData(0);
	}else{
		// Walk the body DOM tree and grab all nodes that have an attachment tag in them
		// FCKAttachment._AcceptNode
		if ( FCK.EditorDocument  ){
			var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, FCKAttachment._AcceptNode, true ) ;
			this.aNodes = new Array() ;
			while ( oNode = oInteractor.nextNode() ){
				this.aNodes[ this.aNodes.length ] = oNode ;
			}
			for ( var n = 0 ; n < this.aNodes.length ; n++ ){	
				// process nodes
				this.ProcessNode(n);
				this.VerifyAttachmentData(n);
			}
		}
	}
}


FCKAttachment.prototype.ProcessNodeForIE = function( n ){
	this.aPieces[n] = new Array();
	this.aIds[n] = new Array();
	this.aSizes[n] = new Array();
	
	var node = this.aNodes[n];

	// Get each attachment and values
	if ( /\{attachment\s+([^\}]*)\}/.test( node ) ){
		this.aPieces[n] = this.aNodes[n].match( /\{attachment\s+([^\}]*)\}/g ) ;
	}
	if ( this.aPieces[n] ){
		for ( var i = 0 ; i < this.aPieces[n].length ; i++ ){		
			this.aIds[n][i] = this.aPieces[n][i].match( /\{attachment\b.*\bid=['"]?(\d+)[^\}]*\}/ )[1];
			this.aSizes[n][i] = ( /\{attachment\b.*\bsize=['"]?(\w+)[^\}]*\}/.test( this.aPieces[n][i] ) ? this.aPieces[n][i].match( /\{attachment\b.*\bsize=['"]?(\w+)[^\}]*\}/ )[1] : 'medium' );
		}
	}
}


FCKAttachment.prototype.ProcessNode = function( n ){
	this.aPieces[n] = new Array();
	this.aStrings[n] = new Array();
	this.aIds[n] = new Array();
	this.aSizes[n] = new Array();
	
	var node = this.aNodes[n];
	
	// Get all surrounding strings and attachment tags in each Node
	if ( /\{attachment\s+([^\}]*)\}/.test( node.nodeValue ) ){
		this.aPieces[n] = this.aPieces[n].concat( node.nodeValue.match(/\{attachment\s+([^\}]*)\}/g) );
		this.aStrings[n] = node.nodeValue.split( /\{attachment\s+([^\}]*)\}/g ) ;
	}
	
	for ( var i = 0 ; i < this.aPieces[n].length ; i++ ){
		// Get the id and size for the attachment
		this.aIds[n].push ( this.aPieces[n][i].match( /\{attachment\b.*\bid=['"]?(\d+)[^\}]*\}/ )[1] );
		this.aSizes[n].push ( /\{attachment\b.*\bsize=['"]?(\w+)[^\}]*\}/.test( this.aPieces[n][i] ) ? this.aPieces[n][i].match( /\{attachment\b.*\bsize=['"]?(\w+)[^\}]*\}/ )[1] : 'medium' );
	}
}


FCKAttachment.prototype.VerifyAttachmentData = function(n){
	var ids = this.aIds[n];
	var self = this;
	var requests = [];
	for ( var i = 0 ; i < ids.length ; i++ ){
		var obj;
		var match = false;		
		// first look for a matching record in memory for the id given
		for(o in FCKAttachment_Data){
			if ( FCKAttachment_Data[o].id == ids[i] ){
				obj = FCKAttachment_Data[o];
				var match = true;
				break;
			}
		}
		//if we don't have a matching attachment id in memory we ask the server for it
		if ( match == false ){
			requests.push ( this.GetAttachmentById( ids[i] ) );
		}		
	}
	if ( requests.length > 0){
		var l1 = new MochiKit.Async.DeferredList(requests, false, false, true);
		l1.addCallback( function(resultList){ self.ProcessResults(resultList, n) } );
	}else{
		if ( FCKBrowserInfo.IsIE ){
			this.ReplaceNodesForIE(n);
		}else{
			this.ReplaceNodes(n);
	    }
	}
}


FCKAttachment.prototype.GetAttachmentById = function(id){
	var params = "?json=true&attachment_id=" + id;
	// the pathing is counterintuitive in here because of fck's extensive use of frames
	return MochiKit.Async.loadJSONDoc( "../liberty/ajax_attachment_browser.php" + params );
}


FCKAttachment.prototype.ProcessResults = function(data, n){
	MochiKit.Base.map(function (rslt) {
        if (rslt[0]) {
			if (rslt[1].Status.code == 200){
				MochiKit.Base.map(function(data){
					FCKAttachment_Data.push(data);
				}, rslt[1].Attachments);
			}
			if (rslt[1].Status.code == 204){
				// no results
			}            
        } else {
            alert("There was an error requesting attachment information: " + rslt[1]);
        }
    }, data);
	if ( FCKBrowserInfo.IsIE ){
		this.ReplaceNodesForIE(n);
	}else{
		this.ReplaceNodes(n);
	}
}


FCKAttachment.prototype.ReplaceNodesForIE = function(n){
	var oRange = FCK.EditorDocument.body.createTextRange();

	for ( var i = 0 ; i < this.aPieces[n].length; i++ ){
		if ( oRange.findText(this.aPieces[n][i]) ){
			var id = this.aIds[n][i];
			var size = this.aSizes[n][i];
			var obj;
			var match = false;
			
			// first look for a matching record in memory
			for(o in FCKAttachment_Data){
				if ( FCKAttachment_Data[o].id == id ){
					obj = FCKAttachment_Data[o];
					var match = true;
					break;
				}
			}
			if ( match == true ){
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
				var oImg = '<img src="' + url + '" _fck_attachment_id="' + id + '" _fck_attachment_size="' + size + '" _fck_attachment="{attachment id=' + id + ' size=' + size + '}" />';
				oRange.pasteHTML( oImg );
			}else{
				oRange.pasteHTML( '{attachment id=' + id + ' size=' + size + '}' );
			}
		}
	}
}


FCKAttachment.prototype.ReplaceNodes = function(n){	
	var node = this.aNodes[n];
	
	var x = 0;
	if (this.aStrings[n].length > 0){
		for ( var i = 0 ; i < this.aStrings[n].length ; i++ ){
			if ( i%2 ){
				var id = this.aIds[n][x];
				var size = this.aSizes[n][x];
				var obj;
				var match = false;
				// first look for a matching record in memory
				for(o in FCKAttachment_Data){
					if ( FCKAttachment_Data[o].id == id ){
						obj = FCKAttachment_Data[o];
						var match = true;
						break;
					}
				}
				if ( match == true ){
					var oImg = FCK.EditorDocument.createElement( 'IMG' ) ;
					this.SetupImg( oImg, obj, size ) ;
					node.parentNode.insertBefore( oImg, node ) ;						
				}else{
					//if we don't have a matching id then just add the attachment tag back into the text
					alert('No record for specified attachment id:'+id+' could be found! No image or file will be displayed.');
					node.parentNode.insertBefore( FCK.EditorDocument.createTextNode( this.aStrings[n][i] ) , node ) ;
				}		
				x++;
			}else{
				node.parentNode.insertBefore( FCK.EditorDocument.createTextNode( this.aStrings[n][i] ) , node ) ;
			}
		}
		node.parentNode.removeChild( node ) ;
	}
}



FCKAttachment.prototype._AcceptNode = function( node )
{
	if ( /\{attachment\s+([^\}]*)\}/.test( node.nodeValue ) )
		return NodeFilter.FILTER_ACCEPT ;
	else
		return NodeFilter.FILTER_SKIP ;
}


// everything below is to simply add an image tag via passed in url
FCKAttachment.prototype.AddImgByURL = function( url, alt, w, h ){
	var oImg = FCK.CreateElement( 'IMG' ) ;
	oImg.src = url;
	oImg.alt = alt;
	if (w != null && w > 0){
		oImg.width = w;
	}
	if (h != null && h > 0){
		oImg.height = h;
	}
}

Attachment = new FCKAttachment();

FCK.Events.AttachEvent( 'OnAfterSetHTML', MochiKit.Base.bind( Attachment.Redraw, Attachment) ) ;


// We must process the IMG tags to replace it with the real resulting value of the attachment.
FCKXHtml.TagProcessors['img'] = function( node, htmlNode )
{
	if ( htmlNode._fck_attachment){
		node = FCKXHtml.XML.createTextNode( htmlNode._fck_attachment );
	}else{
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;
	}
	return node;
}
