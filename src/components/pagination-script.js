import { __, sprintf } from '@wordpress/i18n';

export default function Pagination(props) {

    const {
        currentPage,
        totalPages,
        selectedFiles,
        range,
        setCurrentPage

    } = props;


    const total = Math.ceil(totalPages / range);
    const maxVisibleButtons = 5;

    const pageNow = Number(currentPage) + 1;

    const startPage = Math.max(1, pageNow - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(total, startPage + maxVisibleButtons - 1);


    const handleFirst = () => setCurrentPage(0);
    const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 0));
    const handleNext = () => setCurrentPage(prev => Math.min(Number(prev) + 1, total - 1));
    const handleLast = () => setCurrentPage(total - 1);
    const handleClick = (page) => setCurrentPage(page - 1);

    return (
        <div>
            <div
                className="pagination"
                id="pagination"
                aria-label="meita-documents-and-media pagination"
                style={{ "display": "flex", "margin-top": 20 }}
            >
                {/* First page */}
                <button
                    onClick={() => handleFirst()}
                    disabled={pageNow === 1}
                    aria-disabled={pageNow === 1}
                    aria-label="First page"
                    style={{ "margin-right": 10, "background-color": "inherit", "border": 0 }}
                >
                    «
                </button>

                {/* Previous page */}
                <button
                    onClick={() => handlePrevious()}
                    disabled={pageNow === 1}
                    aria-disabled={pageNow === 1}
                    aria-label="Previous page"
                    style={{ "margin-right": 10, "background-color": "inherit", "border": 0 }}
                >
                    {__('Previous', 'meita-documents-and-media')}
                </button>

                {/* Number buttons */}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const page = startPage + i;

                    return (
                        <button
                            key={page}
                            onClick={() => handleClick(page)}
                            className={pageNow === page ? 'active' : ''}
                            aria-current={pageNow === page ? 'page' : undefined}
                            aria-label={sprintf(__('Page %d', 'meita-documents-and-media'), Number(page))}
                            style={{ "margin-left": 5 }}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next page */}
                <button
                    onClick={() => handleNext()}
                    disabled={pageNow === total}
                    aria-disabled={pageNow === total}
                    aria-label="Next page"
                    style={{ "margin-left": 10, "background-color": "inherit", "border": 0 }}
                >
                    {__('Next', 'meita-documents-and-media')}
                </button>

                {/* Last page */}
                <button
                    onClick={() => handleLast()}
                    disabled={pageNow === total}
                    aria-disabled={pageNow === total}
                    aria-label="Last page"
                    style={{ "margin-left": 10, "background-color": "inherit", "border": 0 }}
                >
                    »
                </button>
            </div>

            {/* Page X of Y */}
            <div
                style={{ "padding": 10 }}>
                <span>
                    {sprintf(
                        __('Page %d of %d', 'meita-documents-and-media'),
                        Number(pageNow),
                        Number(total)
                    )}
                </span>
            </div>
        </div>
    )
}