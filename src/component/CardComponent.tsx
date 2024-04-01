import { FC } from 'react';
import '../style.css'
import CardProps from '../model/CardProps';
import { GetJenisCuti } from '../model/JenisCutiEnum';
import moment from 'moment';
import { deletedCuti, editCuti } from '../redux/cutiSlice';
import { useAppDispatch } from '../redux/hooks';
// import "moment/locale/id";

const CardComponent: FC<CardProps> = ({ data }): JSX.Element => {
    const dispatch = useAppDispatch();
    
    return <>
    <tr>
        <td data-name="Tanggal">{moment(data.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</td>
        <td data-name="Lama Cuti">{data.lama} hari</td>
        <td data-name="Jenis Cuti">
            <span className="custom-badge pending">{GetJenisCuti(data.jenis)}</span>
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
    
    </>
    ;
}

export default CardComponent;