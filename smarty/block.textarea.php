<?php
  /**
   * Smarty plugin
   * @package Smarty
   * @subpackage plugins
   */

  /**
   * Smarty block plugin
   * Requires PHP >= 4.3.0
   * -------------------------------------------------------------
   * Type: block
   * Name: textarea
   * Version: 1.0
   * Author: gazoot (gazoot care of gmail dot com)
   * Purpose: Creates a textarea
   * -------------------------------------------------------------
   */
require_once(FCKEDITOR_PKG_PATH . 'smarty/block.fckeditor.php');
function smarty_block_textarea($params, $content, &$smarty)
{
	global $gBitSystem;

	if ($content) {
		if ($gBitSystem->isPackageActive('fckeditor')) {
			$out = smarty_block_fckeditor($params,$content,$smarty);
		}
		else {
			$out = '<textarea ';
			
			foreach ($params as $key => $value) {
				$out = $out . $key . '="' . $value . '" ';
			}
			
			$out = $out . ">" . $content . "</textarea>";
		}
	}

	return $out;
}
