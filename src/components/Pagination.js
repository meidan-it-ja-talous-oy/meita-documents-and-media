import { __ } from '@wordpress/i18n';

export default function Pagination(props) {

    const {
        currentPage,
        totalPages,
        selectedFiles,
        range,
        setCurrentPage

    } = props;


    const total = Math.ceil(totalPages / range);

    let pageNow = currentPage + 1;

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < total) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handleClick = (page) => {

        console.log("page", page);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };
    //console.log("currentpage p ", currentPage);

    return (
        <div>
            <div className="pagination" id="pagination" style={{ "display": "flex", "margin-top": 20 }}>
                <button
                    onClick={() => handlePrevious()}
                    disabled={currentPage === 1 || currentPage === 0}
                    style={{ "margin-right": 10, "background-color": "inherit", "border": 0 }}
                >
                    {__("Previous")}
                </button>
                {selectedFiles.map((_, i) => (
                    <div className='rivi'>
                        {(i < 5) && (
                            <button
                                key={i}
                                onClick={() => {
                                    console.log("i", i)
                                    handleClick(i + 1)
                                }}
                                className={currentPage === i + 1 ? 'active' : ''}
                                style={{ "margin-left": 5 }}
                            >
                                {i + 1}
                            </button>
                        )}
                    </div>
                ))}

                <button
                    onClick={() => handleNext()}
                    disabled={currentPage === total}
                    style={{ "margin-left": 10, "background-color": "inherit", "border": 0 }}
                >
                    {__("Next")}
                </button>


            </div>
            <div
                style={{ "padding": 10 }}
            >
                <span
                >Page {currentPage == 0 ? pageNow : currentPage} of {total}</span>
            </div>
        </div>
    )
}