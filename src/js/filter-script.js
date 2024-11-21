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


    function doSearch(newOffset, block) {

        var dataurl = bucketBrowserData.allFiles;
        var rangeVal = parseInt(block.attr('data-range'), 10);
        var blockId = block.attr('id');
        let downloadLink = block.attr('data-showDownloadlink');
        let showDate = block.attr('data-showdate');
        let showIcon = block.attr('data-showicon');

        if (isNaN(rangeVal)) {
            console.error('Invalid number:', block.attr('data-range'));
            rangeVal = 0;  // default value
        }

        var totalItems = 0;
        offset = newOffset;

        if (dataurl) {
            fetch(`${dataurl}?offset=${offset}&limit=${rangeVal}`, {
                credentials: 'omit',
                url: dataurl,
            })
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    totalItems = res.items.length;
                    var totalPages = Math.ceil(totalItems / rangeVal);
                    let el = block[0].querySelector('.googlebucketlist');

                    if ($(`#${blockId} .googlebucketlist`)) {
                        $(`#${blockId} .googlebucketlist`).empty();
                    }

                    for (let i = 0; i <= res.items.length; i++) {

                        if (i == 1) {
                            break;
                        }
                        let rawHtml = "";

                        let li = document.createElement("ul"); // create a list item element
                        li.classList.add('googlebucketlist-ul');
                        li.setAttribute('aria-label', 'bucket-browser-block list');

                        setNewFirst(res.items.map((item, index) => {

                            rawHtml += (
                                `<li class='bucket-browser-block-listitem' data-search-term=${item.name.toLowerCase().trim().replace(/\s+/g, '')} data-key=${index}>
                                `)
                            if (showIcon == "true") {
                                rawHtml += (
                                    `<div class='bucket-browser-block-icon ${iconType(item.contentType)}'>
                                 	    <span class="iconify" data-icon=${iconType(item.contentType)} ></span>
                                    </div>`)
                            }
                            rawHtml += (
                                `<div class="bucket-browser-block-content">
                                    <a target="_blank" href=${"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)} alt='${__(' Open file ') + item.name.replace(/_/g, ' ').replace(/\..*$/, '')}' >${item.name}</a>`)
                            if (showDate == "true") {
                                rawHtml += (
                                    `<p class='date' title="Last modified at ${format(new Date(item.updated), 'd.M.yy')}">${__('Modified')}  ${format(new Date(item.updated), 'd.M.yy')}</p>`)
                            }
                            if (downloadLink == "true") {
                                rawHtml += (
                                    `<p><a class='download-link' rel='noopener' href=${item.mediaLink} alt='${__('Download file')} ${item.name.replace(/_/g, ' ').replace(/\..*$/, '')}'>${__('Download')}</a></p> `)
                            }
                            rawHtml += (
                                `</div>
                                </li>
                                `);
                            li.innerHTML = rawHtml;
                            el.appendChild(li);

                        }));

                        $(`#${blockId} .spinnery`).hide();


                    };

                    $(`#${blockId} .googlebucketlist li`).hide().slice(offset, offset + rangeVal).show();

                    if (rangeVal > 0) {
                        updatePagination(totalPages, offset, rangeVal, block);
                    }

                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });


        }

    };

    function updatePagination(totalPages, currentPage, rangeValue, block) {

        let googleBucketList = block.find('.googlebucketlist');

        // If the pagination container already exists, remove it to avoid duplicates
        googleBucketList.find('.pagination').remove();


        let paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');
        paginationContainer.setAttribute('aria-label', 'bucket-browser-block pagination');
        googleBucketList.append(paginationContainer);


        // Maximum number of page buttons to show at a time
        const maxVisibleButtons = 5;

        // Current page
        const currentPage2 = Math.floor(currentPage / rangeValue);

        let startPage = Math.max(0, currentPage2 + 1 - maxVisibleButtons + 1);
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);


        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('prev-page');
        prevButton.setAttribute('aria-label', __('Previous page'));
        prevButton.disabled = currentPage2 === 0 || currentPage === 0; // Disable if on the first page
        prevButton.onclick = () => {
            if (currentPage > 1) {
                doSearch(currentPage - rangeValue, block);
            }
        };
        paginationContainer.appendChild(prevButton);

        // Page number buttons (only show up to 5 at a time)
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i + 1;
            button.classList.add('num-button');
            let pageNum = i + 1;
            button.setAttribute('aria-label', 'page ' + pageNum + ' button');

            if (i === currentPage / rangeValue) {
                button.classList.add('active');
                button.setAttribute('aria-current', 'page');
                button.setAttribute('aria-label', 'page ' + pageNum + ' button');
            }
            button.onclick = (event) => {
                event.preventDefault();

                if (i == 0) {
                    doSearch(0, block);
                    i++;
                } else {
                    doSearch(i + 1 * rangeValue, block); // Go to the correct page
                }
            };
            paginationContainer.appendChild(button);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('next-page');
        nextButton.setAttribute('aria-label', __('Next page'));
        nextButton.disabled = currentPage + rangeValue >= totalPages * rangeValue; // Disable if on the last page
        nextButton.onclick = () => {
            if (currentPage2 <= totalPages || currentPage2 !== 0) {
                let tulos = currentPage + rangeValue
                doSearch(tulos, block);

            }
        };
        paginationContainer.appendChild(nextButton);


        //Page of pages
        const pageAmount = document.createElement('div');
        const begin = currentPage2 === 1 ? currentPage2 + 1 : currentPage2 + 1;
        pageAmount.setAttribute('aria-label', 'page ' + begin + ' of ' + totalPages);

        pageAmount.textContent = __('Page ') + begin + __(' of ') + totalPages;
        pageAmount.classList.add('page-of');

        paginationContainer.appendChild(pageAmount);
    }


    setTimeout(function () {

        const blocks = $('.wp-block-bucket-browser-block-bucket-browser-block'); // Get all blocks

        $('.spinnery').show(); // Show spinner for all blocks

        // Loop through each block and call doSearch separately
        blocks.each(function (index, blockElement) {
            const block = $(blockElement);
            const offset = 0;
            const listScreen = block[0].attributes[3].value;

            if (listScreen == "true") {
                doSearch(offset, block);
            } else {
                console.log("element on false");

            }
        });

        $('.spinnery').hide(); // Hide spinner after all blocks have been processed

    }, 1000);


    function doBucketSearch(event) {
        event.preventDefault();

        const blockId = $(event.target).closest('.wp-block-bucket-browser-block-bucket-browser-block').attr('id'); // Use closest to find the block
        const block = $('#' + blockId);

        block.find('.googlebucketlist').hide();
        block.find('.pagination').hide();
        block.find('.spinnery').show();

        setTimeout(function () {
            var searchTerm = block.find('.filter').val().toLowerCase();  // Only search in the current block
            block.find('.googlebucketlist').show();

            block.find('.googlebucketlist li').each(function () {
                // If no search term, reset the search
                if (searchTerm.length == 0) {
                    doSearch(offset, block);
                    block.find('.pagination').show();

                }
                // Check if the `data-search-term` attribute matches the search term
                if ($(this).attr('data-search-term').toLowerCase().includes(searchTerm) || searchTerm.length < 1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            block.find('.spinnery').hide();

        }, 2000);  // Delay of 2000 milliseconds (2 seconds)

    }
    $(".bucket-browser-block-button").click(doBucketSearch);


    function clearInput(event) {
        event.preventDefault();
        const blockId = $(event.target).closest('.wp-block-bucket-browser-block-bucket-browser-block').attr('id');  // Use closest to find the block

        const block = $('#' + blockId);

        block.find('.googlebucketlist').empty();
        block.find('.pagination').hide();
        block.find('.spinnery').show();

        setTimeout(function () {
            doSearch(offset, block);
            block.find('.spinnery').hide();
            block.find('.pagination').show();

        }, 2000);

    }
    $('.wp-block-bucket-browser-block-bucket-browser-block').find('input[type="search"]').on('search', clearInput);


});


