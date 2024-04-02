import { PaginationProps } from "../model/PaginationProps";

export const PaginationComponent: React.FC<PaginationProps> = ({currentPage,start,end,totalData,prevPage,nextPage,handlePrevPage,handleNextPage,}) => {
    return (
        <div className='pagination'>
            <div>Page : <b>{currentPage}</b></div>
            <div>
                {start}-{end > totalData ? totalData : end} <b>of</b> {totalData}
            </div>
            <div className='pagination__button'>
                {prevPage != null? <button onClick={handlePrevPage()}>&lt;</button>:<></>}
                {nextPage != null? <button onClick={handleNextPage()}>&gt;</button>:<></>}
            </div>
        </div>
    );
};