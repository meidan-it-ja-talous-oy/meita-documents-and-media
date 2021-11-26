import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from '../block.json';

registerBlockType( metadata.name,
	{
		...metadata,
		attributes: {
			example: {
				type: "string",
				default: "Example"
			}
		},
		edit: Edit,
		save: Save
	}
);
