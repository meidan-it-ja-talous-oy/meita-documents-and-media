import { __ } from '@wordpress/i18n';
import { useEffect, useState, RawHTML } from '@wordpress/element';
import { Button, Panel, Placeholder, PanelBody, SelectControl, CheckboxControl, TextControl, ToggleControl, Modal, RangeControl } from '@wordpress/components';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { alignLeft, more, box, file, formatListNumbered } from '@wordpress/icons';
import './editor.scss';
import './style.scss';
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
    const [order, setOrder] = useState(props.attributes.order);
    const [orderBy, setOrderBy] = useState(props.attributes.orderBy);
    const [wpSelect, setWpSelect] = useState(props.attributes.wpSelect);
    const [changed, setChanged] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedAttachments, setSelectedAttachments] = useState(props.attributes.selectedAttachments);
    const [selectedFolder, setSelectedFolder] = useState(props.attributes.selectedFolder);
    const [filebirdApiKey, setFilebirdApiKey] = useState(props.attributes.filebirdApiKey);
    const [isOpen, setOpenModal] = useState(false);
    const [listScreen, setlistScreen] = useState(props.attributes.listScreen);
    const [istrue, setTrue] = useState(false);
    const [checked, setChecked] = useState(props.attributes.checked);
    const [clicked, setClicked] = useState(false);
    const [selectclicked, setSelectClicked] = useState(false);
    const [range, setRange] = useState(props.attributes.range);
    const [currentPage, setCurrentPage] = useState(props.attributes.currentPage);
    const [totalPages, setTotalPages] = useState(props.attributes.totalPages);
    const [loading, setLoading] = useState(true);
    const [blockId, setBlockId] = useState(props.clientId);
    const [searchlabel, setSearchlabel] = useState(props.searchlabel);

    const page = 1


    useEffect(() => {

        if (blockId == "") {
            setBlockId({ blockId: blockId });
            setSearchlabel({ searchlabel: searchlabel });
        }

        if (datasourceURL != "" && datasource == "google" && listScreen == false) {
            apiFetch({ url: datasourceURL }).then((files) => {
                setAllFiles(files.items);
                setTotalPages(files.length);

            });
        } else {
            fetchItems(datasource, datasourceURL, page);
        }


    }, [datasource, datasourceURL, range, totalPages, filter, listScreen, blockId])



    useEffect(() => {
        if (wpSelect == "folder" && datasource == "wordpress" && filebirdApiKey) {
            apiFetch({
                url: "/wp-json/filebird/public/v1/folders",
                headers: {
                    "Authorization": `Bearer ${filebirdApiKey}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                const parsedFolders = folderParser(response.data.folders);
                setFolders(parsedFolders);
            }).catch((err) => {
                console.error("Virhe folder pyynnössä:", err);
            });
        }
    }, [wpSelect, filebirdApiKey])


    useEffect(() => {
        if (wpSelect == "folder" && datasource == "wordpress" && selectedFolder != "") {
            fetchFolderContents();
        }
    }, [selectedFolder, filebirdApiKey])


    useEffect(() => {
        if (datasource == "google" && listScreen == false) {
            var tmpArr = selectedFiles;
            if (orderBy == "title") {
                if (order == "ascending") {
                    tmpArr.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
                } else {
                    tmpArr.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : -1);
                }
            } else {
                if (order == "ascending") {
                    tmpArr.sort((a, b) => new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime());
                } else {
                    tmpArr.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
                }
            }
            setSelectedFiles(tmpArr);
            setChanged((changed ? false : true));
        } else {
            var tmpArr = files;
            if (orderBy == "title") {
                if (order == "ascending") {
                    tmpArr.sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1);
                } else {
                    tmpArr.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? 1 : -1);
                }
            } else {
                if (order == "ascending") {
                    tmpArr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                } else {
                    tmpArr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                }
            }
            setFiles(tmpArr);
            setChanged((changed ? false : true));
        }
    }, [order, orderBy])


    useEffect(() => {
        if (datasource == "wordpress" && wpSelect == "files") {
            var selectedFiles2 = "";
            files.map(function (item, index) {
                if (index === 0) {
                    selectedFiles2 = item.id;
                } else {
                    selectedFiles2 = selectedFiles2 + "," + item.id;
                }
                if (index === (files.length - 1)) {
                    props.setAttributes({
                        selectedFilesSTR: selectedFiles2
                    });
                }
            });
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
            filebirdApiKey: filebirdApiKey,
            selectedAttachments: selectedAttachments,
            selectedFiles: selectedFiles,
            checked: checked,
            listScreen: listScreen,
            filter: filter,
            allFiles: allFiles,
            range: range,
            currentPage: currentPage,
            totalPages: totalPages,
            blockId: blockId,
            searchlabel: searchlabel

        });

    }, [showIcon, showDate, showDescription, allFiles, datasourceURL, listScreen, showDownloadLink, files, wpSelect, selectedFolder, order, orderBy, filebirdApiKey, selectedAttachments, checked, currentPage, totalPages, selectedFiles, searchlabel])

    // INITIAL LOADS
    useEffect(() => {
        // Defaults from settings if new
        if (documentsBlockDefaults.bucketbrowseroptions) {
            if (documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl) setDatasourceURL(documentsBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl);
        }
        if (apikey) {
            if (apikey.FILEBIRD_BEARER_TOKEN) setFilebirdApiKey(apikey.FILEBIRD_BEARER_TOKEN);
        }

        if (wpSelect == "folder" && datasource == "wordpress" && selectedFolder) {
            fetchFolderContents();
        }
        if (selectedFiles.length != 0) {
            setTrue(true)
        }
    }, [])




    const fetchItems = (selection, datasourceURL, page) => {
        page = currentPage;
        const url = `${datasourceURL}?offset=${page}&limit=${range - 1}`;

        if (datasourceURL != "" && selection == "google") {
            apiFetch({ url: url })
                .then((data) => {
                    setTotalPages(data.items.length);
                    setTimeout(function () {
                        setSelectedFiles(data.items);
                        setLoading(false);
                    }, 1000);
                });
        }
    };



    const fetchFolderContents = () => {

        if (!filebirdApiKey) return;
        apiFetch({
            url: "/wp-json/filebird/public/v1/attachment-id/?folder_id=" + selectedFolder,
            headers: {
                "Authorization": `Bearer ${filebirdApiKey}`
            }
        }).then((response) => {
            if (response.data.attachment_ids.length === 0) {
                return setSelectedAttachments([]);
            }
            apiFetch({
                url: "/wp-json/wp/v2/media?per_page=100&include=" + response.data.attachment_ids,
                headers: {
                    "Authorization": `Bearer ${filebirdApiKey}`
                }
            }).then((attachments) => {
                setSelectedAttachments(attachments);
            }).catch((err) => {
                console.error("Virhe kansiota haettaessa:", err);
            });
        });


    }


    const folderParser = (filebirdFolders, iteration = 0) => {
        if (Array.isArray(filebirdFolders.children) && filebirdFolders.children.length !== 0) {
            return filebirdFolders.map((folder) => { return { label: folder.text, value: folder.id } })
        } else {
            let sum = filebirdFolders.map((folder) => { return { label: folder.text, value: folder.id } });
            for (let subfolder of Object.values(filebirdFolders)) {
                let content = folderParser(subfolder.children, iteration + 1)
                sum.push(content);
            }
            return sum.reduce((previousValue, currentValue) => {
                return previousValue.concat(currentValue)
            }, [])
        }
    }


    const ClientId = `${props.clientId}`;
    const blockIdtoBlock = `bucket-browser-block-${ClientId}`;

    return (
        <div {...useBlockProps({
            className: 'meita-documents-and-media',
            id: { blockIdtoBlock },
            showDownloadLink: { showDownloadLink }
        })}>

            <div>
                {(files.length === 0 && selectedAttachments.length == 0 && istrue == false && listScreen == false) &&

                    <div style={{ "border": "1px solid grey", "padding": 15 }}>
                        <h3 style={{ "color": "black" }}>{__('Documents and media - Media files', 'meita-documents-and-media')}</h3>
                        <label style={{ "font-weight": "bold" }}>{__('Start by selecting a file or folder', 'meita-documents-and-media')}</label>
                        <p>{__('Then you can adjust the display settings and change the order of the documents.', 'meita-documents-and-media')}</p>
                    </div>
                }

                <InspectorControls key="setting">
                    <Panel>
                        <PanelBody title={__('Data source settings', 'meita-documents-and-media')} icon={box} initialOpen={false}>

                            {(datasource == "wordpress") && (
                                <SelectControl
                                    id="wpSelect"
                                    label={__('Information to display', 'meita-documents-and-media')}
                                    name="wpSelect"
                                    onChange={(selection) => {
                                        setWpSelect(selection)
                                        setTrue(false);
                                    }}
                                    options={[
                                        { label: __('Files', 'meita-documents-and-media'), value: "files" },
                                        { label: __('Folder', 'meita-documents-and-media'), value: "folder" }
                                    ]}
                                    value={wpSelect}
                                    __nextHasNoMarginBottom
                                    __next40pxDefaultSize
                                />
                            )}

                            {(datasource == "wordpress" && wpSelect == "files") && (
                                <MediaUploadCheck>
                                    <MediaUpload
                                        multiple={true}
                                        onSelect={(media) => { setFiles(media) }}
                                        value={files.map(item => item.id)}
                                        render={({ open }) => (
                                            <Button onClick={open} isPrimary >{__('Open Media Library', 'meita-documents-and-media')}</Button>
                                        )}
                                    />
                                </MediaUploadCheck>
                            )}

                            {(datasource == "wordpress" && wpSelect == "folder") &&
                                (<div>
                                    {!(folders.length === 0) ?
                                        <SelectControl
                                            id="selectedFolder"
                                            label={__('Folder', 'meita-documents-and-media')}
                                            name="selectedFolder"
                                            onChange={(selection) => {
                                                setSelectedFolder(selection);
                                            }}
                                            value={selectedFolder}
                                            options={[
                                                { label: __('Choose folder', 'meita-documents-and-media'), value: '' }, // 👈 eka vaihtoehto
                                                ...folders,
                                            ]}
                                            __nextHasNoMarginBottom
                                            __next40pxDefaultSize
                                        />
                                        :
                                        <p style={{ color: "red" }}>{__('You have to have Filebirds ApiKey, if you want to browse folders!', 'meita-documents-and-media')}</p>
                                    }
                                </div>)
                            }
                        </PanelBody>

                        <PanelBody title={__('Display settings', 'meita-documents-and-media')} icon={file} initialOpen={false}>
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
                                label={__('Show description', 'meita-documents-and-media')}
                                checked={showDescription}
                                onChange={(value) => {
                                    setShowDescription(value);
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
                            <PanelBody title={__('Order', 'meita-documents-and-media')} icon={formatListNumbered} initialOpen={false}>
                                <SelectControl
                                    id="orderBy"
                                    label={__('Order by', 'meita-documents-and-media')}
                                    name="orderBy"
                                    onChange={(selection) => {
                                        setOrderBy(selection)
                                    }}
                                    options={[
                                        { label: __('Title', 'meita-documents-and-media'), value: "title" },
                                        { label: __('Date', 'meita-documents-and-media'), value: "date" }
                                    ]}
                                    value={orderBy}
                                    __next40pxDefaultSize
                                    __nextHasNoMarginBottom
                                />
                                <SelectControl
                                    id="order"
                                    label={__('Order', 'meita-documents-and-media')}
                                    name="order"
                                    onChange={(selection) => {
                                        setOrder(selection)
                                    }}
                                    options={[
                                        { label: __('Ascending', 'meita-documents-and-media'), value: "ascending" },
                                        { label: __('Descending', 'meita-documents-and-media'), value: "descending" }
                                    ]}
                                    value={order}
                                    __next40pxDefaultSize
                                    __nextHasNoMarginBottom
                                />
                            </PanelBody>
                        )}
                    </Panel>
                </InspectorControls>
            </div>

            <div class="filesPreview">


                {(datasource == "wordpress" && wpSelect == "files") && (
                    <ul>
                        {files && files.map(function (item, index) {
                            return (
                                <Listitem
                                    index={index}
                                    link={item.link}
                                    title={item.title}
                                    showDate={showDate}
                                    showDescription={showDescription}
                                    showDownloadLink={showDownloadLink}
                                    showIcon={showIcon}
                                    dateFormatted={item.dateFormatted}
                                    description={item.description}
                                    // rawHtmldescription = { item.caption.rendered }
                                    iconImg={item.icon}
                                    iconMimetype={item.mime}
                                    url={item.url}
                                    filename={item.name}
                                />
                            );
                        })}
                    </ul>
                )}

                {(datasource == "wordpress" && wpSelect == "folder") && (
                    <ul>
                        {selectedAttachments && selectedAttachments.map(function (item, index) {
                            return (
                                <Listitem
                                    index={index}
                                    link={item.link}
                                    title={item.title.rendered}
                                    showDate={showDate}
                                    showDescription={showDescription}
                                    showDownloadLink={showDownloadLink}
                                    showIcon={showIcon}
                                    dateFormatted={format(new Date(item.modified), 'd.M.yy')}
                                    rawHtmldescription={item.caption.rendered}
                                    description={item.caption.rendered}
                                    //iconImg={item}
                                    iconMimetype={item.mime_type}
                                    url={item.source_url}
                                    filename={item.slug}
                                />
                            );
                        })}
                    </ul>
                )}
            </div>

        </div>
    );
}
