<?php

/** 
 * Meita showMedia - block
 * 
 * Registers block and js sript file.
 * 
 * @return void
 */

 function meita_documents_and_media_show_media_init() 
{
	$dir = dirname(__FILE__);


	$script_asset_path = plugin_dir_path(__FILE__) . 'index.asset.php';
	$asset_file = file_exists($script_asset_path) ? include($script_asset_path) : array('dependencies' => array(), 'version' => '1.0' );
	$plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), 'plugin');
	//$plugin_version = $plugin_data['Version'] ?? null;

	//ladataan index.asset.php
	wp_register_script(
		'meita-documents-and-media-show-media-editor-script',
		plugins_url('/index.js', __FILE__), 
		$asset_file['dependencies'],
		$asset_file['version']
		
	);
	wp_set_script_translations(
		'meita-documents-and-media-show-media-editor-script', 
		'meita-documents-and-media',  
		WP_PLUGIN_DIR . '/meita-documents-and-media/languages'
	);

 	
	//editor CSS lataus
	wp_register_style(
		'meita-documents-and-media-show-media-style',
		plugins_url('style-index.css', __FILE__),
		array(),
		'1.0'
	);

	wp_register_style(
		'meita-documents-and-media-show-media-index-style',
		plugins_url('index.css', __FILE__),
		array(),
		'1.0'
	);

	// testataan löytyykö filter-script
	$path = plugin_dir_path(__FILE__) . '../../js/filter-script.js';
	if (!file_exists($path)) {
		error_log("🔥 filter-script.js EI löydy polusta: " . realpath($path));
	} else {
		error_log("✅ filter-script.js löytyi: " . realpath($path));
	}

	//rekisteröidään filter-script
	wp_register_script(
        'meita-documents-and-media-filter-script',
		plugins_url( '../../js/filter-script.js', __FILE__ ),
        array('jquery-core'),
        $asset_file['version'],
        true
    );

	wp_enqueue_script('meita-documents-and-media-filter-script');

	$options = get_option('documents_options');
	$field_value = isset($options['GCPBucketAPIurl']) ? $options['GCPBucketAPIurl'] : '';
	$range_value = isset( $attributes['range'] ) ? esc_attr( $attributes['range'] ) : '';

	wp_localize_script(
		'meita-documents-and-media-filter-script',
		'bucketBrowserData',
		array(
			'allFiles' => $field_value,
			'rangeValue'=> $range_value,
		)
	);

	wp_localize_script(
    'meita-documents-and-media-show-bucket-filter-script',
    'meita_translations',
    array(
        'download' => __( 'Download file', 'meita-documents-and-media' ),
        'open'     => __( 'Open file', 'meita-documents-and-media' ),
		'modified' => __( 'Modified','meita-documents-and-media' ),
		'previous' => __( 'Previous page','meita-documents-and-media' ),
		'next'     => __( 'Next page','meita-documents-and-media' ),
		'page'     => __( 'Page','meita-documents-and-media' ),
		'of'       => __( ' of ','meita-documents-and-media' ),
    )
);

	wp_localize_script(
    	'meita-documents-and-media-filter-script',
    	'documentsBlockDefaults',
    	array(
        	'bucketbrowseroptions' => get_option('documents_options')
    	)
	);

	wp_localize_script(
    	'meita-documents-and-media-filter-script',
    	'apikey',
    	array(
        	'FILEBIRD_BEARER_TOKEN' => get_option('fbv_rest_api_key')
    	)
	);

	//wp_set_script_translations('create-bucket-browser-block', 'bucket-browser-block');
	$range_value = isset( $attributes['range'] ) ? esc_attr( $attributes['range'] ) : '';
	$blockId_value = isset( $attributes['blockId'] ) ? esc_attr( $attributes['blockId'] ) : '';

	wp_localize_script(
		'meita-documents-and-media-show-media',
		'documentsBlockDefaults',
		array(
			'documentsoptions' => get_option('documents_options'),
			'per_page' => $range_value, // Default items per page
			'blockId'=> $blockId_value
		)
	);

	// Register block
	register_block_type_from_metadata(
		__DIR__,
		array(
			'title' => __('Show media documents', 'meita-documents-and-media'),
			'description' => __('Wordpress plugin which collects documents from Medialibrary', 'meita-documents-and-media')
		)
	);

}
add_action('init', 'meita_documents_and_media_show_media_init');




