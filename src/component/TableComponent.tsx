import { TableProps } from '../model/TableProps';

const TableComponent: React.FC<TableProps> = ({ colums,rows,template }) => {
    return (
        <table>
            <thead>
                <tr>
                    {colums.map((colum, index) => (
                        <th key={index}>{colum}</th>    
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => {
                    return template.render(row,index);
                })}
            </tbody>
        </table>
    );
};

export default TableComponent;
