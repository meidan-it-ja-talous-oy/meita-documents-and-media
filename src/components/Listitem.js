import { RawHTML } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

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
        rawHtmldescription,
        range


    } = props;

    const styles = {
        noMargin: {
            margin: "0px"
        },
    }

    const iconType = (mime_type) => {
        switch (true) {
            case mime_type.indexOf("application") != -1:
                return "fa-solid:file";
            case mime_type.indexOf("media-document") != -1:
                return "fa-solid:file-audio";
            case mime_type.indexOf("image") != -1:
                return "fa-solid:file-image";
            case mime_type.indexOf("video") != -1:
                return "fa-solid:file-video";
            case mime_type.indexOf("text") != -1:
                return "fa-solid:file-alt";
            default:
                return "fa-solid:file";
        }
    }

    return (
        <li className='bucket-browser-block-listitem' key={index}>
            {showIcon
                ? <div className={"bucket-browser-block-icon " + iconMimetype} >
                    {showIcon && iconMimetype && <div><span className="iconify" data-icon={iconType(iconMimetype)}></span></div>}

                </div>
                : <div className={"bucket-browser-block-icon " + iconMimetype} >
                    {!showIcon && !iconMimetype && <div><span className="iconify" ></span></div>}

                </div>
            }
            <div className='bucket-browser-block-content'>
                <a rel="noopener" target="_blank" href={url}>{title}</a>
                {showDate && <p className='date'>{dateFormatted}</p>}
                {showDownloadLink && <p><a className='download-link' href={link} download={filename}>{__('Download')}</a> </p>}
                {showDescription && rawHtmldescription && <RawHTML className='description' style={styles.noMargin}>{rawHtmldescription}</RawHTML>}
                {showDescription && !rawHtmldescription && <p className='description' style={styles.noMargin}>{description}</p>}
                <p></p>
            </div>
        </li>
    )
}