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
        showIcon,
        order,
        orderBy
    } = attributes;


    const sortedFiles =
        props.attributes.files
            ? [...props.attributes.files].sort((a, b) => {
                if (orderBy === 'title') {
                    return order === 'ascending'
                        ? a.title.localeCompare(b.title, 'fi', { sensitivity: 'base' })
                        : b.title.localeCompare(a.title, 'fi', { sensitivity: 'base' });
                }
                return order === 'ascending'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            })
            : [];

    const sortedAttachments =
        props.attributes.selectedAttachments
            ? [...props.attributes.selectedAttachments].sort((a, b) => {
                if (orderBy === 'title') {
                    return order === 'ascending'
                        ? a.title.rendered.localeCompare(b.title.rendered, 'fi', { sensitivity: 'base' })
                        : b.title.rendered.localeCompare(a.title.rendered, 'fi', { sensitivity: 'base' });
                }
                return order === 'ascending'
                    ? new Date(a.modified) - new Date(b.modified)
                    : new Date(b.modified) - new Date(a.modified);
            })
            : [];

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
                    {sortedFiles && sortedFiles.map(function (item, index) {
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
                    {sortedAttachments && sortedAttachments.map(function (item, index) {
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
