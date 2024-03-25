import { PaginationProps } from "../model/PaginationProps";

export const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPage, start, end, totalData, handlePrevPage, handleNextPage }) => {
    return (
        <div className='pagination'>
            <div>Page : <b>{currentPage}</b></div>
            <div>
                {start}-{end > totalData ? totalData : end} <b>of</b> {totalData}
            </div>
            <div className='pagination__button'>
                <button onClick={handlePrevPage}>&lt;</button>
                <button onClick={handleNextPage}>&gt;</button>
            </div>
        </div>
    );
};