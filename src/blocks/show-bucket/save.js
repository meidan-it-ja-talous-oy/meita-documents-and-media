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
        showButtonIcon,
        searchbuttonlabel,
        order,
        orderBy,
        filter,
        listScreen,
        range,
        blockId,
        searchlabel,
        showLabel,
        showDownloadLink,
        showDate,
        showIcon,
        istrue
    } = attributes;



    function getSortKey(item) {
        return item.metadata?.FileTitle || item.title || item.name || "";
    }


    const getSortedItems = (items) => {

        let filtered = [...items]

        if (orderBy === "title") {
            filtered.sort((a, b) => {
                const aKey = getSortKey(a);
                const bKey = getSortKey(b);
                return order === "ascending"
                    ? aKey.localeCompare(bKey, "fi", { sensitivity: "base" })
                    : bKey.localeCompare(aKey, "fi", { sensitivity: "base" });
            });
        } else if (orderBy === "date") { // date
            filtered.sort((a, b) => {
                return order === "ascending"
                    ? new Date(a.updated) - new Date(b.updated)
                    : new Date(b.updated) - new Date(a.updated);
            });
        }
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
                                                    className={"meita-documents-and-media-listitem"}
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
                        <label
                            htmlFor="wp-block-search__input-1"
                            className={showLabel ? "wp-block-search__label" : "screen-reader-text"}
                        >
                            {searchlabel === "Search"
                                ? __('Search', 'meita-contacts-integration')
                                : searchlabel}
                        </label>

                        <div className="components-resizable-box__container wp-block-search__inside-wrapper"
                            style={{ "display": "flex" }}>

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
                                style={{ "font-size": 18, "padding": "10px 20px", "display": "flex", "flex": 1 }}
                                aria-label={showButtonIcon
                                    ? (searchbuttonlabel || __('Search', 'meita-documents-and-media'))
                                    : undefined}

                            >
                                {showButtonIcon ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        aria-hidden="true"
                                        focusable="false"
                                        fill="currentColor"
                                    >
                                        <path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"></path>
                                    </svg>
                                ) : (
                                    searchbuttonlabel === "Search"
                                        ? __('Search', 'meita-contacts-integration')
                                        : searchbuttonlabel
                                )}
                            </button>

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
