jQuery(document).ready(function ($) {

    var allFiles = filterScriptData.allFiles;

    console.log("allfiles ", document.getElementById('filter'));



    function onChangeElement() {

        alert("this is a testi ");

        // const isChecked = event.target.checked;

        // if (isChecked) {
        //     alert("tässä");
        //     const file = allFiles.find(obj => obj.id === id);
        //     selectedFiles.push(file);
        // } else {
        //     selectedFiles = selectedFiles.filter(file => file.id !== id);
        // }

    };


    // $('#filter-selected').on('click', function () {
    //     $('.googlebucketlist li').each(function () {
    //         const checkbox = $(this).find('.file-checkbox');
    //         if (checkbox.is(':checked')) {
    //             $(this).show();
    //         } else {
    //             $(this).hide();
    //         }
    //     });
    // });


    $(".filterResults").click(onChangeElement());
});