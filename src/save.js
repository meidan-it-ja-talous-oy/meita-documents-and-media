import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save(props) {
	return (
		<div { ...useBlockProps.save() }>
			<ul>
				{props.attributes.selectedFilesString && JSON.parse(props.attributes.selectedFilesString).map(function(item, index) {
					return <li key={index}><a rel="noopener" target="_blank" href={item.mediaLink}>{item.name}</a></li>
				})}
			</ul>
		</div>
	);
}
