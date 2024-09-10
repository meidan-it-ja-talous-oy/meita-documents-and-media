import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Listitem from './components/Listitem';
import { format } from 'date-fns';
import { list } from '@wordpress/icons';
import './style.scss';



export default function save(props) {

    const { attributes } = props;

    const {
        selectedFiles,
        allFiles,
        filter,
        listScreen,
        range
    } = attributes;

    const blockprops = useBlockProps.save();

    return (

        <div
            {...blockprops}
            range={range}
        >

            {(props.attributes.datasource == "google" && listScreen == false) && (

                <ul className='googlebucketlist'>
                    {selectedFiles && selectedFiles.map(function (item, index) {

                        return (
                            <div>
                                <Listitem
                                    className={'bucket-browser-block-listitem'}
                                    index={index}
                                    link={item.mediaLink}
                                    title={item.metadata ? item.metadata.FileTitle : item.name}
                                    showDate={props.attributes.showDate}
                                    showDescription={false}
                                    showDownloadLink={props.attributes.showDownloadLink}
                                    showIcon={props.attributes.showIcon}
                                    dateFormatted={format(new Date(item.updated), 'd.M.yy')}
                                    iconMimetype={item.contentType}
                                    url={"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)}
                                    filename={item.name}

                                />
                                <p></p>
                            </div>
                        );
                    })}
                </ul>

            )}

            {(props.attributes.datasource == "google" && props.attributes.listScreen == true) && (
                <div>

                    <form
                        id="bucket-browser-block-form"
                        role="search"
                        className="block-editor-block-list__block wp-block wp-block-search__button-outside wp-block-search__text-button wp-block-search"
                        style={{ "width": "60%" }}>

                        <div className="components-resizable-box__container wp-block-search__inside-wrapper" style={{ "display": "flex" }}>

                            <input
                                type="search"
                                id="filter"
                                className="wp-block-search__input components-base-control filterResults"
                                name="filter"
                                placeholder={__('Search')}
                                style={{ "padding": 10, "margin-bottom": 0, "border": 0, "padding-bottom": 8, "font-size": 18, "width": "100%" }}
                            >
                            </input>

                            <button
                                type="submit"
                                id="bucket-browser-block-button"
                                className='block-editor-rich-text__editable wp-block-search__button wp-element-button rich-text'
                                // value={__("Search")}
                                style={{ "font-size": 18, "padding": "10px 20px", "display": "flex", "flex": 1 }}

                            >{__("Search")}</button>

                        </div>
                    </form>

                    <p id="spinnery" className="spinnery" style="display:none;"></p>

                    <ul className='googlebucketlist' style={{ "list-style": "none", "margin-top": 40 }} data-range={range}>
                    </ul >

                    <div id="pagination"></div>


                </div>


            )}

            {(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "files") && (

                <ul>
                    {props.attributes.files && props.attributes.files.map(function (item, index) {
                        return (
                            <div>
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
                                    // rawHtmldescription = { item.caption.rendered }
                                    iconImg={item.icon}
                                    iconMimetype={item.mime}
                                    url={item.url}
                                    filename={item.name}
                                />
                                <p></p>
                            </div>
                        );
                    })}
                </ul>
            )}

            {(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "folder") && (
                <ul>
                    {props.attributes.selectedAttachments && props.attributes.selectedAttachments.map(function (item, index) {
                        return (
                            <div>
                                <Listitem
                                    index={index}
                                    link={item.link}
                                    title={item.title.rendered}
                                    showDate={props.attributes.showDate}
                                    showDescription={props.attributes.showDescription}
                                    showDownloadLink={props.attributes.showDownloadLink}
                                    showIcon={props.attributes.showIcon}
                                    dateFormatted={format(new Date(item.modified), 'd.M.yy')}
                                    // description = { item.caption.rendered }
                                    rawHtmldescription={item.caption.rendered}
                                    // iconImg
                                    iconMimetype={item.mime_type}
                                    url={item.source_url}
                                    filename={item.slug}
                                />
                                <p></p>
                            </div>
                        );
                    })}
                </ul>
            )}



        </div >
    );
}
