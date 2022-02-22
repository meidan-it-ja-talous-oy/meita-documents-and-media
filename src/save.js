import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

export default function save(props) {
	return (
		<div { ...useBlockProps.save() }>
			{(props.attributes.datasource == "google") && (
				<ul>
					{props.attributes.selectedFiles && props.attributes.selectedFiles.map(function(item, index) {
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
				</ul>)}
				{(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "files") && (
				<ul>
					{props.attributes.files && props.attributes.files.map(function(item, index) {
						return 	<li key={index}>
									<a href={item.link}>{item.title}</a>
									{ props.attributes.showIcon && <img src={item.icon} /> }
									{ props.attributes.showDate && <span>{item.dateFormatted}</span> }
									{ props.attributes.showDescription && <p>{item.description}</p> }
									{ props.attributes.showDownloadLink && <a href={item.url} download={item.filename}>Lataa {item.title}</a> }
								</li>
					})}
				</ul> )}
				{(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "folder") && (
					<ul className="meitaDocumentList" meta-folders={props.attributes.selectedFolder}>
						<script>
							var fbak = "{props.attributes.filebirdApiKey}";
							var showIcon = "{props.attributes.showIcon}";
							var showDescription = "{props.attributes.showDescription}";
							var showDate = "{props.attributes.showDate}";
							var showDownloadLink = "{props.attributes.showDownloadLink}";
						</script>
					</ul>
				)}
		</div>
	);
}
