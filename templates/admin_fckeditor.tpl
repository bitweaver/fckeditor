{strip}
{form}
	{legend legend="General Settings"}
		<div class="control-group">
			{foreach from=$formFckeditorFeatures key=item item=output}
				<div class="control-group">
					{formlabel label=`$output.label` for=$item}
					{forminput}
						{html_checkboxes name="$item" values="y" checked=$gBitSystem->getConfig($item) labels=false id=$item}
						{formhelp note=`$output.note` page=`$output.page`}
					{/forminput}
				</div>
			{/foreach}
		</div>

		{foreach from=$formToolbars key=item item=output}
			<div class="control-group">
				{formlabel label=`$output.label` for=$item}
				{forminput}
					{html_options values=$formToolbarChoices output=$formToolbarChoices selected=$gBitSystem->getConfig($item) name=$item}
					{formhelp note=`$output.note`}
				{/forminput}
			</div>
		{/foreach}

		{foreach from=$formSkin key=item item=output}
			<div class="control-group">
				{formlabel label=`$output.label` for=$item}
				{forminput}
					{html_options values=$formSkinChoices output=$formSkinChoices selected=$gBitSystem->getConfig($item) name=$item}
					{formhelp note=`$output.note`}
				{/forminput}
			</div>
		{/foreach}

		<div class="control-group submit">
			<input type="hidden" name="page" value="{$page}" />
			<input type="submit" class="btn" name="change_prefs" value="{tr}Change preferences{/tr}" />
		</div>
	{/legend}
{/form}
{/strip}
