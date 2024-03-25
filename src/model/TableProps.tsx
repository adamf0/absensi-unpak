import { CutiModel } from "./CutiModel";

export interface TableProps {
    colums:string[],
    listData: CutiModel[];
    toggleDialog: (index: number) => void;
    boxRef: React.RefObject<HTMLDivElement>;
    tooltipRef: React.RefObject<HTMLDivElement>;
    styles: any; // Ganti any dengan tipe sesuai dengan kebutuhan Anda
    attributes: any; // Ganti any dengan tipe sesuai dengan kebutuhan Anda
}