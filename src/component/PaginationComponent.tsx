import { end } from "@popperjs/core";
import { PaginationProps } from "../model/PaginationProps";
import { cutiselector, next, prev } from "../redux/cutiSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

export const PaginationComponent: React.FC<PaginationProps> = ({ }) => {
    const selectorCuti = useAppSelector(cutiselector);
    const dispatch = useAppDispatch();
    
    return (
        <div className='pagination'>
            <div>Page : <b>{selectorCuti.paging.currentPage}</b></div>
            <div>
                {selectorCuti.paging.start}-{selectorCuti.paging.end > selectorCuti.paging.totalData ? selectorCuti.paging.totalData : end} <b>of</b> {selectorCuti.paging.totalData}
            </div>
            <div className='pagination__button'>
                {selectorCuti.paging.prevPage != null? <button onClick={()=>dispatch(prev())}>&lt;</button>:<></>}
                {selectorCuti.paging.nextPage != null? <button onClick={()=>dispatch(next())}>&gt;</button>:<></>}
            </div>
        </div>
    );
};