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
	<script>

        function fetchFolderContents(wordpressFoldersConfig, index) {
            var selectedFolder = wordpressFoldersConfig.attributes["meta-folders"].nodeValue;
            var fbak = wordpressFoldersConfig.attributes["meta-fbak"].nodeValue;
            var showIcon = wordpressFoldersConfig.attributes["meta-showIcon"].nodeValue;
            var showDescription = wordpressFoldersConfig.attributes["meta-showDescription"].nodeValue;
            var showDate = wordpressFoldersConfig.attributes["meta-showDate"].nodeValue;
            var showDownloadLink = wordpressFoldersConfig.attributes["meta-showDownloadLink"].nodeValue;
            fetch("/wp-json/filebird/public/v1/attachment-id/?folder_id="+selectedFolder, {headers: { "Authorization": `Bearer ${fbak}` }} )
            .then(response => response.json())
            .then(data => {
                fetch( "/wp-json/wp/v2/media?include="+data.data.attachment_ids, {headers: { "Authorization": `Bearer ${fbak}` }} )
                .then(rawFiles => rawFiles.json())
                .then(files => {
                    let rawHtml = "";
                    let modifiedDate = "";
                    files.map((item, index) => {
                        modifiedDate = new Date(item.modified);
                        rawHtml += (`<li class='bucket-browser-block-listitem' key=${index}>
                            <div class='bucket-browser-block-icon'>
                                ${ showIcon && (item.mime_type.indexOf("application") != -1) ? `<span class="dashicons dashicons-media-document"></span>` : "" }
                                ${ showIcon && (item.mime_type.indexOf("audio") != -1) ? `<span class="dashicons dashicons-media-audio"></span>` : "" }
                                ${ showIcon && (item.mime_type.indexOf("image") != -1) ? `<span class="dashicons dashicons-format-image"></span>` : "" }
                                ${ showIcon && (item.mime_type.indexOf("video") != -1) ? `<span class="dashicons dashicons-format-video"></span>` : "" }
                                ${ showIcon && (item.mime_type.indexOf("text") != -1)  ? `<span class="dashicons dashicons-media-text"></span>` : "" }
                            </div>
                            <div class='bucket-browser-block-content'>
                                <a rel="noopener" target="_blank" href=${item.link}>${item.title.rendered}</a>
                                ${ showDate ? `<p class='date'>${ modifiedDate.getDay() +"."+ modifiedDate.getMonth() +"."+ modifiedDate.getFullYear()}</p>` : "" }
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
        }

		function meitaLoadDocuments() {
            if(document.getElementsByClassName("wordpressFolders").length > 0) {
                var wordpressFoldersConfigs = document.getElementsByClassName("wordpressFolders");
                for (var i = 0; i < wordpressFoldersConfigs.length; i++) {
                    fetchFolderContents(wordpressFoldersConfigs[i], i)
                }
            }
			var documentLists = document.getElementsByClassName("meitaDocumentList");
			for (var i = 0; i < documentLists.length; i++) {
				console.log("iiiiii")
			}
		}
		window.onload = meitaLoadDocuments;
	</script>
<?php
}
add_action('wp_head', 'wpb_meita_document_block_hook_javascript');