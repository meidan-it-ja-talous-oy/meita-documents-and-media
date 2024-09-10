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

	wp_localize_script(
		'create-bucket-browser-block',
		'bucketbrowserBlockDefaults',
		array(
			'bucketbrowseroptions' => get_option('bucketbrowser_options'),
			'per_page' => $range_value, // Default items per page
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

	
}
add_action('init', 'bucket_browser_block_init');

if(!is_admin()) {
    // Only make API calls when necessary
    add_action('wp_enqueue_scripts', 'filter_script');
}


function filter_script(){

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
			'rangeValue'=>$range_value
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

    // Replace this with your actual data fetching logic
   // $results = fetchItems("google",$field_value, $args);

    //return $results;
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

function wpb_meita_document_block_hook_javascript()
{
	?>
	<!-- <style>
		.wp-block-bucket-browser-block-bucket-browser-block .googlebucketlist {
			list-style: none;
		}

		.bucket-browser-block-listitem {
			display: flex;
			margin-bottom: 10px;
		}

		.bucket-browser-block-listitem .bucket-browser-block-icon {
			/* width: 50px; */
			height: 65px;
			margin-right: 15px;
			border-radius: 5px;
		}

		.bucket-browser-block-listitem .bucket-browser-block-icon span,
		.bucket-browser-block-listitem .bucket-browser-block-icon svg {
			font-size: 54px;
			margin: 5px;
			padding-top: 2px;
		}

		.bucket-browser-block-listitem .bucket-browser-block-icon svg {
			font-size: 54px;
			margin: 5px;
		}

		.bucket-browser-block-listitem .bucket-browser-block-content .download-link {
			margin: 0px;
		}

		.bucket-browser-block-listitem .bucket-browser-block-content p {
			margin: 0px;
		}
	</style> -->


	<!-- <script>

		function fetchFolderContents(wordpressFoldersConfig, index) {
			var selectedType = wordpressFoldersConfig.attributes["meta-type"].nodeValue;
			var showIcon = wordpressFoldersConfig.attributes["meta-showIcon"].nodeValue;
			var showDescription = wordpressFoldersConfig.attributes["meta-showDescription"].nodeValue;
			var showDate = wordpressFoldersConfig.attributes["meta-showDate"].nodeValue;
			var showDownloadLink = wordpressFoldersConfig.attributes["meta-showDownloadLink"].nodeValue;
			if (selectedType == "folder") {
				var selectedFolder = wordpressFoldersConfig.attributes["meta-folders"].nodeValue;
				var fbak = wordpressFoldersConfig.attributes["meta-fbak"].nodeValue;
				fetch("/wp-json/filebird/public/v1/attachment-id/?folder_id=" + selectedFolder, { headers: { "Authorization": `Bearer ${fbak}` } })
					.then(response => response.json())
					.then(data => {
						fetch("/wp-json/wp/v2/media?per_page=100&include=" + data.data.attachment_ids)
							.then(rawFiles => rawFiles.json())
							.then(files => {
								let rawHtml = "";
								let modifiedDate = "";
								files.map((item, index) => {
									modifiedDate = new Date(item.modified);
									rawHtml += (
										`<li class='bucket-browser-block-listitem' key=${index}?>">	
										<div class='bucket-browser-block-icon ${item.mime_type}'>																																																													
										${showIcon && (item.mime_type.indexOf("application") != -1) ? `<span class="iconify" data-icon="fa-solid:file"></span>` : ""}
																																																																																						
										${showIcon && (item.mime_type.indexOf("audio") != -1) ? `<span class="iconify" data-icon="fa-solid:file-audio"></span>` : ""}
																																																																																						
										${showIcon && (item.mime_type.indexOf("image") != -1) ? `<span class="iconify" data-icon="fa-solid:file-image"></span>` : ""}
																																																																																						
										${showIcon && (item.mime_type.indexOf("video") != -1) ? `<span class="iconify" data-icon="fa-solid:file-video"></span>` : ""}
																																																																																						
										${showIcon && (item.mime_type.indexOf("text") != -1) ? `<span class="iconify" data-icon="fa-solid:file-alt"></span>` : ""}
																																																																																					
										</div>
																																																																																					
										<div class='bucket-browser-block-content'>
																																																																																						
										<a rel="noopener" target="_blank" href=${item.link}>${item.title.rendered}</a>
																																																																																						
										${showDate ? `<p class='date'>${modifiedDate.getDate() + "." + (modifiedDate.getMonth() + 1) + "." + modifiedDate.getFullYear()}</p>` : ""}
																																																																																						
										${showDescription ? `<p class='description'>${item.caption.rendered}</p>` : ""}
																																																																																						
										${showDownloadLink ? `<a class='download-link' href=${item.source_url}>Lataa</a>` : ""}
																																																																																					
										</div>
										<p>TESTI</p>																																																																									
										</li>
																																																																																				
										`);
						
								})
								return rawHtml;
							})
							.then(html => {
								document.getElementsByClassName("wordpressFolders")[index].innerHTML = html;
							})
					})
			} else {
				var selectedFiles = wordpressFoldersConfig.attributes["meta-files"].nodeValue;
				fetch("/wp-json/wp/v2/media?per_page=100&include=" + selectedFiles)
					.then(rawFiles => rawFiles.json())
					.then(files => {
						let rawHtml = "";
						let modifiedDate = "";
						// The file order remains the same in the public view and editing view
						var orderedFiles = files.sort(function (a, b) {
							return selectedFiles.indexOf(a.id) - selectedFiles.indexOf(b.id);
						});
						orderedFiles.map((item, index) => {
							modifiedDate = new Date(item.modified);
							rawHtml += (`<li class='bucket-browser-block-listitem' key=${index}>
																																																																																					<div class='bucket-browser-block-icon ${item.mime_type}'>
																																																																																						${showIcon && (item.mime_type.indexOf("application") != -1) ? `<span class="iconify" data-icon="fa-solid:file"></span>` : ""}
																																																																																						${showIcon && (item.mime_type.indexOf("audio") != -1) ? `<span class="iconify" data-icon="fa-solid:file-audio"></span>` : ""}
																																																																																						${showIcon && (item.mime_type.indexOf("image") != -1) ? `<span class="iconify" data-icon="fa-solid:file-image"></span>` : ""}
																																																																																						${showIcon && (item.mime_type.indexOf("video") != -1) ? `<span class="iconify" data-icon="fa-solid:file-video"></span>` : ""}
																																																																																						${showIcon && (item.mime_type.indexOf("text") != -1) ? `<span class="iconify" data-icon="fa-solid:file-alt"></span>` : ""}
																																																																																					</div>
																																																																																					<div class='bucket-browser-block-content'>
																																																																																						<a rel="noopener" target="_blank" href=${item.link}>${item.title.rendered}</a>
																																																																																						${showDate ? `<p class='date'>${modifiedDate.getDate() + "." + (modifiedDate.getMonth() + 1) + "." + modifiedDate.getFullYear()}</p>` : ""}
																																																																																						${showDescription ? `<p class='description'>${item.caption.rendered}</p>` : ""}
																																																																																						${showDownloadLink ? `<a class='download-link' href=${item.source_url}>Lataa</a>` : ""}
																																																																																					</div>
																																																																																				</li>
																																																																																				`);
						})
						return rawHtml;
					})
					.then(html => {
						document.getElementsByClassName("wordpressFolders")[index].innerHTML = html;
					})
			}
		}

		function meitaLoadDocuments() {
			if (document.getElementsByClassName("wordpressFolders").length > 0) {
				var wordpressFoldersConfigs = document.getElementsByClassName("wordpressFolders");
				for (var i = 0; i < wordpressFoldersConfigs.length; i++) {
					fetchFolderContents(wordpressFoldersConfigs[i], i)
				}
			}
		}
		window.onload = meitaLoadDocuments;
	</script> -->
	<?php
}
add_action('wp_head', 'wpb_meita_document_block_hook_javascript');

