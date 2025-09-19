import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';





var out = registerBlockType(metadata, {
    edit: Edit,
    save: Save

});
if (typeof out == 'undefined') {
    console.error('Block failed to register', metadata);
}


