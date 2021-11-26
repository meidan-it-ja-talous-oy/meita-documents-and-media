import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import apiFetch from '@wordpress/api-fetch';

export default function Edit(props) {
	const {
		allFiles,
		selectedFiles,
		selectedFilesString
	} = props.attributes;
	useEffect(() => {
		apiFetch( { url: 'https://storage.googleapis.com/storage/v1/b/hoitopolut/o' } ).then( ( files ) => {
			props.setAttributes( { allFiles: files.items } );
		} );
	},[])
	
	useEffect(() => {
		console.log(props);
	})

	const onChangeElement = ( id ) => {
		var tmpArr = props.attributes.selectedFiles; 
		const index = tmpArr.findIndex(obj => obj.id===id);
		if(index !== -1) {
			tmpArr.splice(index,1);
		} else {
			const el = props.attributes.allFiles.find(obj => obj.id === id );
			tmpArr.push(el);
		}
		props.setAttributes( { selectedFilesString: JSON.stringify(tmpArr) } );
    }

	const isSelected = ( id ) => { //TODO FIX THIS SHIT
		if(JSON.parse(props.attributes.selectedFilesString).findIndex(obj => obj.id===id) !== -1) {
			return true;
		}
		return false;
	}

	const ClientId = `${props.clientId}`;

	return(
		<div { ...useBlockProps( { className: 'bucket-browser-block-bucket-browser' } ) }>
			<label>Valitse näytettävät tiedostot</label>
			<ul id={ClientId+"_dataList"}>
			{props.attributes.allFiles && props.attributes.allFiles.map(function(item, index) {
				return <li key={index}><input {...isSelected(item.id) ? "checked" : ""} onChange={() => onChangeElement(item.id)} id={item.id} type="checkbox"></input><label for={item.id}>{item.name}</label></li>
			})}
			</ul>
		</div>
	);
}
