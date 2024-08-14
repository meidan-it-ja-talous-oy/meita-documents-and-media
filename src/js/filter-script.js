jQuery(document).ready(function ($) {
    $('#filter-selected').on('click', function () {
        $('.googlebucketlist li').each(function () {
            const checkbox = $(this).find('.file-checkbox');
            if (checkbox.is(':checked')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});