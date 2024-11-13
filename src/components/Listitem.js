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
        <li className='bucket-browser-block-listitem' id={index}>
            {showIcon
                ? <div className={"bucket-browser-block-icon " + iconMimetype} >
                    {showIcon && iconMimetype && <div><span className="iconify" data-icon={iconType(iconMimetype)}></span></div>}

                </div>
                : <div className={"bucket-browser-block-icon " + iconMimetype} >
                    {!showIcon && !iconMimetype && <div><span className="iconify" ></span></div>}

                </div>
            }
            <div className='bucket-browser-block-content'>
                <a target="_blank" area-label={title.replace(/_/g, ' ').replace(/\..*$/, '')} href={url} rel="noopener">{title}</a>
                {showDate && <p className='date' title={__('Modified ') + dateFormatted} >{__('Modified')} {dateFormatted}</p>}
                {showDownloadLink && <a className='download-link' rel="noopener" href={link} area-label={__('Download  ') + title.replace(/_/g, ' ').replace(/\..*$/, '')} download={filename}>{__('Download')}</a>}
                {showDescription && rawHtmldescription && <RawHTML className='description' style={styles.noMargin}>{rawHtmldescription}</RawHTML>}
                {showDescription && !rawHtmldescription && <p className='description' style={styles.noMargin}>{description}</p>}
                <p></p>
            </div>
        </li>
    )
}