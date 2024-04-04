export interface PaginationProps {
    currentPage: number;
    start: number;
    end: number;
    totalData: number;
    prevPage:number|null;
    nextPage:number|null;
    handlePrevPage: Function;
    handleNextPage: Function;
}