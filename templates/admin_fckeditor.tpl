{strip}
{form}
	{legend legend="General Settings"}
		<div class="row">
			{foreach from=$formFckeditorFeatures key=item item=output}
				<div class="row">
					{formlabel label=`$output.label` for=$item}
					{forminput}
						{html_checkboxes name="$item" values="y" checked=$gBitSystem->getConfig($item) labels=false id=$item}
						{formhelp note=`$output.note` page=`$output.page`}
					{/forminput}
				</div>
			{/foreach}
		</div>

		<div class="row submit">
			<input type="hidden" name="page" value="{$page}" />
			<input type="submit" name="change_prefs" value="{tr}Change preferences{/tr}" />
		</div>
	{/legend}
{/form}
{/strip}
