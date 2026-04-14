(function () {



    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    jQuery(document).ready(function ($) {


        console.log('FILTER SCRIPT LOADED');

        if (window.Iconify) {
            window.Iconify.scan();
        }


        // $('.spinnery').show();

        function getOffset(block) {
            return block.data('offset') || 0;
        }

        // let offset = getOffset(block); // Initial page number

        function setOffset(block, value) {
            block.data('offset', value);
        }


        const iconType = (mime_type) => {
            switch (true) {
                case mime_type.indexOf("application") != -1:
                    return "fa-solid:file";
                case mime_type.indexOf("audio") != -1:
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


        function getDisplayTitle(item, isAllFiles) {
            const raw =
                item.metadata?.FileTitle ||
                item.title ||
                item.name ||
                '';

            if (!isAllFiles) {
                // ✅ yksittäin valitut → älä muokkaa
                return raw;
            }

            // ✅ kaikki tiedostot → siisti
            return raw
                .replace(/_/g, ' ')
                .replace(/\.[^/.]+$/, '');
        }



        function getSortKey(item) {
            return (
                item.metadata?.FileTitle ||
                item.displayTitle ||
                item.name
            ).toLowerCase();

        }

        function getDateKey(item) {
            return new Date(item.updated || item.modified || 0).getTime();
        }

        function setNewFirst(items, order, orderBy) {

            const filtered = [...items];

            if (orderBy === "title") {
                filtered.sort((a, b) => {
                    const aKey = getSortKey(a);
                    const bKey = getSortKey(b);

                    const primary =
                        order === "ascending"
                            ? aKey.localeCompare(bKey, "fi", { sensitivity: "base" })
                            : bKey.localeCompare(aKey, "fi", { sensitivity: "base" });

                    if (primary !== 0) return primary;

                    // ✅ fallback: date (lukitsee järjestyksen)
                    return getDateKey(a) - getDateKey(b);
                });
            } else if (orderBy === "date") {
                filtered.sort((a, b) => {
                    const primary =
                        order === "ascending"
                            ? getDateKey(a) - getDateKey(b)
                            : getDateKey(b) - getDateKey(a);

                    if (primary !== 0) return primary;

                    // ✅ fallback: name (lukitsee järjestyksen)
                    return getSortKey(a).localeCompare(
                        getSortKey(b),
                        "fi",
                        { sensitivity: "base" }
                    );
                });
            }

            return filtered;

        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            // d.M.yy → päivä.kuukausi.vuosi lyhyt
            const day = date.getDate();
            const month = date.getMonth() + 1; // 0-11 → +1
            const year = date.getFullYear() % 100; // viimeiset kaksi numeroa vuodesta
            return `${day}.${month}.${year}`;
        }

        function doSearch(newOffset, block) {

            block.find('.spinnery').show();

            return new Promise((resolve, reject) => {
                const dataurl = bucketBrowserData.allFiles;
                const rangeVal = Number(block.attr('data-range'));
                const downloadLink = block.attr('data-showDownloadlink');
                const showDate = block.attr('data-showdate');
                const showIcon = block.attr('data-showicon');
                const isAllFiles = block.attr('data-istrue') === "true";


                const orderBy = block.attr('data-orderby') || 'title';
                const order = block.attr('data-order') || 'ascending';



                if (isNaN(rangeVal)) {
                    if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
                        rangeVal = 0;
                    } else {
                        return
                    }
                }

                var totalItems = 0;
                //offset = newOffset;
                setOffset(block, newOffset);
                const offset = getOffset(block);


                if (!dataurl) {
                    resolve();
                    return;
                }

                //let url = `${dataurl}?offset=${offset}&limit=${rangeVal}`;
                let url = `${dataurl}`;

                fetch(url, {
                    credentials: 'omit'
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        totalItems = res.items.length;
                        var totalPages = Math.ceil(totalItems / rangeVal);
                        //let el = block[0].querySelector('.googlebucketlist');

                        const $container = block.find('.googlebucketlist');
                        $container.empty();


                        const ul = document.createElement('ul');
                        ul.classList.add('googlebucketlist-ul');
                        ul.setAttribute('aria-label', 'meita-documents-and-media google-bucket list');


                        let rawHtml = "";

                        let sortedItems = setNewFirst(res.items, order, orderBy);

                        sortedItems.forEach((item, index) => {

                            const title = getDisplayTitle(item, isAllFiles);

                            rawHtml += (
                                `<li class='meita-documents-and-media-listitem' data-search-term="${item.name.toLowerCase().trim().replace(/\s+/g, '')}" data-key="${index}">
                                `)
                            if (showIcon == "true") {
                                rawHtml += (
                                    `<div class='meita-documents-and-media-icon ${iconType(item.contentType)}'>
                                 	    <span class="iconify" data-icon="${iconType(item.contentType)}" ></span>
                                    </div>`)
                            }
                            rawHtml += (
                                `<div class="meita-documents-and-media-content">
                                    <p class='document-name'><a target="_blank" href=${"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)} alt='${(meita_translations.open) + item.name.replace(/_/g, ' ').replace(/\..*$/, '')}' >${title}</a></p>`)
                            if (showDate == "true") {
                                rawHtml += (
                                    `<p class='updated-date' title="Last modified at ${formatDate(item.updated)}">${meita_translations.modified}  ${formatDate(item.updated)}</p>`)
                            }
                            if (downloadLink == "true") {
                                rawHtml += (
                                    `<p class='download-button'><a class='download-link' rel='noopener' href=${item.mediaLink} alt='${meita_translations.download} ${item.name.replace(/_/g, ' ').replace(/\..*$/, '')}'>${meita_translations.download}</a></p> `)
                            }
                            rawHtml += (`</div></li>`);
                            // ul.innerHTML = rawHtml;
                            // $container.empty().append(ul);
                            //$container.append(ul);
                        });
                        ul.innerHTML = rawHtml;
                        $container.empty().append(ul);

                        block.find('.spinnery').hide();


                        const offset = getOffset(block);
                        block.find('.googlebucketlist li').hide().slice(offset, offset + rangeVal).show();

                        if (rangeVal > 0) {
                            updatePagination(totalPages, offset, rangeVal, block);
                        }

                        if (window.Iconify) {
                            if (typeof window.Iconify.scan === 'function') {
                                window.Iconify.scan($container[0]);
                            } else if (typeof window.Iconify.scanDOM === 'function') {
                                window.Iconify.scanDOM($container[0]);
                            }
                        }

                        resolve(); // lista valmis, callback voidaan ajaa
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                        reject(error);
                    });

            });


        };

        function updatePagination(totalPages, currentPage, rangeValue, block) {

            let googleBucketList = block.find('.googlebucketlist');
            googleBucketList.find('.pagination').remove();

            let paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination');
            paginationContainer.setAttribute('aria-label', 'meita-documents-and-media pagination');
            googleBucketList.append(paginationContainer);

            //Lasketaan nykyinen sivu (1 -pohjaisesti)
            const currentPageIndex = Math.floor(currentPage / rangeValue);
            const currentPageNumber = currentPageIndex + 1;
            let offset = getOffset(block);

            const maxVisibleButtons = 5;

            let startPage = Math.max(1, currentPageNumber - Math.floor(maxVisibleButtons / 2));
            let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

            startPage = Math.max(1, endPage - maxVisibleButtons + 1);

            // --- First Page ---
            const firstButton = document.createElement('button');
            firstButton.textContent = '«';
            firstButton.classList.add('first-page');
            firstButton.setAttribute('aria-label', meita_translations.first);
            firstButton.disabled = currentPageIndex === 0;
            firstButton.setAttribute('aria-disabled', currentPageIndex === 0 ? 'true' : 'false');
            firstButton.onclick = () => {
                if (currentPageIndex > 0) {
                    doSearch(0, block);
                }
            };
            paginationContainer.appendChild(firstButton);

            // ----Previous button-----
            const prevButton = document.createElement('button');
            prevButton.textContent = meita_translations.previous;
            prevButton.classList.add('prev-page');
            prevButton.setAttribute('aria-label', meita_translations.previous);
            prevButton.disabled = currentPageIndex === 0;
            prevButton.setAttribute('aria-disabled', currentPageIndex === 0 ? 'true' : 'false');
            prevButton.onclick = () => {
                if (currentPageIndex > 0) {
                    doSearch((currentPageIndex - 1) * rangeValue, block);
                }
            };
            paginationContainer.appendChild(prevButton);

            // ----Page number buttons----
            for (let i = startPage; i <= endPage; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.classList.add('num-button');
                button.setAttribute('aria-label', meita_translations.page + ' ' + i);

                if (i === currentPageNumber) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'page');
                }

                button.onclick = (event) => {
                    event.preventDefault();
                    const offset = (i - 1) * rangeValue;
                    doSearch(offset, block);

                };
                paginationContainer.appendChild(button);
            }

            // -----Next button------
            const nextButton = document.createElement('button');
            nextButton.textContent = meita_translations.next;
            nextButton.classList.add('next-page');
            nextButton.setAttribute('aria-label', meita_translations.next);
            nextButton.disabled = currentPageNumber >= totalPages;
            nextButton.setAttribute('aria-disabled', currentPageNumber >= totalPages ? 'true' : 'false');
            nextButton.onclick = () => {
                if (currentPageNumber < totalPages) {
                    const offset = (currentPageIndex + 1) * rangeValue;
                    doSearch(offset, block);
                }
            };
            // --- Last Page ---
            const lastButton = document.createElement('button');
            lastButton.textContent = '»';
            lastButton.classList.add('last-page');
            lastButton.setAttribute('aria-label', meita_translations.last);

            // Lasketaan viimeisen sivun aloitusindeksi
            const lastPageOffset = (totalPages - 1) * rangeValue;
            lastButton.disabled = currentPage >= lastPageOffset;
            lastButton.setAttribute('aria-disabled', currentPage >= lastPageOffset ? 'true' : 'false');

            lastButton.onclick = () => {
                if (currentPage < lastPageOffset) {
                    doSearch(lastPageOffset, block);
                }
            };

            paginationContainer.appendChild(nextButton);
            paginationContainer.appendChild(lastButton);


            //------Page X of Y-------
            const pageAmount = document.createElement('p');
            pageAmount.setAttribute(
                'aria-label',
                meita_translations.page + ' ' + currentPageNumber + meita_translations.of + totalPages
            );
            pageAmount.textContent =
                meita_translations.page + ' ' + currentPageNumber + meita_translations.of + totalPages;
            pageAmount.classList.add('page-of', 'meita-documents-and-media');

            paginationContainer.appendChild(pageAmount);
        }

        if (!document.body.classList.contains('wp-admin')) {

            $(document).ready(async function () {
                const blocks = $('.wp-block-meita-documents-and-media-show-bucket');

                for (const blockElement of blocks) {
                    const block = $(blockElement);
                    const listScreen = block.attr('data-listscreen');
                    const istrue = block.attr('data-istrue');

                    //console.log('listScreen:', listScreen, 'istrue:', istrue);

                    // tarkistukset


                    if (!block.data('loaded') && listScreen === "false" && istrue === "true") {
                        await doSearch(0, block);
                        block.data('loaded', true);
                    }


                    // if (!block.data('loaded')) {

                    //     if (istrue === "false") {
                    //         // save.js hoitaa renderöinnin
                    //         return;
                    //     }
                    //     if (listScreen === "false" && istrue === "false") {
                    //         if (!block.data('loaded')) { // aja vain, jos ei vielä ladattu
                    //             await doSearch(0, block);
                    //             block.data('loaded', true);
                    //         }
                    //     } else {
                    //         if (!block.data('loaded')) {
                    //             await doSearch(0, block);
                    //             block.data('loaded', true);
                    //         }
                    //     }
                    // }
                }
                // $('.spinnery').hide();
            });

        }

        async function doBucketSearch(event) {
            event.preventDefault();

            // Selvitetään block-elementti

            const block = $(event.target)
                .closest('.wp-block-meita-documents-and-media-show-bucket');


            if (block.length === 0) return;

            block.find('.googlebucketlist').hide();
            block.find('.pagination').hide();
            block.find('.spinnery').show();

            var searchTerm = block.find('.filter').val().toLowerCase().trim();

            let shown = 0, hidden = 0;

            if (searchTerm === '') {
                //console.log("doBucketSearch: tyhjä hakukenttä → ladataan kaikki");
                await doSearch(0, block);
                block.find('.pagination').show();
                block.find('.googlebucketlist').show();
                block.find('.spinnery').hide();
                return; // lopetetaan funktio tässä
            }

            // Suodatetaan kaikki listItemit
            block.find('.googlebucketlist li').each(function () {
                const itemTerm = $(this).attr('data-search-term').toLowerCase();
                if (!searchTerm || itemTerm.includes(searchTerm)) {
                    $(this).show();
                    shown++;
                } else {
                    $(this).hide();
                    hidden++;
                }
            });

            //console.log('doBucketSearch: filter results, shown=', shown, 'hidden=', hidden);
            block.find('.googlebucketlist').show();
            block.find('.spinnery').hide();

        }

        function clearInput(event) {
            event.preventDefault();

            const block = $(event.target)
                .closest('.wp-block-meita-documents-and-media-show-bucket');


            if (block.length === 0) return;

            const currentOffset = getOffset(block);

            block.find('.googlebucketlist').empty();
            block.find('.pagination').hide();
            block.find('.spinnery').show();

            setTimeout(function () {
                doSearch(currentOffset, block);
                block.find('.spinnery').hide();
                block.find('.pagination').show();

            }, 2000);

        }

        // Nappi

        $('.wp-block-meita-documents-and-media-show-bucket')
            .on('click', '.documents-and-media-button', doBucketSearch);

        // $(".documents-and-media-button").on("click", doBucketSearch);


        // Lomake (Enterillä)

        $('.wp-block-meita-documents-and-media-show-bucket')
            .on('keypress', 'input[type="search"]', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    doBucketSearch(event);
                }
            });

        // $('#documents-and-media-form input[type="search"]').on('keypress', function (event) {
        //     if (event.key === "Enter") {
        //         event.preventDefault();
        //         doBucketSearch(event);
        //     }
        // });


        //tyhjennysruksi
        $('.wp-block-meita-documents-and-media-show-bucket')
            .find('input[type="search"]')
            .on('search', clearInput);


    });

})();
