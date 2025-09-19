<?php
/**
 * Meita documents-and-media options
 */
function documents_and_media_options_page()
{

    add_options_page(
        __('Documents and media settings', 'meita-documents-and-media'),
        __('Meita documents and media', 'meita-documents-and-media'),
        'manage_options',
        'documents-settings',
        'documents_options_page_html',
        20
    );
}
add_action('admin_menu', 'documents_and_media_options_page');

/**
 * Documents and media init
 */
function documents_and_media_options_page_init()
{
    // Attach save handling filter
    add_filter('pre_update_option_document_block_patterns', 'document_block_patterns_before_save', 10, 3);

}
add_action('admin_init', 'documents_and_media_options_page_init');


/**
 * Options page init
 */
function documents_and_media_settings_init()
{
    // Register setting for disabling Wordpress core patterns
    register_setting('documents_options', 'documents_options');

    add_settings_section(
        'documents_defaults_section',
        '',
        '',
        'documents'
    );

    add_settings_field(
        'Default GCP Bucket API url',   // As of WP 4.6 this value is used only internally.
        __('Default GCP Bucket API url', 'meita-documents-and-media'),
        'documents_text_field',
        'documents',
        'documents_defaults_section',
        array(
            'field' => 'GCPBucketAPIurl',
            'description' => __('GCP Bucket API url', 'meita-documents-and-media')
        )
    );
}

add_action('admin_init', 'documents_and_media_settings_init', 30);

/**
 * Document and media options
 */
function documents_text_field($args)
{
    $options = get_option('documents_options');
    $thevalue = isset($options[$args['field']]) ? $options[$args['field']] : '';
    ?>
    <p>
        <label for="documents_options_<?php echo $args['field']; ?>">
            <input id="documents_options_<?php echo $args['field']; ?>"
                name="documents_options[<?php echo $args['field']; ?>]" value="<?php echo $thevalue; ?>" />
            <?php echo $args['description']; ?>
        </label>
    </p>
    <?php
}

/**
 * Top level menu callback function
 */
function documents_options_page_html()
{
    // check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // show error/update messages
    settings_errors('documents_messages');
    ?>
    <div class="wrap">
        <h1>
            <?php echo esc_html(get_admin_page_title()); ?>
        </h1>
        <form action="options.php" method="post">
            <?php
            // output security fields for the registered setting "bucketbrowser_options"
            settings_fields('documents_options');
            // output setting sections and their fields
            // (sections are registered for "bucketbrowser", each field is registered to a specific section)
            do_settings_sections('documents');
            // output save settings button
            submit_button(__('Save Pattern', 'meita-documents-and-media'));

            if (isset($_GET['pattern'])) {
                ?>
            <?php } ?>
        </form>
    </div>
    <?php

}