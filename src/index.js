import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from '../block.json';


registerBlockType(metadata.name,
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
			selectedFilesSTR: {
				type: "string",
				default: ""
			},
			files: {
				type: "array",
				default: []
			},
			checked: {
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
				default: ""
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
				type: "string"
			},
			selectedFolder: {
				type: "string",
				default: ""
			},
			selectedAttachments: {
				type: "array",
				default: []
			},
			wpSelect: {
				type: "string",
				default: "files"
			},
			listScreen: {
				type: "boolean",
				default: false
			},
			range: {
				type: "number",
				default: 5
			},
			currentPage: {
				type: "number",
				default: 0
			},
			totalPages: {
				type: "number",
				default: 0
			}
		},
		edit: Edit,
		save: Save

	}


);
