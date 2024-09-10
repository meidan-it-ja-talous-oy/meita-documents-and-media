<?php
function bucketbrowser_options_page()
{

    add_options_page(
        __('Bucket browser defaults', 'bucketbrowser'),
        __('Meita bucket browser', 'bucketbrowser'),
        'manage_options',
        'bucketbrowser-settings',
        'bucketbrowser_options_page_html',
        20
    );

}
add_action('admin_menu', 'bucketbrowser_options_page');

function bucketbrowser_options_page_init()
{

    // Attach save handling filter
    add_filter('pre_update_option_bucketbrowser_block_patterns', 'bucketbrowser_block_patterns_before_save', 10, 3);

}
add_action('admin_init', 'bucketbrowser_options_page_init');

/**
 * Options page init
 */
function bucketbrowser_settings_init()
{

    // Register setting for disabling Wordpress core patterns
    register_setting('bucketbrowser_options', 'bucketbrowser_options');

    add_settings_section(
        'bucketbrowser_defaults_section',
        '',
        '',
        'bucketbrowser'
    );



    add_settings_field(
        'Default GCP Bucket API url',   // As of WP 4.6 this value is used only internally.
        __('Default GCP Bucket API url', 'bucketbrowser'),
        'bucketbrowser_text_field',
        'bucketbrowser',
        'bucketbrowser_defaults_section',
        array(
            'field' => 'GCPBucketAPIurl',
            'description' => __('GCP Bucket API url', 'bucketbrowser')
        )
    );

}


add_action('admin_init', 'bucketbrowser_settings_init', 30);

function bucketbrowser_text_field($args)
{
    $options = get_option('bucketbrowser_options');
    $thevalue = isset($options[$args['field']]) ? $options[$args['field']] : '';
    ?>
    <p>
        <label for="bucketbrowser_options_<?php echo $args['field']; ?>">
            <input id="bucketbrowser_options_<?php echo $args['field']; ?>"
                name="bucketbrowser_options[<?php echo $args['field']; ?>]" value="<?php echo $thevalue; ?>" />
            <?php echo $args['description']; ?>
        </label>
    </p>
    <?php
}

/**
 * Top level menu callback function
 */
function bucketbrowser_options_page_html()
{
    // check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // show error/update messages
    settings_errors('bucketbrowser_messages');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            // output security fields for the registered setting "bucketbrowser_options"
            settings_fields('bucketbrowser_options');
            // output setting sections and their fields
            // (sections are registered for "bucketbrowser", each field is registered to a specific section)
            do_settings_sections('bucketbrowser');
            // output save settings button
            submit_button(__('Save Pattern', 'bucketbrowser'));

            if (isset($_GET['pattern'])) {
                ?>
            <?php } ?>
        </form>
    </div>
    <?php

}