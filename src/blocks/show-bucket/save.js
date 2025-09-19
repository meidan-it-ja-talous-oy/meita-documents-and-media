import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Listitem from '../../components/list-item';
import Pagination from '../../components/pagination-script';
import { format } from 'date-fns';
import './style.scss';



export default function save(props) {

    const blockprops = useBlockProps.save();

    const { attributes } = props;

    const {
        selectedFiles,
        allFiles,
        currentPage,
        totalPages,
        order,
        orderBy,
        filter,
        listScreen,
        range,
        blockId,
        searchlabel,
        showDownloadLink,
        showDate,
        showIcon,
        istrue
    } = attributes;






    const getSortedItems = (items) => {

        let filtered = [...items]
        console.log("orderBy", orderBy);
        console.log("order", order);

        filtered.sort((a, b) => {
            if (orderBy === "title") {
                return order === "ascending"
                    ? a.name.localeCompare(b.name, 'fi', { sensitivity: 'base' })
                    : b.name.localeCompare(a.name, 'fi', { sensitivity: 'base' });
            } else { // date
                return order === "ascending"
                    ? new Date(a.updated) - new Date(b.updated)
                    : new Date(b.updated) - new Date(a.updated);
            }
        });

        return filtered;
    }

    const filteredItems = filter
        ? getSortedItems(selectedFiles).filter((item) =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        )
        : getSortedItems(selectedFiles);




    return (

        <div
            {...blockprops}
            data-range={range}
            id={blockId}
            data-listScreen={listScreen}
            data-showDownloadlink={showDownloadLink}
            data-showdate={showDate}
            data-showicon={showIcon}
            data-istrue={istrue}
            data-order={order}
            data-orderby={orderBy}
        >

            {(listScreen == false && istrue == false) && (

                <div>

                    <div className='googlebucketlist'>

                        <ul className='googlebucketlist-results'>

                            {filteredItems &&

                                filteredItems

                                    .map(function (item, index) {

                                        if (filter !== "" || filter === "") {
                                            return (
                                                <Listitem
                                                    key={index}
                                                    className={"bucket-browser-block-listitem"}
                                                    index={index}
                                                    link={item.mediaLink}
                                                    title={item.metadata ? item.metadata.FileTitle : item.name}
                                                    showDate={props.attributes.showDate}
                                                    showDescription={false}
                                                    showDownloadLink={showDownloadLink}
                                                    showIcon={showIcon}
                                                    dateFormatted={format(new Date(item.updated), 'd.M.yy')}
                                                    iconMimetype={item.contentType}
                                                    url={"https://storage.googleapis.com/" + item.bucket + "/" + encodeURIComponent(item.name)}
                                                    filename={item.name}
                                                    range={range}
                                                />
                                            );
                                        }
                                        return null;
                                    })
                            }
                        </ul>

                        <div />
                    </div>
                </div>
            )}

            {(props.attributes.datasource == "google" && listScreen == false && istrue == true) && (
                <div>
                    <form
                        role="search"
                        className="documents-and-media-form block-editor-block-list__block wp-block wp-block-search__button-outside wp-block-search__text-button wp-block-search"
                        style={{ "width": "60%" }}
                        id="documents-and-media-form"
                    >
                        <label className='wp-block-search__label' for="documents-and-media-input">{searchlabel}</label>
                        <div className="components-resizable-box__container wp-block-search__inside-wrapper" style={{ "display": "flex" }}>

                            <input
                                type="search"
                                id="documents-and-media-input"
                                className="filter wp-block-search__input components-base-control filterResults"
                                placeholder={__('Search files', 'meita-documents-and-media')}
                                style={{ "padding": 10, "margin-bottom": 0, "border": 0, "padding-bottom": 8, "font-size": 15, "width": "100%" }}
                            >
                            </input>

                            <button
                                type="submit"
                                className='documents-and-media-button block-editor-rich-text__editable wp-block-search__button wp-element-button rich-text'
                                // value={__("Search")}
                                style={{ "font-size": 18, "padding": "10px 20px", "display": "flex", "flex": 1 }}
                                aria-label={__('Search', 'meita-documents-and-media')}

                            >{__("Search")}</button>

                        </div>
                    </form>
                    <p className="spinnery" style="display:none;"></p>

                    <div className='googlebucketlist'>
                    </div >

                    {/* <div className="pagination"></div> */}


                </div>


            )}




        </div >
    );
}
