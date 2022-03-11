import { RawHTML } from '@wordpress/element';
import { InlineIcon } from '@iconify/react';

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

        const styles = {
            bucketBrowserBlockListitem: {
                display: "flex"
            },
            bucketBrowserBlockIcon: {
                width: "50px",
                height: "65px",
                marginRight: "15px",
                borderRadius: "5px"
            },
            bucketBrowserBlockIconSpan: {
                fontSize: '54px',
                margin: '5px'
            },
            noMargin: {
                margin: "0px"
            }
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
        <li className='bucket-browser-block-listitem' key={index} style={styles.bucketBrowserBlockListitem}>
            <div className='bucket-browser-block-icon ' style={styles.bucketBrowserBlockIcon} >
                { showIcon && iconImg && <center><img src={iconImg} /></center> }
                { showIcon && iconMimetype && <InlineIcon icon={iconType(iconMimetype)} style={styles.bucketBrowserBlockIconSpan} /> }
            </div>
            <div className='bucket-browser-block-content'>
                <a rel="noopener" target="_blank" href={link}>{title}</a>
                { showDate && <p className='date' style={styles.noMargin}>{dateFormatted}</p> }
                { showDownloadLink && <a className='download-link' href={url} download={filename}>Lataa</a> }
                { showDescription && rawHtmldescription && <RawHTML className='description' style={styles.noMargin}>{rawHtmldescription}</RawHTML> }
                { showDescription && !rawHtmldescription && <p className='description' style={styles.noMargin}>{description}</p> }
            </div>
        </li>
    )
}