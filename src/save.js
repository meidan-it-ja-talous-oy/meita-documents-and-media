import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Listitem from './components/Listitem';

export default function save(props) {
	return (
		<div { ...useBlockProps.save() }>
			{(props.attributes.datasource == "google") && (
				<ul>
					{props.attributes.selectedFiles && props.attributes.selectedFiles.map(function(item, index) {
                        return(
                            <Listitem
                                index = {index}
                                link = {item.mediaLink}
                                title = {item.name}
                                showDate = {props.attributes.showDate}
                                showDescription = {false}
                                showDownloadLink = {props.attributes.showDownloadLink}
                                showIcon = {props.attributes.showIcon}
                                dateFormatted = {item.updated}
                                iconMimetype = { item.contentType }
                                url = {item.selfLink}
                                filename = {item.name}
                            />
                        );
					})}
				</ul>)}
				{(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "files") && (
				<ul>
					{props.attributes.files && props.attributes.files.map(function(item, index) {
                        return(
                            <Listitem
                                index = {index}
                                link = {item.link}
                                title = {item.title}
                                showDate = {props.attributes.showDate}
                                showDescription = {props.attributes.showDescription}
                                showDownloadLink = {props.attributes.showDownloadLink}
                                showIcon = {props.attributes.showIcon}
                                dateFormatted = {item.dateFormatted}
                                description = { item.description }
                                // rawHtmldescription = { item.caption.rendered }
                                iconImg = {item.icon}
                                // iconMimetype = {item.icon}
                                url = {item.url}
                                filename = {item.filename}
                            />
                        );
					})}
				</ul> )}
				{(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "folder") && (
					<ul 
                        className="meitaDocumentList wordpressFolders"
                        meta-folders={`${props.attributes.selectedFolder}`}
                        meta-fbak={`${props.attributes.filebirdApiKey}`}
                        meta-showIcon={`${props.attributes.showIcon}`}
                        meta-showDescription={`${props.attributes.showDescription}`}
                        meta-showDate={`${props.attributes.showDate}`}
                        meta-showDownloadLink={`${props.attributes.showDownloadLink}`}
                    >
                        {
                            <script>
                                meitaLoadDocuments()
                            </script>
                        }
					</ul>
				)}
		</div>
	);
}
