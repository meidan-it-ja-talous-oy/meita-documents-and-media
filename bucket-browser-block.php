<?php
/**
 * Plugin Name:     bucket-browser Block
 * Description:     bucket-browser block description
 * Version:         Development
 * Author:          Meidän IT ja Talous Oy
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     bucket-browser-block
 *
 * @package         bucket-browser-block
 */

 // Admin options page for setting defaults
require plugin_dir_path( __DIR__ ) . basename( __DIR__ ) . '/admin.php';

function bucket_browser_block_init() {
	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build`'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'create-bucket-browser-block',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);
	wp_set_script_translations( 'create-bucket-browser-block', 'bucket-browser-block' );

    wp_localize_script( 'create-bucket-browser-block', 'bucketbrowserBlockDefaults', array( 
        'bucketbrowseroptions' => get_option('bucketbrowser_options') ) );

    register_block_type( 'bucket-browser-block/bucketbrowser', array(
		'editor_script' => 'create-bucket-browser-block',
	) );
}
add_action( 'init', 'bucket_browser_block_init' );


if (file_exists( ABSPATH . 'wp-content/plugins/filebird' ) && is_admin()) {
    function add_bucket_filebird_bearer_token() {
        wp_localize_script('create-bucket-browser-block', 'apikey', array(
            'FILEBIRD_BEARER_TOKEN' => get_option('fbv_rest_api_key')
        ));
    }
    add_action('admin_enqueue_scripts', 'add_bucket_filebird_bearer_token');
}


function bucketbrowser_block_plugin_settings_link( $links ) : array {
	$label = esc_html__( 'Settings', 'bucketbrowser-plugin' );
	$slug  = 'bucketbrowser-settings';

	array_unshift( $links, "<a href='options-general.php?page=$slug'>$label</a>" );

	return $links;
}
add_action( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'bucketbrowser_block_plugin_settings_link', 10 );

function wpb_meita_document_block_hook_javascript() {
?>
   
   
<?php
}
add_action('wp_head', 'wpb_meita_document_block_hook_javascript');