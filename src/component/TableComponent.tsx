import { TableProps } from '../model/TableProps';
import Card from './Card';

const TableComponent: React.FC<TableProps> = ({ colums, listData, toggleDialog, boxRef, tooltipRef, styles, attributes }) => {
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
                {listData.map((data, index) => {
                    return <Card
                        key={data.id}
                        data={data}
                        toggleDialog={() => toggleDialog(index)}
                        boxRef={boxRef}
                        tooltipRef={tooltipRef}
                        styleDialog={{ display: data.openDetail ? 'block' : 'none', ...styles.popper }}
                        attributes={attributes}
                    />
                })}
            </tbody>
        </table>
    );
};

export default TableComponent;