// Lataa filter-script vain jos lohko on sivulla
function meita_documents_and_media_show_media_enqueue_assets($attributes) {
	if (is_singular() && has_block('meita-documents-and-media/show-media', get_post())) {

		wp_enqueue_script('meita-documents-and-media-filter-script');

		$options = get_option('documents_options');
		$field_value = isset($options['GCPBucketAPIurl']) ? $options['GCPBucketAPIurl'] : '';
		$range_value = isset($attributes['range']) ? esc_attr($attributes['range']) : '';

		wp_localize_script(
			'meita-documents-and-media-filter-script',
			'bucketBrowserData',
			array(
				'allFiles' => $field_value,
				'rangeValue' => $range_value,
			)
		);
	}
}
add_action('wp_enqueue_scripts', 'meita_documents_and_media_show_media_enqueue_assets');


/**
 * fileBird tokeni adminiin
 */
if (file_exists(ABSPATH . 'wp-content/plugins/filebird')&& is_admin()) {
	function add_bucket_filebird_bearer_token_media_block()
	{
		$token = get_option('fbv_rest_api_key');
		wp_localize_script(
			'meita-documents-and-media-show-media-editor-script',
			'apikey',
			array(
				'FILEBIRD_BEARER_TOKEN' => get_option('fbv_rest_api_key')
			)
		);
		error_log('Filebird API avain: ' . get_option('fbv_rest_api_key'));

	}

	add_action('enqueue_block_editor_assets', 'add_bucket_filebird_bearer_token_media_block');
}


/**
 * Asetuslinkki
 */
function media_block_plugin_settings_link($links): array
{
	$label = esc_html__('Settings', 'meita-documents-and-media');
	$slug = 'documents-settings';
	array_unshift($links, "<a href='options-general.php?page=$slug'>$label</a>");
	return $links;
}
add_action('plugin_action_links_' . plugin_basename(__FILE__), 'media_block_plugin_settings_link', 10);




/**
 * Ikonien lataus
 */
function media_enqueue_iconify_admin_script() {
	if (is_admin()) {
		wp_enqueue_script(
			'iconify-admin-script', 
			'https://code.iconify.design/2/2.1.2/iconify.min.js', 
			array(), 
			'2.1.2', 
			true
		);
	}
}
add_action('enqueue_block_editor_assets', 'media_enqueue_iconify_admin_script');

function load_iconify_script_media()
{
	wp_enqueue_script(
		'iconify-script', 
		'https://code.iconify.design/2/2.1.2/iconify.min.js', 
		array(), 
		'2.1.2', 
		true
	);
}
add_action('wp_enqueue_scripts', 'load_iconify_script_media');




/**
 * Sivutuksen plugari
 */
function get_paginated_results_media_block($page = 1, $per_page = 5) {
    $offset = ($page - 1) * $per_page;

	$options = get_option('documents_options');
	$field_value = isset($options['GCPBucketAPIurl']) ? $options['GCPBucketAPIurl'] : '';
	$range_value = isset( $attributes['range'] ) ? esc_attr( $attributes['range'] ) : '';

    // Fetch data from the source with pagination
    $args = array(
        'offset' => $offset,
        'number' => $per_page,
        // Add any other arguments needed
    );

}

/*
function meita_documents_and_media_show_bucket_enqueue_assets($attributes) {
    // Check if the block is being rendered and enqueue assets
    if (has_block('meita-documents-and-media-show')) {
        filter_script($attributes);
    }
}
add_action('enqueue_block_assets', 'meita_documents_and_media_show_bucket_enqueue_assets');*/




/**
 * logitus
 */
meita_documents_log_debug("testi");