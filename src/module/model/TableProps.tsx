import { TableItemStrategy } from "@/module/abstract/TableItemStrategy";

export interface TableProps {
    colums:string[],
    rows:any[],
    template: TableItemStrategy
}