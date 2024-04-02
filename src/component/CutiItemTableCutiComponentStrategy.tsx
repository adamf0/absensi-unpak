import '../style.css'
import moment from 'moment';
import { deletedCuti, editCuti } from '../redux/cutiSlice';
import { useAppDispatch } from '../redux/hooks';
import { TableItemStrategy } from '../abstract/TableItemStrategy';
// import "moment/locale/id";

class CutiItemTableCutiComponentStrategy implements TableItemStrategy {
    render(data: any, index:number): JSX.Element {
        const dispatch = useAppDispatch();
        let classLabelJenisCuti = data.jenis?.nama.replace(/\s/g, "_")
        if(classLabelJenisCuti.includes("menunaikan_ibadah")){
            classLabelJenisCuti = "menunaikan_ibadah"
        } else if(classLabelJenisCuti.includes("alasan_penting")){
            classLabelJenisCuti = "alasan_penting"
        }

        return (
        <tr key={index}>
            <td data-name="Tanggal">{moment(data.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</td>
            <td data-name="Lama Cuti">{data.lama} hari</td>
            <td data-name="Jenis Cuti">
                <span className={`custom-badge ${classLabelJenisCuti}`}>{data.jenis?.nama??"-"}</span>
            </td>
            <td data-name="Tujuan">{data.tujuan}</td>
            <td data-name="Status">
                <span className="custom-badge pending">{data.status}</span>
            </td>
            <td data-name="Aksi">
                <div className="action-desktop">
                    <button onClick={ ()=>dispatch(editCuti(data)) } data-bs-toggle="modal" data-bs-target="#modalEdit" data-id={data.id} className="btn button blueDark buttonSmall w-full">Edit</button>
                    <button onClick={ ()=>dispatch(deletedCuti(data)) } data-id={data.id} className="btn button blue buttonSmall w-full">Hapus</button>
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
export default CutiItemTableCutiComponentStrategy;