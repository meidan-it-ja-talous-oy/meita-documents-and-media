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
require plugin_dir_path(__DIR__) . basename(__DIR__) . '/admin.php';



function bucket_browser_block_init() 
{
	$dir = dirname(__FILE__);

	$script_asset_path = "$dir/build/index.asset.php";
	if (!file_exists($script_asset_path)) {
		throw new Error(
			'You need to run `npm start` or `npm run build`'
		);
	}
	$index_js = 'build/index.js';
	$script_asset = require($script_asset_path);

	wp_register_script(
		'create-bucket-browser-block',
		plugins_url($index_js, __FILE__), 
		$script_asset['dependencies'],
		$script_asset['version']
		
	);

	//wp_set_script_translations('create-bucket-browser-block', 'bucket-browser-block');
	$range_value = isset( $attributes['range'] ) ? esc_attr( $attributes['range'] ) : '';
	$blockId_value = isset( $attributes['blockId'] ) ? esc_attr( $attributes['blockId'] ) : '';

	wp_localize_script(
		'create-bucket-browser-block',
		'bucketbrowserBlockDefaults',
		array(
			'bucketbrowseroptions' => get_option('bucketbrowser_options'),
			'per_page' => $range_value, // Default items per page
			'blockId'=> $blockId_value
		)
	);

	wp_enqueue_style(
		'bucket-browser-block-styles',
		plugins_url('build/style-index.css', __FILE__),
		array(),
		filemtime(plugin_dir_path(__FILE__) . 'build/style-index.css')
	);

	register_block_type(
		'bucket-browser-block/bucketbrowser',
		array(
			'editor_script' => 'create-bucket-browser-block',
			'style' => 'bucket-browser-block-styles'
			// 'render_callback' => 'wp_filter_enqueue_scripts',
		),

	);
	
	$plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), 'plugin');
	$plugin_version = $plugin_data['Version'] ?? null;
 
	wp_enqueue_script(
    	'filter-script',
    	plugins_url('build/filter-script.js', __FILE__),
   		array('jquery'),
    	$plugin_version, // Dynamically set version
    	true // Load in footer
	);

	
}
add_action('init', 'bucket_browser_block_init');

if(!is_admin()) {
    // Only make API calls when necessary
    add_action('wp_enqueue_scripts', 'filter_script');
}

function bucket_browser_enqueue_assets($attributes) {
    // Check if the block is being rendered and enqueue assets
    if (has_block('bucket-browser-block/bucket-browser-block')) {
        filter_script($attributes);
    }
}
add_action('enqueue_block_assets', 'bucket_browser_enqueue_assets');




function filter_script($attributes){

	//$attributes=  $attributes = get_transient('bucket_browser_attributes') ?: array();

	wp_enqueue_script(
        'filter-script',
        plugins_url('build/filter-script.js', __FILE__),
        array('jquery'),
        null,
        true // Load in footer
    );

	$options = get_option('bucketbrowser_options');
	$field_value = isset($options['GCPBucketAPIurl']) ? $options['GCPBucketAPIurl'] : '';
	$range_value = isset( $attributes['range'] ) ? esc_attr( $attributes['range'] ) : '';

	wp_localize_script(
		'filter-script',
		'bucketBrowserData',
		array(
			'allFiles' => $field_value,
			'rangeValue'=> $range_value,
		)
	);

	wp_enqueue_script('filter-script');
}

function get_paginated_results($page = 1, $per_page = 5) {
    $offset = ($page - 1) * $per_page;

	$options = get_option('bucketbrowser_options');
	$field_value = isset($options['GCPBucketAPIurl']) ? $options['GCPBucketAPIurl'] : '';
	$range_value = isset( $attributes['range'] ) ? esc_attr( $attributes['range'] ) : '';

    // Fetch data from the source with pagination
    $args = array(
        'offset' => $offset,
        'number' => $per_page,
        // Add any other arguments needed
    );

}


if (file_exists(ABSPATH . 'wp-content/plugins/filebird') && is_admin()) {
	function add_bucket_filebird_bearer_token()
	{
		wp_localize_script(
			'create-bucket-browser-block',
			'apikey',
			array(
				'FILEBIRD_BEARER_TOKEN' => get_option('fbv_rest_api_key')
			)
		);
	}
	add_action('admin_enqueue_scripts', 'add_bucket_filebird_bearer_token');
}


function bucketbrowser_block_plugin_settings_link($links): array
{
	$label = esc_html__('Settings', 'bucketbrowser-plugin');
	$slug = 'bucketbrowser-settings';

	array_unshift($links, "<a href='options-general.php?page=$slug'>$label</a>");

	return $links;
}
add_action('plugin_action_links_' . plugin_basename(__FILE__), 'bucketbrowser_block_plugin_settings_link', 10);


function load_iconify_script()
{
	wp_enqueue_script('iconify-script', 'https://code.iconify.design/2/2.1.2/iconify.min.js', array(), '2.1.2', true);
}
add_action('wp_enqueue_scripts', 'load_iconify_script');

function enqueue_iconify_admin_script()
{
	// Enqueue script only on the WordPress admin editor page
	if (is_admin()) {
		// Enqueue your script
		wp_enqueue_script('iconify-admin-script', 'https://code.iconify.design/2/2.1.2/iconify.min.js', array('jquery'), '2.1.2', true);
	}
}




add_action('admin_enqueue_scripts', 'enqueue_iconify_admin_script');


