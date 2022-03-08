import { Icon } from '@wordpress/components';
import { RawHTML } from '@wordpress/element';

export default function listitem(props) {
    const {
        index,
        link,
        title,
        showDate,
        showDescription,
        showDownloadLink,
        showIcon,
        dateFormatted,
        description,
        iconImg,
        iconMimetype,
        url,
        filename,
        rawHtmldescription} = props;

        const iconType = (mime_type) => {
            switch (true) {
                case mime_type.indexOf("application") != -1:
                    return "media-document";
                case mime_type.indexOf("media-document") != -1:
                    return "media-audio";
                case mime_type.indexOf("image") != -1:
                    return "format-image";
                case mime_type.indexOf("video") != -1:
                    return "format-video";
                case mime_type.indexOf("text") != -1:
                    return "media-text";
                default:
                    return "media-document";
            }
        }

    return (
        <li className='bucket-browser-block-listitem' key={index}>
            <div className='bucket-browser-block-icon'>
                { showIcon && iconImg && <center><img src={iconImg} /></center> }
                { showIcon && iconMimetype && <Icon icon={iconType(iconMimetype)} /> }
            </div>
            <div className='bucket-browser-block-content'>
                <a rel="noopener" target="_blank" href={link}>{title}</a>
                { showDate && <p className='date'>{dateFormatted}</p> }
                { showDownloadLink && <a className='download-link' href={url} download={filename}>Lataa</a> }
                { showDescription && rawHtmldescription && <RawHTML className='description'>{rawHtmldescription}</RawHTML> }
                { showDescription && !rawHtmldescription && <p className='description'>{description}</p> }
            </div>
        </li>
    )
}