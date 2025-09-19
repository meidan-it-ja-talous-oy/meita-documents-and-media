import { __ } from '@wordpress/i18n';
import { useEffect, useState, Fragment, RawHTML } from '@wordpress/element';
import { Button, PanelBody, SelectControl, CheckboxControl, TextControl, ToggleControl, Modal, RangeControl } from '@wordpress/components';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import './editor.scss';
import './style.scss';
import { more, file, box } from '@wordpress/icons';
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



    // INITIAL LOADS
    useEffect(() => {

        // Defaults from settings if new
        if (blockId == "") {
            setBlockId({ blockId: blockId });
            setSearchlabel({ searchlabel: searchlabel });
        }

        if (documentsBlockDefaults.bucketbrowseroptions) {
            if (documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl) setDatasourceURL(documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl);
        }


    }, [blockId])

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
            selectclicked: selectclicked,
            istrue: istrue

        });

    }, [showIcon, showDate, showDescription, allFiles, datasourceURL, listScreen, istrue, showDownloadLink, files, wpSelect, selectedFolder, order, orderBy, checked, currentPage, totalPages, selectedFiles, searchlabel, selectclicked, range])

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

        // console.log("Order on:", order);
        // console.log("OrderBY on:", orderBy);

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


    const ClientId = `${props.clientId}`;
    const blockIdtoBlock = `bucket-browser-block-${ClientId}`;




    return (
        <div {...useBlockProps({
            id: { blockIdtoBlock },
            showDownloadLink: { showDownloadLink }
        })}>

            <div>
                {(checked.length == 0 && selectclicked == true) &&

                    <div className='meita-documens-and-media-block-intro' style={{ "border": "1px solid grey", "padding": 15 }}>
                        <h3 style={{ "color": "black" }}>{__('Documents and media - Google Bucket', 'meita-documents-and-media')}</h3>
                        <label style={{ "font-weight": "bold" }}>{__('Open files and choose the ones you want', 'meita-documents-and-media')}</label>
                        <p>{__('Then you can adjust the display settings and change the order of the documents.', 'meita-documents-and-media')}</p>
                    </div>
                }

                <InspectorControls key="setting">
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
                                    {(selectclicked == false) &&
                                        <RangeControl
                                            label={__('Amount', 'meita-documents-and-media')}
                                            value={range}
                                            onChange={(value) => {
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

                    <PanelBody icon={file} title={__('Display settings', 'meita-documents-and-media')} initialOpen={false}>
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
                        {/* <ToggleControl
                            label={__('Show description', 'meita-documents-and-media')}
                            checked={showDescription}
                            onChange={(value) => {
                                setShowDescription(value);
                            }}
                            __nextHasNoMarginBottom
                        /> */}
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
                                options={[
                                    { label: __('Descending', 'meita-documents-and-media'), value: "descending" },
                                    { label: __('Ascending', 'meita-documents-and-media'), value: "ascending" }

                                ]}
                                value={order}
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                            />
                        </PanelBody>
                    )}
                </InspectorControls>
            </div>

            <div class="filesPreview">

                {istrue == true && listScreen == false && selectclicked == false && (

                    <div>
                        <div className='filterlist' style={{ "margin-top": 20 }}>

                            <form
                                id="documents-and-media-form"
                                role="search"
                                class="block-editor-block-list__block wp-block wp-block-search__button-outside wp-block-search__text-button wp-block-search"
                                style={{ "width": "60%" }}>

                                <label className="wp-block-search__label" for="documents-and-media-input" >
                                    <TextControl
                                        className="wp-block-search__label"
                                        value={searchlabel}
                                        placeholder={__('Seach bar label text here', 'meita-documents-and-media')}
                                        onChange={(value) => {
                                            setSearchlabel(value);
                                        }}
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
                                    />
                                </label>
                                <div className="components-resizable-box__container wp-block-search__inside-wrapper">

                                    <TextControl
                                        className="wp-block-search__input components-base-control"
                                        id="documents-and-media-input"
                                        type='search'
                                        value={filter}
                                        placeholder={__('Search files..', 'meita-documents-and-media')}
                                        onChange={(value) => {
                                            setFilter(value.toLowerCase())
                                        }}
                                        style={{ "padding": 10, "margin-bottom": 0, "margin-top": 5, "border": 0, "padding-bottom": 8, "font-size": 18 }}
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
                                    />

                                    <Button
                                        id="documents-and-media-button"
                                        className='block-editor-rich-text__editable wp-block-search__button wp-element-button rich-text'
                                        value={filter}
                                        onClick={() => {
                                            setFilter(filter);
                                        }}
                                        style={{ "font-size": 18, "padding": "10px 20px" }}
                                        aria-label={__('Search', 'meita-documents-and-media')}

                                    >{__('Search', 'meita-documents-and-media')}</Button>

                                </div>
                            </form>

                        </div>

                        <br></br>


                        {loading ? (
                            <div className="spinnery"></div>
                        ) : (
                            <div className='googlebucketlist'>
                                <ul
                                    className='googlebucketlist-ul'
                                    aria-label='documents-and-media-show-bucket list'
                                    style={{ "list-style": "none" }}>

                                    {(() => {
                                        // Valitaan näytettävät itemit
                                        const displayedItems = filter
                                            ? filteredItems
                                            : filteredItems.slice(currentPage, range + currentPage);

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
                                <div className='pagination' aria-label='bucket-browser-block pagination'>

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
