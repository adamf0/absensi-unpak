import Button from "../../components/ui/Button";
import { PaginationProps } from "../model/PaginationProps";

export const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, start, end, totalData, prevPage, nextPage, handlePrevPage, handleNextPage, }) => {
    return (
        <>
            <Button color='red' icon='HeroArrowLeft' isDisable={prevPage != null} onClick={handlePrevPage()}>
                prev
            </Button>
                        Page < b > {currentPage}</b > of < b > {end}</b>
            <Button color='red' icon='HeroArrowRight' isDisable={nextPage != null} onClick={handleNextPage()}>
                next
            </Button>
        </>
    );
};
//{start}-{end > totalData ? totalData : end} <b>of</b> {totalData}