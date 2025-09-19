<?php
/**
 * Plugin Name:        Meita documents and media
 * Description:        Documents and media block description
 * Version:            Development
 * Author:             Meidän IT ja Talous Oy
 * License:            GPL-2.0-or-later
 * License URI:        https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:        meita-documents-and-media
 * Domain Path: 	   /languages
 *
 * @version           Development
 * @author:           Meidän IT ja Talous Oy
 */



/**
 * Load text domain and languages
 *
 * @return void
 */

function documents_and_media_load_textdomain() {
	load_plugin_textdomain( 'meita-documents-and-media', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	
}
add_action( 'init', 'documents_and_media_load_textdomain' );


defined('ABSPATH') || exit;



// Require admin options page
require plugin_dir_path(__FILE__) . 'admin/admin.php';


// Blocks, Every block has its own folder
require plugin_dir_path( __FILE__ ) . 'blocks/show-bucket/show-bucket.php';
require plugin_dir_path( __FILE__ ) . 'blocks/show-media/show-media.php';

/**
 * Error & debug logging only if WP_DEBUG is on
 *
 * @param string $message
 */
if (defined('WP_DEBUG') && WP_DEBUG === true) {
	$initial_mem = round(memory_get_usage(false) / 1024, 0);
   }
function meita_documents_log_debug($message) {
	if (defined('WP_DEBUG') && WP_DEBUG === true) {
	 global $initial_mem;
	 $memory = (round(memory_get_usage(false) / 1024, 0) - $initial_mem)/1000 . ' MB';
	 error_log('[Meita documents] '.$memory.' '.$message);
	}
}