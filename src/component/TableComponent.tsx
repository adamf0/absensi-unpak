import { useEffect, useReducer, useRef } from 'react';
import { TableProps } from '../model/TableProps';
import Card from './Card';
import { usePopper } from 'react-popper';
import { reducerCuti } from '../reducer/CutiReducer';

const TableComponent: React.FC<TableProps> = ({ colums, record }) => {
    const [list, dispatch] = useReducer(reducerCuti, record);
    const boxRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current, {
        modifiers: [{ name: 'offset', options: { offset: [10, 0] } }],
    });

    const toggleDialog = (id: number) => {
        dispatch({type:'TOGGLE_DETAIL', id})
    };

    const handleOutsideClick = (event: any) => {
        if (
            boxRef.current &&
            tooltipRef.current &&
            !boxRef.current.contains(event.target) &&
            !tooltipRef.current.contains(event.target)
        ) {
            dispatch({type:'CLOSE_DETAIL'})
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleOutsideClick]);

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
                {list.map((data, index) => {
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
