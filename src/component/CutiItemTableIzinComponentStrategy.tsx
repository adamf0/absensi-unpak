import '../style.css'
import moment from 'moment';
import { useAppDispatch } from '../redux/hooks';
import { TableItemStrategy } from '../abstract/TableItemStrategy';
import { editIzin, deletedIzin } from '../redux/izinSlice';
// import "moment/locale/id";

class CutiItemTableIzinComponentStrategy implements TableItemStrategy {
    render(data: any, index: number): JSX.Element {
        const dispatch = useAppDispatch();
        return (
        <tr key={index}>
            <td data-name="Tanggal">{moment(data.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</td>
            <td data-name="Tujuan">{data.tujuan}</td>
            <td data-name="Status">
                <span className="custom-badge pending">{data.status}</span>
            </td>
            <td data-name="Aksi">
                <div className="action-desktop">
                    <button onClick={ ()=>dispatch(editIzin(data)) } data-bs-toggle="modal" data-bs-target="#modalEdit" data-id={data.id} className="btn button blueDark buttonSmall w-full">Edit</button>
                    <button onClick={ ()=>dispatch(deletedIzin(data)) } data-id={data.id} className="btn button blue buttonSmall w-full">Hapus</button>
                </div>
                {/*<div className="action-mobile">
                    <span onClick={()=>toggleDialog(parseInt(data.id))} ref={boxRef} className="text-decoration-none" data-id={data.id}>...</span>
                    <ul className="tooltip1" ref={tooltipRef} style={styleDialog} {...attributes}>
                        <li>
                            <a href="#" id="buttonModalEdit" data-bs-toggle="modal" data-bs-target="#modalEdit">Edit</a>
                        </li>
                        <li>
                            <a href="#">Hapus</a>
                        </li>
                    </ul>
                </div> */}
            </td>
        </tr>
        );
    }
}
export default CutiItemTableIzinComponentStrategy;