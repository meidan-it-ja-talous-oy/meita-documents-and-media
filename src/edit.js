import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Icon, Button, PanelBody, SelectControl, CheckboxControl, TextControl, ToggleControl } from '@wordpress/components';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { more } from '@wordpress/icons';
import './editor.scss';
import apiFetch from '@wordpress/api-fetch';

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
	const [ changed, setChanged ] = useState( false );

	useEffect(() => {
		if(datasourceURL != "" && datasource == "google") {
			apiFetch( { url: datasourceURL } ).then( ( files ) => {
				setAllFiles(files.items);
			});
		}
	},[datasourceURL, datasource])

	const sortByString = (a, b) => {
		if (a < b) {return -1;}
  		if (a > b) {return 1;}
  		return 0;
	}

	useEffect(() => {
		console.log(orderBy + " " + order + " " + datasource);
		if(datasource == "google") {
			var tmpArr = selectedFiles;
			console.log(tmpArr);
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
			console.log(tmpArr);
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
			props.setAttributes( { 
				showIcon: showIcon,
				showDate: showDate,
				showDescription: showDescription,
				showDownloadLink: showDownloadLink,
				files: files,
				datasource: datasource
			});
	},[showIcon, showDate, showDescription, showDownloadLink, files, datasource, datasourceURL])

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
		<div>
		<div { ...useBlockProps( { className: 'bucket-browser-block-bucket-browser' } ) }>
			<label>Valitse näytettävät tiedostot</label>
			{ (datasource == "google") ? (
				<div>
					<div>
					<TextControl
						label="Filter"
						value={ filter }
						onChange={ ( value ) => setFilter( value ) }
					/>
					</div>
					<ul id={ClientId+"_dataList"}>
						{allFiles && allFiles.map(function(item, index) {
							{ if(item.size !== "0" && (filter === "" || filter !== "" && item.name.indexOf(filter) !== -1)) 
								return <li key={index}><CheckboxControl checked={ selectedFiles.findIndex(obj => obj.id == item.id) != -1 } value={item.id} onChange={ () => { onChangeElement(item.id); } } label={item.name} /></li>
							}
						})}
					</ul>
				</div>
			) : 
			    <div>
					<MediaUploadCheck>
						<MediaUpload
							multiple={ true }
							onSelect={ (media) => setFiles(media) }
							value={ files.map(item => item.id) }
							render={ ( { open } ) => (
								<Button onClick={ open }>Avaa mediakirjasto</Button>
							) }
						/>
					</MediaUploadCheck>
				</div>
			}
			<InspectorControls key="setting">
				<PanelBody title="Tietolähteen asetukset" icon={ more } initialOpen={ false }>
					<SelectControl 
						id="datasource"
						label="Tietolähde"
						name="datasource"
						onChange={(selection) => {
							setDatasource(selection)
						}}
						options={[
							{label: "WordPress", value:"wordpress"},
							{label: "Google", value:"google"}
						]}
						value={datasource}
					/>
					{ (datasource == "google") && 
						(<TextControl
							label="Googlen bucket URL"
							value={ datasourceURL }
							onChange={ ( value ) => setDatasourceURL( value ) }
						/>)
					}
				</PanelBody>
				<PanelBody title="Näyttöasetukset" icon={ more } initialOpen={ false }>
					<ToggleControl
						label="Näytä ikonit"
						checked={ showIcon }
						onChange={ () => {
							setShowIcon( ( state ) => ! state );
						} }
					/>
					<ToggleControl
						label="Näytä päivämäärä"
						checked={ showDate }
						onChange={ () => {
							setShowDate( ( state ) => ! state );
						} }
					/>
					<ToggleControl
						label="Näytä kuvaus"
						checked={ showDescription }
						onChange={ () => {
							setShowDescription( ( state ) => ! state );
						} }
					/>
					<ToggleControl
						label="Näytä latauslinkki"
						checked={ showDownloadLink }
						onChange={ () => {
							setShowDownloadLink( ( state ) => ! state );
						} }
					/>
				</PanelBody>
				<PanelBody title="Järjestys" icon={ more } initialOpen={ false }>
					<SelectControl 
						id="orderBy"
						label="Järjestä mukaan"
						name="orderBy"
						onChange={(selection) => {
							setOrderBy(selection)
						}}
						options={[
							{label: "Otsikko", value:"title"},
							{label: "Päivämäärä", value:"date"}
						]}
						value={orderBy}
					/>
					<SelectControl 
						id="order"
						label="Järjestys"
						name="order"
						onChange={(selection) => {
							setOrder(selection)
						}}
						options={[
							{label: "Nouseva", value:"ascending"},
							{label: "Laskeva", value:"descending"}
						]}
						value={order}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
			<div class="filesPreview">
				{(datasource == "google") ? (
				<ul>
					{selectedFiles && selectedFiles.map(function(item, index) {
						return <li key={index}>
									<a rel="noopener" target="_blank" href={item.mediaLink}>{item.name}</a>
									{ showIcon && (item.contentType.indexOf("application") != -1) && <Icon icon="media-document" /> }
									{ showIcon && (item.contentType.indexOf("audio") != -1) && <Icon icon="media-audio" /> }
									{ showIcon && (item.contentType.indexOf("image") != -1) && <Icon icon="media-image" /> }
									{ showIcon && (item.contentType.indexOf("video") != -1) && <Icon icon="media-video" /> }
									{ showIcon && (item.contentType.indexOf("text") != -1) && <Icon icon="media-text" /> }
									{ showDate && <span>{item.updated}</span> }
									{ showDownloadLink && <a href={item.selfLink} download={item.name}>Lataa {item.name}</a> }
								</li>
					})}
				</ul>)
				: (
				<ul>
					{files && files.map(function(item, index) {
						return 	<li key={index}>
									<a href={item.link}>{item.title}</a>
									{ showIcon && <img src={item.icon} /> }
									{ showDate && <span>{item.dateFormatted}</span> }
									{ showDescription && <p>{item.description}</p> }
									{ showDownloadLink && <a href={item.url} download={item.filename}>Lataa {item.title}</a> }
								</li>
					})}
				</ul> )}
			</div>
		</div>
	);
}
