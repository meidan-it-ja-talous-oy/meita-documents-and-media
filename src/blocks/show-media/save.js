import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Listitem from '../../components/list-item';
import { format } from 'date-fns';
import './style.scss';



export default function save(props) {

    const blockprops = useBlockProps.save();

    const { attributes } = props;

    const {
        listScreen,
        range,
        blockId,
        showDownloadLink,
        showDate,
        showIcon
    } = attributes;



    return (

        <div
            {...blockprops}
            data-range={range}
            id={blockId}
            data-listScreen={listScreen}
            data-showDownloadlink={showDownloadLink}
            data-showdate={showDate}
            data-showicon={showIcon}
        >

            {(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "files") && (

                <ul>
                    {props.attributes.files && props.attributes.files.map(function (item, index) {
                        return (
                            <Listitem
                                index={index}
                                link={item.link}
                                title={item.title}
                                showDate={props.attributes.showDate}
                                showDescription={props.attributes.showDescription}
                                showDownloadLink={props.attributes.showDownloadLink}
                                showIcon={props.attributes.showIcon}
                                dateFormatted={item.dateFormatted}
                                description={item.description}
                                rawHtmldescription={item.caption.rendered}
                                iconImg={item.icon}
                                iconMimetype={item.mime}
                                url={item.url}
                                filename={item.name}
                            />
                        );
                    })}
                </ul>
            )}

            {(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "folder") && (
                <ul>
                    {props.attributes.selectedAttachments && props.attributes.selectedAttachments.map(function (item, index) {
                        return (
                            <Listitem
                                index={index}
                                link={item.link}
                                title={item.title.rendered}
                                showDate={props.attributes.showDate}
                                showDescription={props.attributes.showDescription}
                                showDownloadLink={props.attributes.showDownloadLink}
                                showIcon={props.attributes.showIcon}
                                dateFormatted={format(new Date(item.modified), 'd.M.yy')}
                                description={item.caption.rendered}
                                rawHtmldescription={item.caption.rendered}
                                // iconImg
                                iconMimetype={item.mime_type}
                                url={item.source_url}
                                filename={item.slug}
                            />
                        );
                    })}
                </ul>
            )}
        </div >
    );
}
