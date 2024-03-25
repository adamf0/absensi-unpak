export interface PaginationProps {
    currentPage: number;
    totalPage: number;
    start: number;
    end: number;
    totalData: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
}