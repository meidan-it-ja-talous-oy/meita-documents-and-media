import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Listitem from './components/Listitem';
import { format } from 'date-fns';



export default function save(props) {

    const blockprops= useBlockProps.save();
    console.log(props.attributes.showIcon)
  
	return (
       
		<div { ...blockprops}>

			{(props.attributes.datasource == "google") && (
                
				<ul>
					{props.attributes.selectedFiles && props.attributes.selectedFiles.map(function(item, index) {
                        return( 
                           <div>
                            <Listitem 
                                className={'bucket-browser-block-listitem'} 
                                index = {index}
                                link = {item.mediaLink}
                                title = {item.name}
                                showDate = {props.attributes.showDate}
                                showDescription = {false}
                                showDownloadLink = {props.attributes.showDownloadLink}
                                showIcon = {props.attributes.showIcon}
                                dateFormatted = {format(new Date(item.updated), 'd.M.yy')}
                                iconMimetype = {item.contentType}   
                                url = {"https://storage.googleapis.com/"+item.bucket+"/"+ encodeURIComponent(item.name)}
                                filename = {item.name}
                               
                            />
                            <p></p>
                           </div>
                        );
					})}
				</ul>
               
            )}

			{(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "files") &&(
                
                 
                <ul 
                    className="meitaDocumentList wordpressFolders"
                    meta-type="files"
                    meta-files={ props.attributes.selectedFilesSTR }
                    meta-showIcon={`${props.attributes.showIcon}`}
                    meta-showDescription={`${props.attributes.showDescription}`}
                    meta-showDate={`${props.attributes.showDate}`}
                    meta-showDownloadLink={`${props.attributes.showDownloadLink}`}
                >

                {props.attributes.files && props.attributes.files.map(function(item, index) {
                        return(
						<div>
                            
							
                            <Listitem
                                index = {index}
                                link = {item.link}
                                title = {item.title}
                                showDate = {props.attributes.showDate}
                                showDescription = {props.attributes.showDescription}
                                showDownloadLink = {props.attributes.showDownloadLink}
                                showIcon = {props.attributes.showIcon}
                                dateFormatted = {item.dateFormatted}
                                description = { item.description }
                                // rawHtmldescription = { item.caption.rendered }
                                iconImg = {item.icon}
                                iconMimetype = {item.mime}
                                url = {item.url}
                                filename = {item.name}
                            />
                            <p></p>
							</div>
                        );
					})}
                    
                    {/* {
                        <script>
                            meitaLoadDocuments()
                        </script>
                    } */}

			    </ul>     
            )}

            {(props.attributes.datasource == "wordpress" && props.attributes.wpSelect == "folder") && (
					<ul 
                        className="meitaDocumentList wordpressFolders"
                        meta-type="folder"
                        meta-folders={`${props.attributes.selectedFolder}`}
                        meta-fbak={`${props.attributes.filebirdApiKey}`}
                        meta-showIcon={`${props.attributes.showIcon}`}
                        meta-showDescription={`${props.attributes.showDescription}`}
                        meta-showDate={`${props.attributes.showDate}`}
                        meta-showDownloadLink={`${props.attributes.showDownloadLink}`}
                    >

                    {props.attributes.selectedAttachments && props.attributes.selectedAttachments.map(function(item, index) {
                        return(
							<div>
								
                            <Listitem
                                index = {index}
                                link = {item.link}
                                title = {item.title.rendered}
                                showDate = {props.attributes.showDate}
                                showDescription = {props.attributes.showDescription}
                                showDownloadLink = {props.attributes.showDownloadLink}
                                showIcon = {props.attributes.showIcon}
                                dateFormatted = {format(new Date(item.modified), 'd.M.yy')}
                                // description = { item.caption.rendered }
                                rawHtmldescription = { item.caption.rendered }
                                // iconImg
                                iconMimetype = { item.mime_type }
                                url = {item.source_url}
                                filename = {item.slug}
                            />
                            <p></p>
							</div>
                        );
					})}
                        {/* {
                            <script>
                                meitaLoadDocuments()
                            </script>
                        } */}

					</ul>
				)}
           
           

		</div>
	);
}
