import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Listitem from './components/Listitem';
import { format } from 'date-fns';
import { list } from '@wordpress/icons';



export default function save(props) {

    const { attributes } = props;

    const {
        selectedFiles,
        allFiles,
        filter,
        listScreen
    } = attributes;

    const blockprops = useBlockProps.save();

    let list = Array();
    let val = "";
    let all = "no";



    const onChangeElement = (value) => {


        var inputElements = document.getElementsByClassName('file-checkbox').checked;

        if (inputElements == true) {
            alert("tere", value);
            selectedFiles.push(value);
        }

    };


    const showedItems = (val) => {

        for (let i = allFiles.length - 1; i >= 0; i--) {
            if (allFiles[i].value) {
                list.push(showedItems[i].key);
            }
        }
    }


    return (

        <div {...blockprops}>

            {(props.attributes.datasource == "google") && (

                <ul >
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

                    <form>
                        <label for="filter">Select files to display</label>
                        <input
                            style={{ "margin-top": 10, "margin-left": 50, "width": 290, "margin-right": 36, "padding": 10 }}
                            type="text"
                            id="filter"
                            name="filter"
                            placeholder='filter'
                            value={val}
                            onChange={() => showedItems(val)}
                        >
                        </input>

                        <button
                            id="filter-selected"
                            style={{ "padding": 10 }}
                            onClick={() => {
                                console.log(document.ge)
                            }}
                        >Näytä kaikki</button>

                    </form>

                    <div>{selectedFiles}</div>

                    {/* <ul className='googlebucketlist' style={{ "list-style": "none" }}>
                      

                        {allFiles && allFiles.map(function (item, index) {
                            return (

                                <div>
                                    <form>

                                        <li>
                                            <label style={{ "display": "block" }}>
                                                <input
                                                    type="checkbox"
                                                    className="file-checkbox"
                                                    data-file-name={item.name}
                                                    style={{ "margin-right": 10 }}
                                                    value={item}
                                                    onChange={() => onChangeElement(item)}
                                                >
                                                </input>
                                                <span>{item.name}</span>
                                            </label>
                                        </li>

                                    </form>
                                </div>
                            )
                        })}


                    </ul> */}


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
            )
            }

            {
                (props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "folder") && (
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
                )
            }



        </div >
    );
}
