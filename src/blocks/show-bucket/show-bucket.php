<?php

/** 
 * Meita showBucket - block
 * 
 * Registers block and js sript file.
 * 
 * @return void
 */

 function meita_documents_and_media_show_bucket_init() 
{
	$dir = dirname(__FILE__);

	$editor_script_asset_path = plugin_dir_path(__FILE__) . 'index.asset.php';
	$asset_file = file_exists($editor_script_asset_path) ? include($editor_script_asset_path) : array('dependencies' => array(), 'version' => '1.0' );
	
	//ladataan index.asset.php
	wp_register_script(
		'meita-documents-and-media-show-bucket-editor-script',
		plugins_url('index.js', __FILE__), 
		$asset_file['dependencies'],
		$asset_file['version']
		
	);
	wp_set_script_translations(
		'meita-documents-and-media-show-bucket-editor-script', 
		'meita-documents-and-media',  
		WP_PLUGIN_DIR . '/meita-documents-and-media/languages'
	);

	//ladataan tyylitiedostot
	wp_register_style(
    	'meita-documents-and-media-show-bucket-style',
    	plugins_url('style-index.css', __FILE__),
    	array(),
    	'1.0'
	);

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
	$editor_data = array(
    	'GCPBucketAPIurl' => $options['GCPBucketAPIurl'] ?? '',
	);

	wp_localize_script(
    	'meita-documents-and-media-filter-script',
    	'documentsBlockDefaults',
    	array(
        	'bucketbrowseroptions' => get_option('documents_options')
    	)
	);


	// Register block
	register_block_type_from_metadata(
		__DIR__,
		array(
			'title' => __('Show bucket documents', 'meita-documents-and-media'),
			'description' => __('Wordpress plugin which collects documents from Google Bucket', 'meita-documents-and-media'),
		)
	);		
}
add_action('init', 'meita_documents_and_media_show_bucket_init');



function meita_documents_and_media_show_bucket_enqueue_assets() {

	 
	if ( ! is_admin() ) { // vain frontti

        // Hae vain tarvittavat arvot
        $options     = get_option('documents_options');
        $bucket_url  = $options['GCPBucketAPIurl'] ?? '';


        wp_localize_script(
            'meita-documents-and-media-filter-script',
            'bucketBrowserData',
            [
                'allFiles' => $bucket_url,
            ]
        );

        wp_localize_script(
            'meita-documents-and-media-filter-script',
            'meita_translations',
            [
                'download' => __( 'Download file', 'meita-documents-and-media' ),
                'open'     => __( 'Open file', 'meita-documents-and-media' ),
                'modified' => __( 'Modified','meita-documents-and-media' ),
                'previous' => __( 'Previous page','meita-documents-and-media' ),
                'next'     => __( 'Next page','meita-documents-and-media' ),
                'page'     => __( 'Page','meita-documents-and-media' ),
                'of'       => __( ' of ','meita-documents-and-media' ),
            ]
        );
    }  
}
add_action('wp_enqueue_scripts', 'meita_documents_and_media_show_bucket_enqueue_assets');

/**
 * Asetuslinkki
 */
function documents_show_bucket_block_plugin_settings_link($links): array
{
	$label = esc_html__('Settings', 'meita-documents-and-media');
	$slug = 'documents-settings';
	array_unshift($links, "<a href='options-general.php?page=$slug'>$label</a>");
	return $links;
}
add_action('plugin_action_links_' . plugin_basename(__FILE__), 'documents_show_bucket_block_plugin_settings_link', 10);


/**
 * Ikonien lataus
 */
function show_bucket_enqueue_iconify_admin_script() {
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
add_action('enqueue_block_editor_assets', 'show_bucket_enqueue_iconify_admin_script');

function show_bucket_load_iconify_script()
{
	wp_enqueue_script(
		'iconify-script', 
		'https://code.iconify.design/2/2.1.2/iconify.min.js', 
		array(), 
		'2.1.2', 
		true
	);
}
add_action('wp_enqueue_scripts', 'show_bucket_load_iconify_script');




/**
 * Sivutuksen plugari
 */
function show_bucket_get_paginated_results($page = 1, $per_page = 5) {
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


/**
 * logitus
 */
