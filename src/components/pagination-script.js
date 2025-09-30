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

        <div
            className="pagination"
            aria-label="meita-documents-and-media pagination"
        >
            {/* First page */}
            <button
                onClick={() => handleFirst()}
                disabled={pageNow === 1}
                aria-disabled={pageNow === 1}
                aria-label="First page"
                className='first-page'
            >
                «
            </button>

            {/* Previous page */}
            <button
                onClick={() => handlePrevious()}
                disabled={pageNow === 1}
                aria-disabled={pageNow === 1}
                aria-label="Previous page"
                className='prev-page'
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
                        className={pageNow === page ? 'num-button active' : 'num-button'}
                        aria-current={pageNow === page ? 'page' : undefined}
                        aria-label={sprintf(__('Page %d', 'meita-documents-and-media'), Number(page))}
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
                className='next-page'
            >
                {__('Next', 'meita-documents-and-media')}
            </button>

            {/* Last page */}
            <button
                onClick={() => handleLast()}
                disabled={pageNow === total}
                aria-disabled={pageNow === total}
                aria-label="Last page"
                className='last-page'
            >
                »
            </button>


            {/* Page X of Y */}

            <p className='page-of'>
                {sprintf(
                    __('Page %d of %d', 'meita-documents-and-media'),
                    Number(pageNow),
                    Number(total)
                )}
            </p>

        </div>
    )
}