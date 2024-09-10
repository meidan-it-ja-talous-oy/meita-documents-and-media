import { previous } from '@wordpress/icons';
import { format } from 'date-fns';
import { __ } from '@wordpress/i18n';

jQuery(document).ready(function ($) {

    $('.spinnery').show();
    let offset = 0; // Initial page number


    const iconType = (mime_type) => {
        switch (true) {
            case mime_type.indexOf("application") != -1:
                return "fa-solid:file";
            case mime_type.indexOf("media-document") != -1:
                return "fa-solid:file-audio";
            case mime_type.indexOf("image") != -1:
                return "fa-solid:file-image";
            case mime_type.indexOf("video") != -1:
                return "fa-solid:file-video";
            case mime_type.indexOf("text") != -1:
                return "fa-solid:file-alt";
            default:
                return "fa-solid:file";
        }
    }



    function setNewFirst(res) {
        let tmpArr = res;

        tmpArr.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
        return tmpArr;
    }


    function doSearch(newOffset) {

        var dataurl = bucketBrowserData.allFiles;
        var rangeValue = $(".googlebucketlist").data('range');
        var totalItems = 0;

        offset = newOffset;

        console.log("offset on ", offset);

        if (dataurl) {
            fetch(dataurl + '?offset=' + offset + '&limit=' + rangeValue, {
                credentials: 'omit',
                url: dataurl,
            })
                .then((response) => {
                    return response.json();

                })
                .then((res) => {

                    totalItems = res.items.length;
                    var totalPages = Math.ceil(totalItems / rangeValue);
                    //console.log("res items length", totalItems);

                    if ($('.googlebucketlist')) {
                        $('.googlebucketlist').empty();
                    }

                    for (let i = 0; i <= res.items.length; i++) {

                        if (i == 1) {
                            break;
                        }

                        let rawHtml = "";
                        let el = document.getElementsByClassName('googlebucketlist');
                        el = el[i];
                        let li = document.createElement("div"); // create a list item element

                        setNewFirst(res.items.map((item, index) => {

                            rawHtml += (
                                `<li class='bucket-browser-block-listitem' data-search-term=${item.name.toLowerCase()} key=${index}>
                                	<div class='bucket-browser-block-icon ${iconType(item.contentType)}'>
                                 	    <span class="iconify" data-icon=${iconType(item.contentType)} ></span>
                                 	</div>

                                 	<div class="bucket-browser-block-content">
                                 		<a rel="noopener" target="_blank" href=${"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)}>${item.name}</a>
                                 		<p class='date'>${format(new Date(item.updated), 'd.M.yy')}</p>
                                        <a class='download-link' href=${item.mediaLink}>Lataa</a>
                                 	</div>
                                </li>
                                `);
                            li.innerHTML = rawHtml;
                            el.appendChild(li);

                            // $('.googlebucketlist li').hide().slice(offset, rangeValue).show();
                            //$('.googlebucketlist li').hide().slice(offset, rangeValue).show();

                        }));


                        $('#spinnery').hide();
                    };
                    $('.googlebucketlist li').hide().slice(offset, offset + rangeValue).show();

                    if (rangeValue > 0) {
                        updatePagination(totalPages, offset, rangeValue);
                    }

                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });


        }

    };

    function updatePagination(totalPages, currentPage, rangeValue) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        // Maximum number of page buttons to show at a time
        const maxVisibleButtons = 5;

        const currentpage = Math.floor(currentPage / rangeValue);
        //Current page
        const currentPage2 = Math.floor(currentPage / rangeValue);

        console.log("currentPage", currentPage2);
        console.log("rangeValue", rangeValue);


        let startPage = Math.max(0, currentPage2 + 1 - maxVisibleButtons);
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        console.log("stratpage", startPage);
        // If we are close to the end, adjust the start page so that the last pages are shown properly
        if (currentPage2 - 1 >= maxVisibleButtons) {
            console.log("kyllä!");
            const middlePoint = Math.floor(maxVisibleButtons * 2) - 2;

            console.log("midlepoint", middlePoint)

            // Adjust startPage and endPage based on current page
            startPage = Math.max(currentPage2 - 1, currentPage2 - 1 - middlePoint);
            console.log("stratpage", startPage);

            endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
            console.log("endPage", endPage);
            //startPage = Math.max(1, endPage - maxVisibleButtons);
        }


        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('prev-page');
        prevButton.disabled = currentPage2 === 0 || currentPage === 0; // Disable if on the first page
        prevButton.onclick = () => {
            if (currentPage > 1) {
                doSearch(currentPage - rangeValue);
            }
        };
        paginationContainer.appendChild(prevButton);

        // Page number buttons (only show up to 5 at a time)
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i + 1;
            button.classList.add('num-button');

            if (i === currentPage / rangeValue) {
                button.classList.add('active');
            }
            button.onclick = (event) => {
                event.preventDefault();
                if (i - 1 == 0) {
                    doSearch(0);
                } else {
                    console.log("i on ", i);
                    doSearch(i * rangeValue); // Go to the correct page
                }


            };

            // Highlight the current page


            paginationContainer.appendChild(button);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('next-page');
        nextButton.disabled = currentPage + rangeValue >= totalPages * rangeValue; // Disable if on the last page
        nextButton.onclick = () => {
            if (currentPage2 <= totalPages || currentPage2 !== 0) {
                doSearch(currentPage + rangeValue);
            }
            // if (currentPage + rangeValue < totalPages * rangeValue) {
            //     doSearch(currentPage + rangeValue);
            // }
        };
        paginationContainer.appendChild(nextButton);

        const pageAmount = document.createElement('div');
        const begin = currentPage2 !== 0 ? currentPage2 : 1;


        pageAmount.textContent = 'Page ' + begin + ' of ' + totalPages;
        pageAmount.classList.add('page-of');

        paginationContainer.appendChild(pageAmount);
    }


    setTimeout(function () {

        $('.spinnery').show();
        doSearch(offset);

    }, 1000);




    $('#filter').on('keyup', function (event) {

        event.preventDefault();

        console.log("kukkuu keyUP");

        $('.spinnery').show();
        $('#pagination').hide();
        var rangeValue = $(".googlebucketlist").data('range');
        var searchTerm = $(this).val().toLowerCase();

        setTimeout(function () {

            $('.googlebucketlist li').hide();

            if (searchTerm.length === 0) {
                // If the input is cleared, show all items
                $('.googlebucketlist li').show();
                $('#pagination').show();
                doSearch(offset);  // Optionally, re-run the full search if needed

            } else {
                // Filter and display only the matching items
                $('.googlebucketlist li').each(function () {
                    if ($(this).filter('[data-search-term*="' + searchTerm + '"]').length > 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }

            $('#spinnery').hide();

        }, 2000);
    });


    $("#bucket-browser-block-button").on('click', function (event) {
        event.preventDefault();
        //show spinner

        $('.googlebucketlist').hide();
        $('#pagination').hide();

        $('.spinnery').show();

        setTimeout(function () {
            var searchTerm = $('#filter').val().toLowerCase();
            $('.googlebucketlist').show();


            $('.googlebucketlist li').each(function () {
                // If no search term, reset the search
                if (searchTerm.length == 0) {
                    doSearch();
                    $('#pagination').show();
                }
                // Check if the `data-search-term` attribute matches the search term
                if ($(this).attr('data-search-term').toLowerCase().includes(searchTerm) || searchTerm.length < 1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            $('.spinnery').hide();

        }, 2000);  // Delay of 3000 milliseconds (2 seconds)

    });

    $('input[type="search"]').on('search', function () {

        $('.googlebucketlist').empty();


        setTimeout(function () {
            $('.spinnery').show();
            doSearch(offset);

        }, 2000);
        $('#pagination').show();
        $('#spinnery').hide();

    });
});


