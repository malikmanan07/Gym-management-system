import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ total, limit, activePage, onPageChange }) => {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    let items = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <BSPagination.Item 
                key={number} 
                active={number === activePage}
                onClick={() => onPageChange(number)}
                className="mx-1"
            >
                {number}
            </BSPagination.Item>
        );
    }

    return (
        <div className="d-flex justify-content-center mt-4">
            <BSPagination>{items}</BSPagination>
        </div>
    );
};

export default Pagination;
