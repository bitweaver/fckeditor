{strip}
<html>
<head>
{include file="bitpackage:kernel/header_inc.tpl"}
<script type="text/javascript">
{if !empty($errors)}
	function display_upload_errors() {ldelim}
		alert("Error with upload: {$errors}");
	{rdelim}
	addLoadHook(display_upload_errors);
{else if} 
	function getRslt(){ldelim}	
		var rslt = {ldelim}
		{if count($gContent->mStorage) > 0}
		  "Status": {ldelim}
			"code": 200,
			"request": "datasearch"
		  {rdelim},
		  "Attachments":[{foreach from=$gContent->mStorage item=storage key=attachmentId name=loop}
		  {ldelim}
			  "id":{$attachmentId},
			  "url":'{$storage.source_url}',
			  "avatar":'{$storage.thumbnail_url.avatar}',
			  "small":'{$storage.thumbnail_url.small}',
			  "medium":'{$storage.thumbnail_url.medium}',
			  "large":'{$storage.thumbnail_url.large}',
			  "file_name":'{$storage.filename}'
		   {rdelim}{if !$smarty.foreach.loop.last},{/if}
		   {/foreach}]
		{elseif count($gContent->mStorage) == 0}
		  /*put error code here*/
		  "Status": {ldelim}
			"code": 204,
			"request": "datasearch"
		  {rdelim}
		{/if}
		{rdelim};
	
		return rslt;
	{rdelim}
{/if}
</script>
</head>
<body>
{if empty($gContent->mContentId)}
	{foreach from=$gContent->mStorage item=storage key=attachmentId}
		<input type="hidden" name="existing_attachment_id[]" value="{$attachmentId}" />
	{/foreach}
{/if}
</body>
</html>
{/strip}