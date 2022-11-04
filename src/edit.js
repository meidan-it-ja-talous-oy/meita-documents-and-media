import { __ } from '@wordpress/i18n';
import { useEffect, useState, RawHTML } from '@wordpress/element';
import { Icon, Button, PanelBody, SelectControl, CheckboxControl, TextControl, ToggleControl, Modal } from '@wordpress/components';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { more } from '@wordpress/icons';
import './editor.scss';
import apiFetch from '@wordpress/api-fetch';
import Listitem from './components/Listitem';
import { format } from 'date-fns';

export default function Edit(props) {
		const [ filter, setFilter ] = useState( '' );
		const [ showIcon, setShowIcon] = useState( props.attributes.showIcon );
		const [ showDate, setShowDate] = useState( props.attributes.showDate );
		const [ showDescription, setShowDescription] = useState( props.attributes.showDescription );
		const [ showDownloadLink, setShowDownloadLink] = useState( props.attributes.showDownloadLink );
		const [ datasource, setDatasource ] = useState( props.attributes.datasource );
		const [ datasourceURL, setDatasourceURL ] = useState( props.attributes.datasourceURL );
		const [ files, setFiles ] = useState( props.attributes.files );
		const [ selectedFiles, setSelectedFiles ] = useState( props.attributes.selectedFiles );
		const [ allFiles, setAllFiles ] = useState( props.attributes.allFiles );
		const [ order, setOrder ] = useState( props.attributes.order );
		const [ orderBy, setOrderBy ] = useState( props.attributes.orderBy );
		const [ wpSelect, setWpSelect ] = useState( props.attributes.wpSelect );
		const [ changed, setChanged ] = useState( false );
		const [ folders, setFolders ] = useState( [] );
		const [ selectedAttachments, setSelectedAttachments ] = useState( props.attributes.selectedAttachments );
		const [ selectedFolder, setSelectedFolder ] = useState( props.attributes.selectedFolder );
		const [ filebirdApiKey, setFilebirdApiKey ] = useState( props.attributes.filebirdApiKey );
		const [isOpen, setOpenModal]=useState(false)
	
	useEffect(() => {
		if(datasourceURL != "" && datasource == "google") {
			apiFetch( { url: datasourceURL } ).then( ( files ) => {
				setAllFiles(files.items);
			});
		}
	},[datasourceURL, datasource])

	useEffect(() => {
		if(wpSelect == "folder" && datasource == "wordpress" && filebirdApiKey) {
			apiFetch( { url: "/wp-json/filebird/public/v1/folders", headers: { "Authorization": `Bearer ${filebirdApiKey}` } } ).then( ( response ) => {
                const parsedFolders = folderParser(response.data.folders);
                setFolders(parsedFolders);
			});
		}
	},[wpSelect, filebirdApiKey])

	useEffect(() => {
		if(wpSelect == "folder" && datasource == "wordpress" && selectedFolder != "") {
			fetchFolderContents();
		}
	},[selectedFolder, filebirdApiKey])

	useEffect(() => {
		if(datasource == "google") {
			var tmpArr = selectedFiles;
			if(orderBy == "title") {
				if(order == "ascending") {
					tmpArr.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
				} else {
					tmpArr.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : -1);
				}
			} else {
				if(order == "ascending") {
					tmpArr.sort((a, b) => new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime());
				} else {
					tmpArr.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
				}
			}
			setSelectedFiles(tmpArr);
			setChanged((changed ? false : true));
		} else {
			var tmpArr = files;
			if(orderBy == "title") {
				if(order == "ascending") {
					tmpArr.sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1);
				} else {
					tmpArr.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? 1 : -1);
				}
			} else {
				if(order == "ascending") {
					tmpArr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				} else {
					tmpArr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
				}
			}
			setFiles(tmpArr);
			setChanged((changed ? false : true));
		}
	},[order, orderBy])

	useEffect(() => {
			if(datasource == "wordpress" && wpSelect == "files") {
				var selectedFiles2 = "";
				files.map(function(item, index) {
					if( index === 0 ) {
						selectedFiles2 = item.id;
					} else {
						selectedFiles2 = selectedFiles2 + "," + item.id;
					}
					if(index === (files.length-1)) {
						props.setAttributes( {
							selectedFilesSTR: selectedFiles2
						});
					}
				});
			}
			props.setAttributes( { 
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
				
			});
	},[showIcon, showDate, showDescription, showDownloadLink, files, datasource, datasourceURL, wpSelect, selectedFolder, order, orderBy, filebirdApiKey,selectedAttachments, selectedFiles])

    // INITIAL LOADS
	useEffect(() => {
        // Defaults from settings if new
		if(bucketbrowserBlockDefaults.bucketbrowseroptions){
			if(bucketbrowserBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl) setDatasourceURL(bucketbrowserBlockDefaults.bucketbrowseroptions.GCPBucketAPIurl);
		}
		if(apikey){
			if(apikey.FILEBIRD_BEARER_TOKEN) setFilebirdApiKey(apikey.FILEBIRD_BEARER_TOKEN);
		}

		if(wpSelect == "folder" && datasource == "wordpress" && selectedFolder) {
			fetchFolderContents();
		}
	},[])

	const openModal = () => {
		setSelectedFiles([]);
		setOpenModal(true);	
	}
    const closeModal = () => {
		setOpenModal(false)
	}
	const saveTheChoiches=()=>{
		
		closeModal()
	}
	

    const fetchFolderContents = () => {
        if(!filebirdApiKey) return;
        apiFetch( { url: "/wp-json/filebird/public/v1/attachment-id/?folder_id="+selectedFolder, headers: { "Authorization": `Bearer ${filebirdApiKey}` } } ).then( ( response ) => {
            if(response.data.attachment_ids.length === 0) return setSelectedAttachments([]); 
            apiFetch( { url: "/wp-json/wp/v2/media?per_page=100&include="+response.data.attachment_ids, headers: { "Authorization": `Bearer ${filebirdApiKey}` } } ).then( ( attachments ) => {
                setSelectedAttachments(attachments);
            });
        });
    }

    const folderParser = (filebirdFolders, iteration = 0) => {
        if(Array.isArray(filebirdFolders.children) && filebirdFolders.children.length !== 0) {
            return filebirdFolders.map((folder) => {return { label: folder.text, value: folder.id }})
        } else {
            let sum = filebirdFolders.map((folder) => {return { label: folder.text, value: folder.id }});
            for (let subfolder of Object.values(filebirdFolders)) {
                let content = folderParser(subfolder.children, iteration + 1)
                sum.push(content);
            }
            return sum.reduce((previousValue, currentValue) => {
                return previousValue.concat(currentValue)
            },[])
        }
    }

	const onChangeElement = ( id ) => {
		var tmpArr = selectedFiles;
		const index = selectedFiles.findIndex(obj => obj.id===id);
		if(index !== -1) {
			tmpArr.splice(index,1);
		} else {
			const el = allFiles.find(obj => obj.id === id );
			tmpArr.push(el);
		}
		setSelectedFiles(tmpArr);
		setChanged((changed ? false : true));
    }

	const ClientId = `${props.clientId}`;

	return( 
		<div { ...useBlockProps( { className: 'bucket-browser-block-bucket-browser' } ) }>

		<div>	
			{(files.length===0 && (changed==true) && selectedAttachments.length==0)  &&
			<label>{__('Select the information to display')}</label>
			}
			

			<InspectorControls key="setting">
				<PanelBody title={__('Data source settings')} icon={ more } initialOpen={ false }>
					<SelectControl 
						id="datasource"
						label={__('data source')}
						name="datasource"
						onChange={(selection) => {
							setDatasource(selection)
						}}
						options={[
							{label: __("WordPress"), value:"wordpress"},
							{label: __("Google"), value:"google"}
						]}
						value={datasource}
					/>
					{ (datasource == "google") && 
					( 	
						<div>
							<TextControl
								label={__("Google bucket URL")}
								value={ datasourceURL }
								
								onChange={ ( value ) => setDatasourceURL( value ) }
						/>
							
							<Button
								variant="primary"
								className={`is-primary`}
								onClick={ () => {
									openModal();
								} }
								>{__('Browse')}</Button>
						</div>)
					}
					
					{(isOpen===true)&& (
						<Modal
							isFullScreen={true}
							title={__("Select files to display")}	
						>
						
						
							<div className='components-modal__header'>
							<TextControl
								style={{"margin-top": 10, "margin-left": 280, "max-width": 315}}
								placeholder={__('Filter')}
								value={ filter }
								onChange={ ( value ) => {setFilter( value )} }	
							/>
							<Button
								onClick={()=>{closeModal()}}	
								></Button>
							</div>
						

							<div></div>
							<div>
							
								<ul id={ClientId+"_dataList"} style={{"listStyle": "none"}}>
									{allFiles && allFiles.map(function(item, index) {
										{ if(item.size !== "0" && (filter === "" || filter !== "" && item.name.indexOf(filter) !== -1)) 
											return <li key={index}><CheckboxControl checked={ selectedFiles.findIndex(obj => obj.id == item.id) != -1 } value={item.id} onChange={ () => { onChangeElement(item.id); } } 
												label={item.name} /></li>
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
								"background-color": "white" }}>

							<Button 
								style={{"position": "absolute","right": 35}}
								variant="primary"
								onClick={() => {
								saveTheChoiches();
								}}>{__('SAVE')}
							</Button>
								
								
							</div>
						
							
					
						</Modal>

					)} 

					{ (datasource == "wordpress") && 
						(
						<div>
						<SelectControl 
							id="wpSelect"
							label={__("Information to display")}
							name="wpSelect"
							onChange={(selection) => {
								setWpSelect(selection)
							}}
							options={[
								{label: __("Files"), value:"files"},
								{label: __("Folder"), value:"folder"}
							]}
							value={wpSelect}
						/>

						</div>)

					}
					{ (datasource == "wordpress" && wpSelect == "files") && (
					
						<MediaUploadCheck>
							<MediaUpload
								multiple={ true }
								onSelect={ (media) => { setFiles(media) }}
								value={ files.map(item => item.id) }
								render={ ( { open } ) => (
									<Button onClick={ open } isPrimary>{__('Open Media Library')}</Button>
							) }
						/>
						</MediaUploadCheck>
						
					)}	

					{ (datasource == "wordpress" && wpSelect == "folder") && 
						(<div>
							{!(folders.length===0)
								
						?
						<SelectControl 
							id="selectedFolder"
							label={__("Folder")}
							name="selectedFolder"
							onChange={(selection) =>{
								setSelectedFolder(selection)
								}}
							value={selectedFolder}
                            options={folders}
						/>
						:
						<label style={{color: "red" }}>{__('You have to have Filebirds ApiKey, if you want to browse folders!')}</label>
						
						}
						</div>
						)
						
						
					}
				</PanelBody>
				<PanelBody title={__("Display settings")} icon={ more } initialOpen={ false }>
					<ToggleControl
						label={__("Show icons")}
						checked={ showIcon }
						onChange={ (value) => {
							setShowIcon(value);
						} }
						
					/>
					<ToggleControl
						label={__("Show date")}
						checked={ showDate }
						onChange={ (value) => {
							setShowDate(value);
						} }
					/>
					<ToggleControl
						label={__("Show description")}
						checked={ showDescription }
						onChange={ (value) => {
							setShowDescription(value);
						} }
					/>
					<ToggleControl
						label={__("Show download link")}
						checked={ showDownloadLink }
						onChange={ (value) => {
							setShowDownloadLink(value);
						} }
					/>
				</PanelBody>
				<PanelBody title={__("Order")} icon={ more } initialOpen={ false }>
					<SelectControl 
						id="orderBy"
						label={__("Order by")}
						name="orderBy"
						onChange={(selection) => {
							setOrderBy(selection)
						}}
						options={[
							{label: __("Title"), value:"title"},
							{label: __("Date"), value:"date"}
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
							{label: __("Ascending"), value:"ascending"},
							{label: __("Descending"), value:"descending"}
						]}
						value={order}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
		<div class="filesPreview">
				{(datasource == "google") && (
				<ul className='googlebucketlist'>
					{selectedFiles && selectedFiles.map(function(item, index) {
                        return(
							<div>
							
                            <Listitem
                                index = {index}
                                link = {item.mediaLink}
                                title = {item.name}
                                showDate = {showDate}
                                showDescription = {false}
                                showDownloadLink = {showDownloadLink}
                                showIcon = {showIcon}
                                dateFormatted = {format(new Date(item.updated), 'd.M.yy')}
                                // description = { item.caption.rendered }
                                // rawHtmldescription = {  }
                                // iconImg
                                iconMimetype = { item.contentType }
                                url = {"https://storage.googleapis.com/"+item.bucket+"/"+ encodeURIComponent(item.name)}
                                filename = {item.name}
                            />
							</div>
                        );

					})}
				</ul>)
				}
				{ (datasource == "wordpress" && wpSelect == "files") && (
				<ul>
					{files && files.map(function(item, index) {
                        return(
						<div>
							{}
                            <Listitem
                                index = {index}
                                link = {item.link}
                                title = {item.title}
                                showDate = {showDate}
                                showDescription = {showDescription}
                                showDownloadLink = {showDownloadLink}
                                showIcon = {showIcon}
                                dateFormatted = {item.dateFormatted}
                                description = { item.description }
                                // rawHtmldescription = { item.caption.rendered }
                                iconImg = {item.icon}
                                iconMimetype = {item.mime}
                                url = {item.url}
                                filename = {item.name}
                            />
							</div>
                        );
					})}
				</ul> )}
				{ (datasource == "wordpress" && wpSelect == "folder") && (
				<ul>
					{selectedAttachments && selectedAttachments.map(function(item, index) {
                        return(
							<div>
								
                            <Listitem
                                index = {index}
                                link = {item.link}
                                title = {item.title.rendered}
                                showDate = {showDate}
                                showDescription = {showDescription}
                                showDownloadLink = {showDownloadLink}
                                showIcon = {showIcon}
                                dateFormatted = {format(new Date(item.modified), 'd.M.yy')}
                                // description = { item.caption.rendered }
                                rawHtmldescription = { item.caption.rendered }
                                // iconImg
                                iconMimetype = { item.mime_type }
                                url = {item.source_url}
                                filename = {item.slug}
                            />
							</div>
                        );
					})}
				</ul> )}
			</div>

		</div>

	);
}
