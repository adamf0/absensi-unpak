import { FC } from 'react';
import '../home.css'
import CardProps from '../model/CardProps';
import { GetJenisCuti } from '../model/JenisCutiEnum';
import moment from 'moment';
import { edit } from '../redux/cutiSlice';
import { useAppDispatch } from '../redux/hooks';
// import "moment/locale/id";

const Card: FC<CardProps> = ({ data, toggleDialog, boxRef, tooltipRef, styleDialog, attributes }): JSX.Element => {
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
                <button onClick={
                    ()=>dispatch(edit(data))
                } data-bs-toggle="modal" data-bs-target="#modalEdit" data-id={data.id} className="btn blueDark btnSmall w-full">Edit</button>
                <button data-id={data.id} className="btn blue btnSmall w-full">Hapus</button>
            </div>
            {/*<div className="action-mobile">
                <span onClick={()=>toggleDialog(parseInt(data.id))} ref={boxRef} className="text-decoration-none" data-id={data.id}>...</span>
                <ul className="tooltip1" ref={tooltipRef} style={styleDialog} {...attributes}>
                    <li>
                        <a href="#" id="btnModalEdit" data-bs-toggle="modal" data-bs-target="#modalEdit">Edit</a>
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

export default Card;