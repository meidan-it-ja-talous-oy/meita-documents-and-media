import { __ } from '@wordpress/i18n';
import { useEffect, useState, RawHTML } from '@wordpress/element';
import { Icon, Button, PanelBody, SelectControl, CheckboxControl, TextControl, ToggleControl, Modal, RangeControl } from '@wordpress/components';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { alignLeft, more } from '@wordpress/icons';
import './editor.scss';
import './style.scss';
import apiFetch from '@wordpress/api-fetch';
import Listitem from './components/Listitem';
import Pagination from './components/Pagination';
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
			apiFetch({ url: "/wp-json/filebird/public/v1/folders", headers: { "Authorization": `Bearer ${filebirdApiKey}` } }).then((response) => {
				const parsedFolders = folderParser(response.data.folders);
				setFolders(parsedFolders);
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
		if (bucketbrowserBlockDefaults.bucketbrowseroptions) {
			if (bucketbrowserBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl) setDatasourceURL(bucketbrowserBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl);
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

	const openModal = () => {
		setDatasourceURL(datasourceURL);
		setAllFiles(allFiles);
		setOpenModal(true);
		setChecked([]);
	}

	const closeModal = () => {
		if (clicked == false && selectedFiles.length == 0) {
			setTrue(false);
		}
		setOpenModal(false);
	}

	const saveTheChoiches = () => {
		setlistScreen(false);
		if (clicked == false && selectedFiles.length <= 0) {
			setTrue(false);
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

	const clicktoChange = () => {
		//tämä määrittä toggle nappulan select files to use
		if (selectclicked == false) {
			setSelectedFiles([]);
			setSelectClicked(true);
			setlistScreen(false);
			setTrue(false);
		} else {
			setSelectClicked(false);
			setlistScreen(true);
			setSelectedFiles([]);
			setTrue(true);
		}
	}

	const fetchFolderContents = () => {
		if (!filebirdApiKey) return;
		apiFetch({ url: "/wp-json/filebird/public/v1/attachment-id/?folder_id=" + selectedFolder, headers: { "Authorization": `Bearer ${filebirdApiKey}` } }).then((response) => {
			if (response.data.attachment_ids.length === 0) return setSelectedAttachments([]);
			apiFetch({ url: "/wp-json/wp/v2/media?per_page=100&include=" + response.data.attachment_ids, headers: { "Authorization": `Bearer ${filebirdApiKey}` } }).then((attachments) => {
				setSelectedAttachments(attachments);
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
		setChecked(updatedChecked);
		setChanged(!changed)
		setTrue(true);
	}


	const filteredItems = filter !== ""
		? selectedFiles.filter((item) =>
			item.name.toLowerCase().trim().replace(/\s+/g, '').includes(filter.toLowerCase())
		)
		: selectedFiles;


	const ClientId = `${props.clientId}`;
	const blockIdtoBlock = `bucket-browser-block-${ClientId}`;


	return (
		<div {...useBlockProps({
			className: 'bucket-browser-block-bucket-browser',
			id: { blockIdtoBlock }
		})}>

			<div>
				{(files.length === 0 && selectedAttachments.length == 0 && istrue == false && listScreen == false) &&

					<div style={{ "border": "1px solid grey", "padding": 15 }}>
						<h3 style={{ "color": "black" }}>{__('Bucket browser block')}</h3>
						<label style={{ "font-weight": "bold" }}>{__('Select the information to display')}</label>
						<p>{__('Start by selecting a data source, then you can adjust the display settings and change the order of the documents.')}</p>
					</div>
				}

				<InspectorControls key="setting">
					<PanelBody title={__('Data source settings')} icon={more} initialOpen={false}>
						<SelectControl
							id="datasource"
							label={__('data source')}
							name="datasource"
							onChange={(selection) => {
								setDatasource(selection)
								setSelectedFiles([]);
								setlistScreen(true);
								fetchItems(selection, datasourceURL, page);
							}}
							options={[
								{ label: __("WordPress"), value: "wordpress", selected: true },
								{ label: __("Google"), value: "google" }
							]}
							value={datasource}
						/>
						{(datasource == "google") &&
							(
								<div>
									<TextControl
										label={__("Google bucket URL")}
										value={datasourceURL}
									/>

									<ToggleControl
										label={__("Select files to use")}
										checked={selectclicked}
										onChange={() => {
											clicktoChange();
										}}
										help={selectclicked
											? ""
											: "Choosing 'Select files to use' you can choose which files you want to display."
										}
									/>

									{(selectclicked == true) &&

										<div style={{ "margin-top": 15 }}>
											<Button
												variant="primary"
												className={`is-primary`}
												onClick={() => {
													setlistScreen(true);
													setSelectedFiles([]);
													openModal();
												}}
											>{__('Select files')}</Button>

										</div>
									}
								</div>)
						}

						{(isOpen === true) && (
							<Modal
								isFullScreen={true}
								title={__("Select files to display")}
							>

								<div className='components-modal__header'>
									<TextControl
										style={{ "margin-top": 10, "margin-left": 203, "max-width": 229, "margin-right": 36 }}
										placeholder={__('Filter')}
										value={filter}
										onChange={(value) => { setFilter(value) }}
									/>
									<Button
										variant='primary'
										onClick={() => {
											clicktoTest();
										}}
									>{__('Filter only selected')}</Button>

									<Button
										onClick={() => {
											closeModal();
										}}
									></Button>
								</div>

								<div></div>

								<div>
									<ul id={ClientId + "_dataList"} style={{ "listStyle": "none" }}>
										{allFiles && clicked == false && allFiles.map(function (item, index) {

											if (item.size !== "0" && (filter === "" || filter !== "" && item.name.includes(filter)/*item.name.indexOf(filter) !== -1*/)) {
												return <li key={index}>
													<CheckboxControl
														checked={checked.some(obj => obj.id === item.id)}
														value={item.id}
														onChange={() => { onChangeElement(item.id); }}
														label={item.name}
													/>
												</li>
											}

										})}
										{checked && clicked == true && checked.map(function (item, index) {

											if (item.size !== "0" && (filter === "" || filter !== "" && item.name.includes(filter)/*item.name.indexOf(filter) !== -1*/)) {
												return <li key={index}>
													<CheckboxControl
														//checked={checked.findIndex(obj => obj.id == item.id) != -1}
														checked={checked.some(obj => obj.id === item.id)}
														value={item.id}
														onChange={() => { onChangeElement(item.id); }}
														label={item.name}
													/>
												</li>
											}
										})}
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
										}}>{__('SAVE')}
									</Button>
								</div>

							</Modal>
						)}

						{(datasource == "wordpress") &&
							(
								<div>
									<SelectControl
										id="wpSelect"
										label={__("Information to display")}
										name="wpSelect"
										onChange={(selection) => {
											setWpSelect(selection)
											setTrue(false);
										}}
										options={[
											{ label: __("Files"), value: "files" },
											{ label: __("Folder"), value: "folder" }
										]}
										value={wpSelect}
									/>
								</div>
							)
						}

						{(datasource == "wordpress" && wpSelect == "files") && (

							<MediaUploadCheck>
								<MediaUpload
									multiple={true}
									onSelect={(media) => { setFiles(media) }}
									value={files.map(item => item.id)}
									render={({ open }) => (
										<Button onClick={open} isPrimary>{__('Open Media Library')}</Button>
									)}
								/>
							</MediaUploadCheck>

						)}

						{(datasource == "wordpress" && wpSelect == "folder") &&
							(<div>
								{!(folders.length === 0)

									?
									<SelectControl
										id="selectedFolder"
										label={__("Folder")}
										name="selectedFolder"
										onChange={(selection) => {
											setSelectedFolder(selection)
										}}
										value={selectedFolder}
										options={folders}
									/>
									:
									<label style={{ color: "red" }}>{__('You have to have Filebirds ApiKey, if you want to browse folders!')}</label>
								}
							</div>)
						}
					</PanelBody>

					<PanelBody title={__("Display settings")} icon={more} initialOpen={false}>
						<ToggleControl
							label={__("Show icons")}
							checked={showIcon}
							onChange={(value) => {
								setShowIcon(value);
							}}
						/>
						<ToggleControl
							label={__("Show date")}
							checked={showDate}
							onChange={(value) => {
								setShowDate(value);
							}}
						/>
						<ToggleControl
							label={__("Show description")}
							checked={showDescription}
							onChange={(value) => {
								setShowDescription(value);
							}}
						/>
						<ToggleControl
							label={__("Show download link")}
							checked={showDownloadLink}
							onChange={(value) => {
								setShowDownloadLink(value);
							}}
						/>
						{(selectclicked == false) &&
							<RangeControl
								label={__("Amount")}
								value={range}
								onChange={(value) => {
									setRange(value);
								}}
								min={0}
								max={50}
							/>
						}
					</PanelBody>

					{(listScreen == false) && (
						<PanelBody title={__("Order")} icon={more} initialOpen={false}>
							<SelectControl
								id="orderBy"
								label={__("Order by")}
								name="orderBy"
								onChange={(selection) => {
									setOrderBy(selection)
								}}
								options={[
									{ label: __("Title"), value: "title" },
									{ label: __("Date"), value: "date" }
								]}
								value={orderBy}
							/>
							<SelectControl
								id="order"
								label={__("Order")}
								name="order"
								onChange={(selection) => {
									setOrder(selection)
								}}
								options={[
									{ label: __("Ascending"), value: "ascending" },
									{ label: __("Descending"), value: "descending" }
								]}
								value={order}
							/>
						</PanelBody>
					)}
				</InspectorControls>
			</div>

			<div class="filesPreview">

				{datasource == "google" /*&& selectedFiles.length > 0 */ && listScreen == false && (
					<div className='googlebucketlist'>
						<ul className='googlebucketlist-ul'>
							{selectedFiles && selectedFiles.map(function (item, index) {
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
										// description = { item.caption.rendered }
										// rawHtmldescription = {  }
										// iconImg
										iconMimetype={item.contentType}
										url={"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)}
										filename={item.name}
									/>
								)
							})}
						</ul>
					</div>
				)}

				{(datasource == "google") && listScreen == true && (

					<div>
						<div className='filterlist' style={{ "margin-top": 20 }}>

							<form
								id="bucket-browser-block"
								role="search"
								class="block-editor-block-list__block wp-block wp-block-search__button-outside wp-block-search__text-button wp-block-search"
								style={{ "width": "60%" }}>

								<label className="wp-block-search__label" for="bucket-browser-block-input" >
									<TextControl
										className="wp-block-search__label"
										value={searchlabel}
										placeholder="Text when there is no search results"
										onChange={(value) => {
											setSearchlabel(value);
										}}
									/>
								</label>
								<div className="components-resizable-box__container wp-block-search__inside-wrapper">

									<TextControl
										className="wp-block-search__input components-base-control"
										id="bucket-browser-block-input"
										type='search'
										value={filter}
										placeholder={__("Search files..")}
										onChange={(value) => {
											setFilter(value.toLowerCase())
										}}
										style={{ "padding": 10, "margin-bottom": 0, "margin-top": 5, "border": 0, "padding-bottom": 8, "font-size": 18 }}
									/>

									<Button
										id="bucket-browser-block-button"
										className='block-editor-rich-text__editable wp-block-search__button wp-element-button rich-text'
										value={filter}
										onClick={() => {
											setFilter(filter);
										}}
										style={{ "font-size": 18, "padding": "10px 20px" }}
										aria-label={__('Search')}

									>{__("Search")}</Button>

								</div>
							</form>

						</div>

						<br></br>


						{loading === true
							?
							(
								<div className="spinnery"></div>
							)
							:
							<div className='googlebucketlist'>
								<ul className='googlebucketlist-ul' aria-label='bucket-browser-block list' style={{ "list-style": "none" }}>

									{filteredItems && filter !== "" ?

										filteredItems

											.map(function (item, index) {

												if (filter !== "" || filter === "") {
													return (
														<Listitem
															key={index}
															className={index}
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
															range={range}
														/>
													);
												}
												return null;
											})

										:
										filteredItems

											.slice(currentPage, range + 1 * currentPage)

											.map(function (item, index) {

												if (filter !== "" || filter === "") {
													return (
														<Listitem
															key={index}
															className={index}
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
															range={range}
														/>
													);
												}
												return null;
											})
									}
								</ul>
								<div className='pagination' aria-label='bucket-browser-block pagination'>

									{range != 0 && filter == "" && listScreen == true &&
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
						}
					</div>
				)}

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
									// description = { item.caption.rendered }
									rawHtmldescription={item.caption.rendered}
									// iconImg
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
