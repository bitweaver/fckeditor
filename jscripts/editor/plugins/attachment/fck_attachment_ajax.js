var liberty_uploader_under_way = 0;
var fck_attachment_target;
var fck_attachment_data = [];
var fck_attachment_size = 'medium';

function liberty_uploader(file, action, waitmsg, frmid, actionid) {
	if (liberty_uploader_under_way) {
		alert(waitmsg);
	}
	else {
		liberty_uploader_under_way = 1;
		MochiKit.Style.showElement('spinner');
		var old_target = file.form.target;
		file.form.target = frmid;
		var old_action = file.form.action;
		var action_item = document.getElementById(actionid);
		action_item.value = old_action;
		file.form.action=action;
		file.form.submit();
		file.form.target = old_target;
		file.form.action = old_action;
		action_item.value = '';
	}
}

function liberty_uploader_complete(frmid, divid, fileid) {
	fck_attachment_target = divid;
	var ifrm = document.getElementById(frmid);
	if (ifrm.contentDocument) {
		var d = ifrm.contentDocument;
	} else if (ifrm.contentWindow) {
		var d = ifrm.contentWindow.document;
	} else {
		var d = window.frames[frmid].document;
	}
	//@todo make sure this is cross browser compat
	if (window.frames[frmid] && window.frames[frmid].getRslt){
		ajax_result_handler(window.frames[frmid].getRslt());
	}
	if (d.location.href == "about:blank") {
		return;
	}
	/*
	var div = document.getElementById(divid);
	div.innerHTML = d.body.innerHTML;
	*/
	liberty_uploader_under_way = 0;
	//reset the upload form
	var file = document.getElementById(fileid);
	file.value = '';
}

function ajax_updater(target, url, pg) {
	fck_attachment_target = target;
	MochiKit.Style.showElement('spinner');
	var params = "?json=true" + ( pg != null ? "&pgnPage="+pg:"");
	var myAjax = loadJSONDoc( url + params );
	myAjax.addCallbacks(ajax_result_handler, ajax_error);
}

function ajax_error( request ) {
	alert( 'Sorry, there was a problem getting the requested data.' );
	MochiKit.Style.hideElement('spinner');
}

//what do I need this for? -wjames5
/*
function ajax_get_and_call(element, func, url, force) {
	if (!force && element.loadedResponse) {
		func(element.loadedResponse);
	} else {
		var myAjax = loadJSONDoc(url);
		myAjax.addCallbacks(function(transport){
			element.loadedResponse = transport.responseText || "No Response.";
			func(element.loadedResponse);
		    }, 
		 ajax_error);
	}
}
*/

function ajax_result_handler(rslt){
	MochiKit.Style.hideElement('spinner');
	if (rslt.Status.code == 200){
		process_rslt_data( rslt.Attachments );
		if ( rslt.Pagination ){
			process_pagination_data( rslt.Pagination );
		}
	}
	if (rslt.Status.code == 204){
		alert("Sorry we couldn't find any attachments associated with your account.");
	}
}

function fck_set_attachment_size( size ){
	fck_attachment_size = size.value;
}

function process_rslt_data( data ){
	for (n in data){
		fck_attachment_data.push( data[n] );
	}
	row_display = function (row) {
		return TR(null, TD(null, IMG({'src':row.avatar})), TD(null, row.file_name, BR(), A({'href':'javascript:void(0);', 'style':'font-weight:bold;', 'onclick':'fck_attach_by_id('+row.id+')'}, 'Click to Insert' )) );
	}	
	var Elem = MochiKit.DOM.DIV(null, DIV((data.length>1?{'style':'height:200px; overflow:auto;'}:{'class':'uploads'}), TABLE({'class':'data'}, TBODY(null, map(row_display, data)))) );
	MochiKit.DOM.replaceChildNodes(fck_attachment_target, Elem);
}

function process_pagination_data( data ){
	var PageLinks = [];
	var firstCurAtt = ( data.curPage * 10 ) - 9;
	var lastCurAtt = (data.numPages == data.curPage && data.cant < data.numPages * 10) ? data.cant : data.curPage * 10;
	
	for (n=1; n < data.numPages + 1; n++){
		if (n != data.curPage){
			PageLinks.push( A({'href':'javascript:void(0);', 'onclick':'ajax_updater( "attbrowser", "../../../../../liberty/ajax_attachment_browser.php", "'+n+'" )'}, n ), SPAN(null, " ") );
		}else{
			PageLinks.push( SPAN({'style':'font-weight:bold;'}, (n + " ")) );
		}
	}
	var Elem = MochiKit.DOM.DIV(null, STRONG(null, 'Total Attachments: ' + data.cant), BR(), SPAN(null, ('You are now viewing Attachments ' + firstCurAtt + '-'+ lastCurAtt)), BR(), SPAN(null, 'Pages of Attachments: '), PageLinks );	
	MochiKit.DOM.replaceChildNodes('pagination', Elem);
}

function fck_attach_by_id( id ){
	var obj;
	for (n in fck_attachment_data){
		if ( fck_attachment_data[n].id == id ){
			obj = fck_attachment_data[n];
			break;
		}
	}
	
	FCKAttachment.AddAttachment( obj, fck_attachment_size );
	imgType = 'attachment';
	parent.Ok();
}
