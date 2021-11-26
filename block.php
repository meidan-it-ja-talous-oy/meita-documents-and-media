<?php
/**
 * Plugin Name:     bucket-browser Block
 * Description:     bucket-browser block description
 * Version:         1.0.0
 * Author:          Meidän IT ja Talous Oy
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     microservices-block
 *
 * @package         bucket-browser-block
 */

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


	register_block_type( __DIR__ );
}
add_action( 'init', 'bucket_browser_block_init' );

?>