import { __ } from '@wordpress/i18n';
import RawHTML from '@wordpress/element';

export default function Listitem(props) {


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
        rawHtmldescription

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
            case mime_type.indexOf("audio") != -1:
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
        <li className='meita-documents-and-media-listitem' id={index}>
            {showIcon
                ? <div className={"meita-documents-and-media-icon " + iconMimetype} >
                    {showIcon && iconMimetype && <div><span className="iconify" data-icon={iconMimetype ? iconType(iconMimetype) : "fa-solid:file"}></span></div>}

                </div>
                : <div className={"meita-documents-and-media-icon " + iconMimetype} >
                    {!showIcon && !iconMimetype && <div><span className="iconify" ></span></div>}

                </div>
            }
            <div className='meita-documents-and-media-content'>
                <p className='document-name'><a target="_blank" area-label={title.replace(/_/g, ' ').replace(/\..*$/, '')} href={url} rel="noopener">{title}</a></p>
                {showDate && <p className='updated-date' title={__('Modified ', 'meita-documents-and-media') + dateFormatted} >{__('Modified', 'meita-documents-and-media')} {dateFormatted}</p>}
                {showDescription && rawHtmldescription && <span className='description' style={styles.noMargin}>{rawHtmldescription.replace(/<[^>]*>/g, '').trim()}</span>}
                {showDescription && !rawHtmldescription && <span className='description' style={styles.noMargin}>{description}</span>}
                {showDownloadLink && <p className='download-button'> <a className='download-link' rel="noopener" href={link} area-label={__('Download  ', 'meita-documents-and-media') + title.replace(/_/g, ' ').replace(/\..*$/, '')} download={filename}>{__('Download', 'meita-documents-and-media')}</a></p>}
            </div>
        </li>
    )
}