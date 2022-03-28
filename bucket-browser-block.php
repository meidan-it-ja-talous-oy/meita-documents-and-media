<?php
/**
 * Plugin Name:     bucket-browser Block
 * Description:     bucket-browser block description
 * Version:         1.0.0
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

    wp_localize_script( 'create-bucket-browser-block', 'bucketbrowserBlockDefaults', get_option( 'bucketbrowser_options' ) );

    register_block_type( 'bucket-browser-block/bucketbrowser', array(
		'editor_script' => 'create-bucket-browser-block',
	) );
}
add_action( 'init', 'bucket_browser_block_init' );

function bucketbrowser_block_plugin_settings_link( $links ) : array {
	$label = esc_html__( 'Settings', 'bucketbrowser-plugin' );
	$slug  = 'bucketbrowser-settings';

	array_unshift( $links, "<a href='options-general.php?page=$slug'>$label</a>" );

	return $links;
}
add_action( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'bucketbrowser_block_plugin_settings_link', 10 );

function wpb_meita_document_block_hook_javascript() {
?>
    <style>
    .bucket-browser-block-listitem {
        display: flex;
    }
    .bucket-browser-block-listitem .bucket-browser-block-icon {
        width: 50px;
        height: 65px;
        margin-right: 15px;
        border-radius: 5px;
    }
    .bucket-browser-block-listitem .bucket-browser-block-icon span,
    .bucket-browser-block-listitem .bucket-browser-block-icon svg {
        font-size: 54px;
        margin: 5px;
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
    </style>
    <script src="https://code.iconify.design/2/2.1.2/iconify.min.js"></script>
	<script>

        function fetchFolderContents(wordpressFoldersConfig, index) {
            var selectedType = wordpressFoldersConfig.attributes["meta-type"].nodeValue;
            var showIcon = wordpressFoldersConfig.attributes["meta-showIcon"].nodeValue;
            var showDescription = wordpressFoldersConfig.attributes["meta-showDescription"].nodeValue;
            var showDate = wordpressFoldersConfig.attributes["meta-showDate"].nodeValue;
            var showDownloadLink = wordpressFoldersConfig.attributes["meta-showDownloadLink"].nodeValue;
            if(selectedType == "folder") {
                var selectedFolder = wordpressFoldersConfig.attributes["meta-folders"].nodeValue;
                var fbak = wordpressFoldersConfig.attributes["meta-fbak"].nodeValue;
                fetch("/wp-json/filebird/public/v1/attachment-id/?folder_id="+selectedFolder, {headers: { "Authorization": `Bearer ${fbak}` }} )
                .then(response => response.json())
                .then(data => {
                    fetch( "/wp-json/wp/v2/media?per_page=100&include="+data.data.attachment_ids )
                    .then(rawFiles => rawFiles.json())
                    .then(files => {
                        let rawHtml = "";
                        let modifiedDate = "";
                        files.map((item, index) => {
                            modifiedDate = new Date(item.modified);
                            rawHtml += (`<li class='bucket-browser-block-listitem' key=${index}>
                                <div class='bucket-browser-block-icon ${item.mime_type}'>
                                    ${ showIcon && (item.mime_type.indexOf("application") != -1) ? `<span class="iconify" data-icon="fa-solid:file"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("audio") != -1) ? `<span class="iconify" data-icon="fa-solid:file-audio"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("image") != -1) ? `<span class="iconify" data-icon="fa-solid:file-image"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("video") != -1) ? `<span class="iconify" data-icon="fa-solid:file-video"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("text") != -1)  ? `<span class="iconify" data-icon="fa-solid:file-alt"></span>` : "" }
                                </div>
                                <div class='bucket-browser-block-content'>
                                    <a rel="noopener" target="_blank" href=${item.link}>${item.title.rendered}</a>
                                    ${ showDate ? `<p class='date'>${ modifiedDate.getDate() +"."+ (modifiedDate.getMonth()+1) +"."+ modifiedDate.getFullYear()}</p>` : "" }
                                    ${ showDescription ? `<p class='description'>${item.caption.rendered}</p>` : "" }
                                    ${ showDownloadLink ? `<a class='download-link' href=${item.source_url}>Lataa</a>` : "" }
                                </div>
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
                fetch( "/wp-json/wp/v2/media?per_page=100&include="+selectedFiles )
                    .then(rawFiles => rawFiles.json())
                    .then(files => {
                        let rawHtml = "";
                        let modifiedDate = "";
                        files.map((item, index) => {
                            modifiedDate = new Date(item.modified);
                            rawHtml += (`<li class='bucket-browser-block-listitem' key=${index}>
                                <div class='bucket-browser-block-icon ${item.mime_type}'>
                                    ${ showIcon && (item.mime_type.indexOf("application") != -1) ? `<span class="iconify" data-icon="fa-solid:file"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("audio") != -1) ? `<span class="iconify" data-icon="fa-solid:file-audio"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("image") != -1) ? `<span class="iconify" data-icon="fa-solid:file-image"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("video") != -1) ? `<span class="iconify" data-icon="fa-solid:file-video"></span>` : "" }
                                    ${ showIcon && (item.mime_type.indexOf("text") != -1)  ? `<span class="iconify" data-icon="fa-solid:file-alt"></span>` : "" }
                                </div>
                                <div class='bucket-browser-block-content'>
                                    <a rel="noopener" target="_blank" href=${item.link}>${item.title.rendered}</a>
                                    ${ showDate ? `<p class='date'>${ modifiedDate.getDate() +"."+ (modifiedDate.getMonth()+1) +"."+ modifiedDate.getFullYear()}</p>` : "" }
                                    ${ showDescription ? `<p class='description'>${item.caption.rendered}</p>` : "" }
                                    ${ showDownloadLink ? `<a class='download-link' href=${item.source_url}>Lataa</a>` : "" }
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
            if(document.getElementsByClassName("wordpressFolders").length > 0) {
                var wordpressFoldersConfigs = document.getElementsByClassName("wordpressFolders");
                for (var i = 0; i < wordpressFoldersConfigs.length; i++) {
                    fetchFolderContents(wordpressFoldersConfigs[i], i)
                }
            }
		}
		window.onload = meitaLoadDocuments;
	</script>
<?php
}
add_action('wp_head', 'wpb_meita_document_block_hook_javascript');