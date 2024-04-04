import { TableItemStrategy } from "../abstract/TableItemStrategy";

export interface TableProps {
    colums:string[],
    rows:any[],
    template: TableItemStrategy
}