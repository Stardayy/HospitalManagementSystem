import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../styles/Pages.css';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>
            <div className="pagination-controls">
                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                        // Show first, last, current, and adjacent pages
                        return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                        );
                    })
                    .map((page, index, array) => {
                        // Add ellipsis if needed
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                            <React.Fragment key={page}>
                                {showEllipsis && <span className="pagination-ellipsis">...</span>}
                                <button
                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        );
                    })}

                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
