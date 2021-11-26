import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit(props) {
	const [example, setExample] = useState( props.attributes.example );

	// ComponentDidMount
	useEffect(() => {

	},[])
	
	// ComponentDidUpdate
	useEffect(() => {
		
	})

	return(
		<div { ...useBlockProps.save( { className: 'bucket-browser-block-bucket-browser' } ) }>
			<h1>{ __('Render me pls, this is', 'example') } { example }</h1>
			<TextControl onChange={ setExample } />
		</div>
	);
}
