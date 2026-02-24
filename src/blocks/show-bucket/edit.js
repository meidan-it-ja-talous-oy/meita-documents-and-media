import { __ } from '@wordpress/i18n';
import { useEffect, useState, Fragment, RawHTML, useRef, useLayoutEffect } from '@wordpress/element';
import { Button, PanelBody, SelectControl, CheckboxControl, TextControl, ToggleControl, Modal, RangeControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import './style.scss';
import { more, file, box, button } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import Listitem from '../../components/list-item';
import Pagination from '../../components/pagination-script';
import { format } from 'date-fns';



export default function Edit(props) {
    const [filter, setFilter] = useState(props.attributes.filter);
    const [showIcon, setShowIcon] = useState(props.attributes.showIcon);
    const [showDate, setShowDate] = useState(props.attributes.showDate);
    const [showDescription, setShowDescription] = useState(props.attributes.showDescription);
    const [showDownloadLink, setShowDownloadLink] = useState(props.attributes.showDownloadLink);
    const [datasource, setDatasource] = useState(props.attributes.datasource);
    const [datasourceURL, setDatasourceURL] = useState(props.attributes.datasourceURL);
    const [files, setFiles] = useState(props.attributes.files);
    const [selectedFiles, setSelectedFiles] = useState(props.attributes.selectedFiles);
    const [allFiles, setAllFiles] = useState(props.attributes.allFiles);
    const [sortedItems, setSortedItems] = useState([]);
    const [order, setOrder] = useState(props.attributes.order);
    const [orderBy, setOrderBy] = useState(props.attributes.orderBy);
    const [wpSelect, setWpSelect] = useState(props.attributes.wpSelect);
    const [changed, setChanged] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(props.attributes.selectedFolder);
    const [isOpen, setOpenModal] = useState(false);
    const [listScreen, setlistScreen] = useState(props.attributes.listScreen);
    const [istrue, setTrue] = useState(props.attributes.istrue);
    const [checked, setChecked] = useState(props.attributes.checked);
    const [clicked, setClicked] = useState(false);
    const [selectclicked, setSelectClicked] = useState(props.attributes.selectclicked);
    const [range, setRange] = useState(props.attributes.range);
    const [currentPage, setCurrentPage] = useState(props.attributes.currentPage);
    const [totalPages, setTotalPages] = useState(props.attributes.totalPages);
    const [loading, setLoading] = useState(true);
    const [blockId, setBlockId] = useState(props.clientId);
    const [searchlabel, setSearchlabel] = useState(props.searchlabel);

    const page = 1
    const blockRootRef = useRef(null);

    const { attributes, setAttributes } = props;

    const labelIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="4.75"
                y="17.25"
                width="5.5"
                height="14.5"
                transform="rotate(-90 4.75 17.25)"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
            />
            <rect
                x="4"
                y="7"
                width="10"
                height="2"
                fill="currentColor"
            />
        </svg>
    );

    const {
        searchbuttonlabel,
        showLabel,
        showButtonIcon

    } = attributes;


    // INITIAL LOADS
    useEffect(() => {
        // Defaults from settings if new
        if (blockId == "") {
            setBlockId({ blockId: blockId });
            setSearchlabel({ searchlabel: searchlabel });
        }

        if (documentsBlockDefaults.bucketbrowseroptions) {
            if (documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl) {
                setDatasourceURL(documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl);
            }
            // if (documentsBlockDefaults.bucketbrowseroptions.range) {
            //     setRange(documentsBlockDefaults.bucketbrowseroptions.range);
            // }
        }
    }, [blockId])



    useLayoutEffect(() => {
        if (!blockRootRef.current) return;

        const el = blockRootRef.current;
        const doScan = () => {
            if (window.Iconify?.scan) window.Iconify.scan(el);
            else if (window.Iconify?.scanDOM) window.Iconify.scanDOM(el);
        };

        // odota Iconify-oliota
        const tick = () => (window.Iconify ? doScan() : setTimeout(tick, 50));
        tick();

        const mo = new MutationObserver(doScan);
        mo.observe(el, { childList: true, subtree: true });

        return () => mo.disconnect();
    }, []);



    useEffect(() => {

        if (datasourceURL != "" && selectclicked == false && listScreen == false && istrue == true) {
            let reqCounter = 0;

            apiFetch({ url: datasourceURL })
                .then((files) => {
                    reqCounter++;
                    //console.log(`✅ Request #${reqCounter} OK`, files.items);
                    setAllFiles(files.items);
                    setTotalPages(files.items.length);
                })
                .catch((err) => {
                    reqCounter++;
                    //console.log(`❌ Request #${reqCounter} ERROR`, err);
                });

            if (selectedFiles.length > 0) {
                setLoading(false);
            } else {
                fetchItems(datasource, datasourceURL, page);
                setLoading(false);
            }
        }
        if (selectclicked === true) {
            if (checked.length > 0) {
                setSelectedFiles(checked);
                setlistScreen(false);
                setTrue(false);
            } else {
                setTrue(true);
                setlistScreen(true);
            }
        }
        if (listScreen == false && selectclicked == false && istrue == false) {
            setlistScreen(false);
            setTrue(true);
            fetchItems(datasource, documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl, page);
        }
    }, [datasourceURL, selectclicked, checked, clicked])


    useEffect(() => {

        if (documentsBlockDefaults.bucketbrowseroptions) {
            if (documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl) setDatasourceURL(documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl);
        }

        props.setAttributes({
            showIcon: showIcon,
            showDate: showDate,
            showDescription: showDescription,
            showDownloadLink: showDownloadLink,
            files: files,
            datasource: datasource,
            selectedFolder: selectedFolder,
            wpSelect: wpSelect,
            order: order,
            orderBy: orderBy,
            selectedFiles: selectedFiles,
            checked: checked,
            listScreen: listScreen,
            filter: filter,
            allFiles: allFiles,
            range: range,
            currentPage: currentPage,
            totalPages: totalPages,
            blockId: blockId,
            searchlabel: searchlabel,
            searchbuttonlabel: searchbuttonlabel,
            selectclicked: selectclicked,
            istrue: istrue

        });

    }, [showIcon, showDate, showDescription, allFiles, datasourceURL, listScreen, istrue, showDownloadLink, files, wpSelect, selectedFolder, order, orderBy, checked, currentPage, totalPages, selectedFiles, searchlabel, searchbuttonlabel, selectclicked, range])

    const getSortedItems = (items) => {
        //console.log("items", items);
        return [...items].sort((a, b) => {
            if (orderBy === "title") {
                return order === "ascending"
                    ? a.name.localeCompare(b.name, 'fi', { sensitivity: 'base' })
                    : b.name.localeCompare(a.name, 'fi', { sensitivity: 'base' });
            } else {
                return order === "ascending"
                    ? new Date(a.updated) - new Date(b.updated)
                    : new Date(b.updated) - new Date(a.updated);
            }
        });
    };

    useEffect(() => {

        if (selectedFiles.length && selectclicked == true) {
            const sorted = getSortedItems(selectedFiles);
            setSortedItems(sorted);
        }

    }, [selectedFiles, orderBy, order]);


    const fetchItems = (selection, datasourceURL, page) => {
        page = currentPage;
        const url = `${datasourceURL}?offset=${page}&limit=${range - 1}`;

        if (datasourceURL != "" && selection == "google") {
            apiFetch({ url: url })
                .then((data) => {
                    setTotalPages(data.items.length);
                    setTimeout(() => {
                        setSelectedFiles(data.items);
                        setLoading(false);
                    }, 1000);
                });
        }
    };

    const openModal = () => {
        setlistScreen(false);
        setOpenModal(true);
    }

    const closeModal = () => {
        if (clicked == false && selectedFiles.length == 0) {
            setTrue(false);
        }
        setOpenModal(false);
    }

    const saveTheChoiches = () => {
        if (checked.length > 0) {
            setSelectedFiles(checked);
            setSortedItems(checked);
            setlistScreen(false);
        }
        closeModal()
    }

    const clicktoTest = () => {
        if (clicked == false) {
            setClicked(true);
        } else {
            setClicked(false);
        }
    }

    const clicktoChange = (value) => {
        //tämä määrittä toggle nappulan select files to use
        if (checked.length > 0) {
            setChecked([]);
        }
        setlistScreen(false);
        setSelectClicked(value);
    }

    const onChangeElement = (id) => {
        let updatedChecked = [...checked];
        const index = updatedChecked.findIndex(obj => obj.id === id);

        if (index !== -1) {
            updatedChecked.splice(index, 1)
        } else {
            const el = allFiles.find(obj => obj.id === id);
            if (el) {
                updatedChecked.push(el);
            }
        }
        setSelectedFiles(updatedChecked);
        setSelectClicked(true);
        setChecked(updatedChecked);
        setChanged(!changed);
        setTrue(true);
    }

    const filteredItems = filter
        ? sortedItems.filter((item) =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        )
        : selectedFiles;

    const blockControls = (
        <BlockControls>
            <ToolbarGroup>
                <ToolbarButton
                    icon={labelIcon}
                    label={
                        showLabel
                            ? __('Hide label', 'meita-documents-and-media')
                            : __('Show label', 'meita-documents-and-media')
                    }
                    isPressed={showLabel}
                    onClick={() =>
                        setAttributes({ showLabel: !showLabel })
                    }
                />
                <ToolbarButton
                    icon="search"
                    label={showButtonIcon ? "Näytä tekstinä" : "Näytä ikonina"}
                    isPressed={showButtonIcon}
                    onClick={() => setAttributes({ showButtonIcon: !showButtonIcon })}
                />
            </ToolbarGroup>
        </BlockControls>
    )

    const orderOptions = orderBy === "title"
        ? [
            { label: __('A → Ö', 'meita-documents-and-media'), value: "ascending" },
            { label: __('Ö → A', 'meita-documents-and-media'), value: "descending" }
        ]
        : [
            { label: __('Ascending', 'meita-documents-and-media'), value: "ascending" },
            { label: __('Descending', 'meita-documents-and-media'), value: "descending" }
        ];

    const inspectorControls = (
        < InspectorControls key="setting" >
            <PanelBody title={__('Data source settings', 'meita-documents-and-media')} icon={box} initialOpen={true}>

                {(datasource == "google") &&
                    (
                        <div>
                            <TextControl
                                label={__('Google bucket URL', 'meita-documents-and-media')}
                                value={datasourceURL}
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                            <ToggleControl
                                label={__('Select files to use', 'meita-documents-and-media')}
                                checked={selectclicked}
                                onChange={(value) => {
                                    clicktoChange(value);
                                }}
                                help={selectclicked
                                    ? __('Choosing "Select files to use" you can choose which files you want to display.', 'meita-documents-and-media')
                                    : __('Shows search bar and all files, you can change how many files you want to show', 'meita-documents-and-media')
                                }
                                __nextHasNoMarginBottom
                            />

                            {selectclicked &&
                                <div style={{ "margin-top": 15 }}>
                                    <Button
                                        variant="primary"
                                        className={`is-primary`}
                                        onClick={() => {
                                            setlistScreen(true);
                                            setTrue(false);
                                            setSelectedFiles([]);
                                            openModal();
                                        }}
                                    >{__('Select files', 'meita-documents-and-media')}
                                    </Button>
                                </div>
                            }
                            {checked.length > 0 && selectclicked == true && (
                                <div style={{ marginTop: 15 }}>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setSelectedFiles([]);
                                            setChecked([]);
                                            setlistScreen(false);
                                            setTrue(true);
                                        }}
                                    >
                                        {__('Clear selected', 'meita-documents-and-media')}
                                    </Button>
                                </div>
                            )}
                            {(selectclicked === false) &&
                                <RangeControl
                                    label={__('Amount', 'meita-documents-and-media')}
                                    value={range}
                                    onChange={(value) => {
                                        props.setAttributes({ range: value })
                                        setRange(value);
                                    }}
                                    min={0}
                                    max={50}
                                    __next40pxDefaultSize
                                    __nextHasNoMarginBottom
                                />
                            }
                        </div>)
                }

                {(isOpen === true) && (
                    <Modal
                        isFullScreen={true}
                        title={__('Select files to display', 'meita-documents-and-media')}
                    >

                        <div className='components-modal__header'>
                            <Fragment>
                                <div style={{ position: 'relative', display: 'inline-block', maxWidth: 229, marginLeft: 203, marginTop: 10 }}>
                                    <TextControl
                                        placeholder={__('Filter', 'meita-documents-and-media')}
                                        value={filter}
                                        onChange={(value) => setFilter(value)}
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
                                        style={{ paddingRight: 28 }} // tilaa ikonille
                                    />

                                    {filter && (
                                        <Button
                                            icon="no-alt"
                                            label={__('Clear filter', 'meita-documents-and-media')}
                                            onClick={() => setFilter('')}
                                            variant="secondary"
                                            style={{
                                                position: 'absolute',
                                                right: 4,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                height: 'auto',
                                                width: 'auto',
                                                minWidth: 'auto',
                                                padding: '0 4px'
                                            }}
                                        />
                                    )}
                                </div>
                            </Fragment>
                            <Button
                                variant='primary'
                                onClick={() => {
                                    clicktoTest();
                                }}
                            >{__('Filter only selected', 'meita-documents-and-media')}
                            </Button>

                            <Button
                                variant='primary'
                                onClick={() => {
                                    setChecked([]);
                                }}
                            >{__('Remove selected', 'meita-documents-and-media')}</Button>


                            <Button
                                onClick={() => {
                                    closeModal();
                                }}
                            ></Button>
                        </div>

                        <div></div>

                        <div>
                            <ul id={blockId + "_dataList"} style={{ listStyle: "none" }}>
                                {allFiles?.filter(item => {
                                    // Skipaa nollakokoiset tiedostot
                                    if (item.size === "0") return false;

                                    // Jos Filter only selected on päällä, näytä vain valitut
                                    if (clicked && !checked?.some(obj => obj.id === item.id)) return false;

                                    // Suodata hakusanan perusteella
                                    if (filter && !item.name.toLowerCase().includes(filter)) return false;

                                    return true;
                                }).map((item, index) => (
                                    <li key={item.id || item.etag || index}>
                                        <CheckboxControl
                                            id={`checkbox-${item.id || index}`}
                                            checked={checked?.some(obj => obj.id === item.id)}
                                            value={item.id}
                                            onChange={() => onChangeElement(item.id)}
                                            label={item.name}
                                            __nextHasNoMarginBottom
                                        />
                                    </li>
                                ))}
                            </ul>

                        </div>

                        <div class='bbb-footer' style={{
                            "position": "absolute",
                            "bottom": 0,
                            "padding-left": 32,
                            "padding-right": 32,
                            "display": "flex",
                            "flex-direction": "row",
                            "justify-content": "space-between",
                            "align-items": "center",
                            "height": 60,
                            "width": "100%",
                            "z-index": 10,
                            "left": 0,
                            "border-top": "1px solid #ddd",
                            "background-color": "white"
                        }}>

                            <Button
                                style={{ "position": "absolute", "right": 35 }}
                                variant="primary"
                                onClick={() => {
                                    saveTheChoiches();
                                }}>{__('SAVE', 'meita-documents-and-media')}
                            </Button>
                        </div>

                    </Modal>
                )}
            </PanelBody>

            <PanelBody icon={file} title={__('Display settings', 'meita-documents-and-media')} initialOpen={true}>
                <p>{__('Choose the ones you want to show', 'meita-documents-and-media')}</p>
                <ToggleControl
                    label={__('Show icons', 'meita-documents-and-media')}
                    checked={showIcon}
                    onChange={(value) => {
                        setShowIcon(value);
                    }}
                    __nextHasNoMarginBottom
                />
                <ToggleControl
                    label={__('Show date', 'meita-documents-and-media')}
                    checked={showDate}
                    onChange={(value) => {
                        setShowDate(value);
                    }}
                    __nextHasNoMarginBottom
                />
                <ToggleControl
                    label={__('Show download link', 'meita-documents-and-media')}
                    checked={showDownloadLink}
                    onChange={(value) => {
                        setShowDownloadLink(value);
                    }}
                    __nextHasNoMarginBottom
                />

            </PanelBody>

            {(listScreen == false) && (
                <PanelBody title={__('Order', 'meita-documents-and-media')} icon={more} initialOpen={false}>
                    <SelectControl
                        id="orderBy"
                        label={__('Order by', 'meita-documents-and-media')}
                        name="orderBy"
                        onChange={(selection) => {
                            setOrderBy(selection)
                        }}
                        options={[
                            { label: __("Title", 'meita-documents-and-media'), value: "title" },
                            { label: __("Date", 'meita-documents-and-media'), value: "date" }
                        ]}
                        value={orderBy}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                    <SelectControl
                        id="order"
                        label={__('Order', 'meita-documents-and-media')}
                        name="order"
                        onChange={(selection) => {
                            setOrder(selection)
                        }}
                        options={orderOptions}
                        value={order}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                </PanelBody>

            )

            }
            {showButtonIcon == false && (
                <PanelBody title={__('Search button', 'meita-documents-and-media')} icon={button} initialOpen={true}>
                    <TextControl
                        label={__('Search label text', 'meita-documents-and-media')}
                        type='text'
                        id="bucketSearchButtonText"
                        value={searchbuttonlabel === "Search"
                            ? __('Search', 'meita-documents-and-media')
                            : searchbuttonlabel}
                        onChange={(value) =>
                            setAttributes({
                                searchbuttonlabel: value
                            })}
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            )}
        </InspectorControls >
    )
    const ClientId = `${props.clientId}`;
    const blockIdtoBlock = `meita-documents-and-media-${ClientId}`;


    return (
        <div {...useBlockProps({
            id: blockIdtoBlock,

        })} ref={blockRootRef}>
            {inspectorControls}
            {blockControls}

            <div>
                {(checked.length == 0 && selectclicked == true) &&

                    <div className='meita-documens-and-media-block-intro' style={{ "border": "1px solid grey", "padding": 15 }}>
                        <h3 style={{ "color": "black" }}>{__('Documents and media - Google Bucket', 'meita-documents-and-media')}</h3>
                        <label style={{ "font-weight": "bold" }}>{__('Open files and choose the ones you want', 'meita-documents-and-media')}</label>
                        <p>{__('Then you can adjust the display settings and change the order of the documents.', 'meita-documents-and-media')}</p>
                    </div>
                }
            </div>

            <div class="filesPreview">

                {istrue == true && listScreen == false && selectclicked == false && (

                    <div className='filterlist' style={{ "margin-top": 20 }}>
                        <form
                            id="documents-and-media-form"
                            role="search"
                            className="wp-block-search__button-outside wp-block-search__text-button wp-block-search"
                            style={{ "width": "60%" }}
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <label
                                className={showLabel ? "wp-block-search__label" : "screen-reader-text"}
                                htmlFor="documents-and-media-input"
                            >
                                <TextControl
                                    className="filterlistLabel"
                                    value={searchlabel === "Search"
                                        ? __('Search', 'meita-documents-and-media')
                                        : searchlabel}
                                    placeholder={__('Seach bar label text here', 'meita-documents-and-media')}
                                    onChange={(value) => {
                                        setAttributes({ searchlabel: value })
                                    }}
                                    __next40pxDefaultSize
                                    __nextHasNoMarginBottom
                                />
                            </label>
                            <div className="filterlistField wp-block-search__inside-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                                <TextControl
                                    className="filterlistInput wp-block-search__input"
                                    id="documents-and-media-input"
                                    type='search'
                                    value={filter}
                                    onChange={(value) => {
                                        setFilter(value.toLowerCase(value))
                                        const arvo = allFiles.filter((item) =>
                                            item.name.toLowerCase().includes(filter.toLowerCase()))
                                        setSortedItems(arvo);
                                    }}
                                    placeholder={__('Search files..', 'meita-documents-and-media')}
                                    style={{ flex: 1, marginBottom: 0, border: 0, padding: 0 }}
                                    __next40pxDefaultSize
                                    __nextHasNoMarginBottom
                                />
                                <button
                                    id="documents-and-media-button"
                                    type="button"
                                    className="wp-button wp-block-button__link wp-block-search__button documents-and-media-button"
                                    value={filter}
                                    aria-label={showButtonIcon
                                        ? (searchbuttonlabel || __('Search', 'meita-documents-and-media'))
                                        : undefined}
                                    onClick={() => {
                                        setFilter(filter);
                                        console.log("filter ", filter);
                                        if (filter !== "") {
                                            const arvo = allFiles.filter((item) =>
                                                item.name.toLowerCase().includes(filter.toLowerCase()))
                                            setSortedItems(arvo);
                                        }
                                    }}
                                >
                                    {showButtonIcon ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                            aria-hidden="true"
                                            focusable="false"
                                            fill="currentColor"
                                        >
                                            <path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"></path>
                                        </svg>
                                    ) : (
                                        searchbuttonlabel === "Search"
                                            ? __('Search', 'meita-documents-and-media')
                                            : searchbuttonlabel
                                    )}
                                </button>
                            </div>
                        </form>

                        <br></br>

                        {loading ? (
                            <div className="spinnery"></div>
                        ) : (
                            <div className='googlebucketlist'>
                                <ul
                                    className='googlebucketlist-ul'
                                    aria-label='meita-documents-and-media google-bucket list'
                                >

                                    {(() => {
                                        const getSortKey = (item) => item.metadata?.FileTitle || item.name || "";

                                        const displayedItems = filteredItems
                                            .sort((a, b) => {
                                                if (orderBy === "title") {
                                                    const aKey = getSortKey(a);
                                                    const bKey = getSortKey(b);
                                                    return order === "ascending"
                                                        ? aKey.localeCompare(bKey, "fi", { sensitivity: "base" })
                                                        : bKey.localeCompare(aKey, "fi", { sensitivity: "base" });
                                                } else {
                                                    return order === "ascending"
                                                        ? new Date(a.updated) - new Date(b.updated)
                                                        : new Date(b.updated) - new Date(a.updated);
                                                }
                                            })
                                            .slice(currentPage, filter ? filteredItems.length : range + currentPage);

                                        return displayedItems.map((item, index) => (
                                            <Listitem
                                                key={item.id || index} // uniikki id jos saatavilla
                                                className={index}
                                                index={index}
                                                link={item.mediaLink}
                                                title={item.metadata?.FileTitle || item.name}
                                                showDate={showDate}
                                                showDescription={false}
                                                showDownloadLink={showDownloadLink}
                                                showIcon={showIcon}
                                                dateFormatted={format(new Date(item.updated), 'd.M.yy')}
                                                iconMimetype={item.contentType}
                                                url={"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)}
                                                filename={item.name}
                                                range={range}
                                            />
                                        ));
                                    })()}
                                </ul>


                                {range != 0 && filter == "" &&
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        selectedFiles={filteredItems ? filteredItems : selectedFiles}
                                        range={range}
                                        setCurrentPage={setCurrentPage}
                                    />
                                }

                            </div>
                        )}
                    </div>
                )}

                {selectclicked == true && listScreen == false && istrue == false && (
                    <div className='googlebucketlist'>
                        <ul className='googlebucketlist-ul'>
                            {sortedItems && sortedItems.map(function (item, index) {
                                return (
                                    <Listitem
                                        index={index}
                                        link={item.mediaLink}
                                        title={item.metadata ? item.metadata.FileTitle : item.name}
                                        showDate={showDate}
                                        showDescription={false}
                                        showDownloadLink={showDownloadLink}
                                        showIcon={showIcon}
                                        dateFormatted={format(new Date(item.updated), 'd.M.yy')}
                                        iconMimetype={item.contentType}
                                        url={"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)}
                                        filename={item.name}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                )}




            </div>

        </div>
    );
}
