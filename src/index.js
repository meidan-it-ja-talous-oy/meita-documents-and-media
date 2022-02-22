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
			allFiles: {
				type: "array",
				default: []
			},
			selectedFiles: {
				type: "array",
				default: []
			},
			files: {
				type: "array",
				default: []
			},
			filter: {
				type: "string",
				default: ""
			},
			datasource: {
				type: "string",
				default: "wordpress"
			},
			datasourceURL: {
				type: "string",
				default: "https://storage.googleapis.com/storage/v1/b/hoitopolut/o"
			},
			showIcon: {
				type: "boolean",
				default: true
			},
			showDate: {
				type: "boolean",
				default: true
			},
			showDescription: {
				type: "boolean",
				default: true
			},
			showDownloadLink: {
				type: "boolean",
				default: true
			},
			orderBy: {
				type: "string",
				default: "title"
			},
			order: {
				type: "string",
				default: "ascending"
			},
			filebirdApiKey: {
				type: "string",
				default: "od27BXgkknzLqfj8m458Rr3nWn0kM9dgn6WkFTzy"
			},
			selectedFolders: {
				type: "string",
				default: ""
			},
			selectedAttachments: {
				type: "array",
				default: []
			}
		},
		edit: Edit,
		save: Save
	}
);
