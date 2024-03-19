import { FC } from 'react';
import '../home.css'
import UserProps from '../model/UserProps';

const Card: FC<UserProps> = ({ data, toggleDialog, boxRef, tooltipRef, styleDialog, attributes }): JSX.Element => {
    return <tr>
        <td data-name="Tanggal">{data.tanggal}</td>
        <td data-name="Lama Cuti">{data.lama} hari</td>
        <td data-name="Jenis Cuti">
            <span className="custom-badge pending">{data.jenis}</span>
        </td>
        <td data-name="Tujuan">{data.tujuan}</td>
        <td data-name="Status">
            <span className="custom-badge pending">{data.status}</span>
        </td>
        <td data-name="Aksi">
            <div className="action-desktop">
                <button data-id={data.id} className="btn blueDark btnSmall w-full">Edit</button>
                <button data-id={data.id} className="btn blue btnSmall w-full">Hapus</button>
            </div>
            <div className="action-mobile">
                <span onClick={toggleDialog} ref={boxRef} className="text-decoration-none">...</span>
                <ul className="tooltip1" ref={tooltipRef} style={styleDialog} {...attributes}>
                    <li>
                        <a href="#">Edit</a>
                    </li>
                    <li>
                        <a href="#">Hapus</a>
                    </li>
                </ul>
            </div>
        </td>
    </tr>;
}

export default Card;