import '../home.css'
import agendaIcon from '../assets/agenda-icon.png'
import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

function Home(){
    const boxRef = useRef();
    const tooltipRef = useRef();
    const {styles, attributes} = usePopper(boxRef.current, tooltipRef.current, {
        modifiers: [{ name: 'offset', options: { offset: [10, 0] } }],
    });
    const [dialog, setDialog] = useState(false);
    const [styleDialog, setStyleDialog] = useState({});
    
    useEffect(() => {
        setStyleDialog({display: dialog ? 'block' : 'none', ...styles.popper});
        console.log("Nilai dialog berubah:", styleDialog);
    }, [dialog,]);

    const toggleDialog = () =>{
        setDialog(!dialog);
    }
    return (
        <div className="wrapper">
            <section className="welcoming">
                <div className="container row-container spaceAroundRow">
                    <div className="container__content containerYaxis">
                        <h1>Tetap fokus dan teratur dengan aplikasi ABSEN.</h1>
                        <h2>Buat catatan absensi pribadi maupun cuti dengan aplikasi ABSEN.</h2>
                        <div className="shortMenu">
                            <button className="btn blueDark">Logout</button>
                            <button className="btn blue">Absensi</button>
                            <button className="btn blue">Cuti</button>
                        </div>
                    </div>
                    <div className="container__content row-container">
                        <img src={agendaIcon} alt="icon"/>
                    </div>
                </div>
            </section>

            <section className="absent card">
                <div className="absent__content row-container spaceBetweenRow">
                    <h3>Absensi</h3>
                    <button className="btn btnSmall blueDark">Absen</button>
                </div>
                <div className="absent__content row-container spaceAroundRow">
                    <div className="calendar">
                        <div className="calendar-header row-container spaceAroundRow">
                            <a href="#" className="">back</a>
                            <span className="">Desember</span>
                            <a href="#" className="">next</a>
                        </div>
                        <div className="calendar-sub-header grid">
                            <span>min</span>
                            <span>sen</span>
                            <span>sel</span>
                            <span>rab</span>
                            <span>kam</span>
                            <span>jum</span>
                            <span>sab</span>
                        </div>
                        <ol className="calendar-content grid">
                            <li className='disabled'>1</li>
                            <li className='active'>2</li>
                            <li className='active'>3</li>
                            <li className='active'>4</li>
                            <li className='active'>5</li>
                            <li className='active'>6</li>
                            <li className='active'>7</li>

                            <li className='active cuti'>8</li>
                            <li className='active masuk'>9</li>
                            <li className='active tidak_masuk'>10</li>
                            <li className='active'>11</li>
                            <li className='now'>12</li>
                            <li className='active'>13</li>
                            <li className='active'>14</li>

                            <li className='active'>15</li>
                            <li className='active'>16</li>
                            <li className='active'>17</li>
                            <li className='active'>18</li>
                            <li className='active'>19</li>
                            <li className='active'>20</li>
                            <li className='active'>21</li>

                            <li className='active'>22</li>
                            <li className='active'>23</li>
                            <li className='active'>24</li>
                            <li className='active'>25</li>
                            <li className='active'>26</li>
                            <li className='active'>27</li>
                            <li className='active'>28</li>

                            <li className='active'>29</li>
                            <li className='active'>30</li>
                            <li className='active'>31</li>
                        </ol>
                    </div>
                    <div className="calendar-event">
                        <div className="event-item">
                            <label className="event-status cuti">Cuti sakit</label>
                            <p className="event-tujuan">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, illum!</p>
                        </div>
                        <div className="event-item notFound">
                            Tidak ada cuti
                        </div>
                    </div>
                </div>
            </section>

            <section className="leave card">
                <div className="leave__content row-container spaceBetweenRow">
                    <h3>Cuti</h3>
                    <button id="btnModal" className="btn btnSmall blueDark" data-bs-toggle="modal" data-bs-target="#modalTambah">Tambah</button>
                </div>
                <div className="leave__content row-container spaceAroundRow">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Lama Cuti</th>
                                <th>Jenis</th>
                                <th>Tujuan</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-name="Tanggal">Kamis, 14 maret 2024</td>
                                <td data-name="Lama Cuti">2 hari</td>
                                <td data-name="Jenis Cuti">
                                    <span className="custom-badge pending">Sakit</span>
                                </td>
                                <td data-name="Tujuan">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?</td>
                                <td data-name="Status">
                                    <span className="custom-badge pending">Pending</span>
                                </td>
                                <td data-name="Aksi">
                                    <div className="action-desktop">
                                        <button data-id="1" className="btn blueDark btnSmall w-full">Edit</button>
                                        <button data-id="1" className="btn blue btnSmall w-full">Hapus</button>
                                    </div>
                                    <div className="action-mobile">
                                        <span onClick={toggleDialog} ref={boxRef} className="text-decoration-none" data-element=".tooltip1">...</span>
                                        <ul className="tooltip1" ref={tooltipRef} style={styleDialog}>
                                            <li>
                                                <a href="#">Edit</a>
                                            </li>
                                            <li>
                                                <a href="#">Hapus</a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            
                            {/* <tr>
                                <td data-name="Tanggal">Kamis, 15 maret 2024</td>
                                <td data-name="Lama Cuti">2 hari</td>
                                <td data-name="Jenis Cuti">
                                    <span className="custom-badge pending">Sakit</span>
                                </td>
                                <td data-name="Tujuan" >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, repellendus.</td>
                                <td data-name="Status">
                                    <span className="custom-badge pending">Pending</span>
                                </td>
                                <td data-name="Aksi">
                                    <div className="action-desktop">
                                        <button data-id="1" className="btn blueDark btnSmall w-full">Edit</button>
                                        <button data-id="1" className="btn blue btnSmall w-full">Hapus</button>
                                    </div>
                                    <div className="action-mobile">
                                        <a href="#" onClick={openDetailCard} className="text-decoration-none" data-element=".tooltip2">...</a>
                                        <ul className="tooltip2" style={{display: 'none'}}>
                                            <li>
                                                <a href="#">Edit</a>
                                            </li>
                                            <li>
                                                <a href="#">Hapus</a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td data-name="Tanggal">Kamis, 14 maret 2024</td>
                                <td data-name="Lama Cuti">2 hari</td>
                                <td data-name="Jenis Cuti">
                                    <span className="custom-badge pending">Sakit</span>
                                </td>
                                <td data-name="Tujuan" >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?</td>
                                <td data-name="Status">
                                    <span className="custom-badge pending">Pending</span>
                                </td>
                                <td data-name="Aksi">
                                    <div className="action-desktop">
                                        <button data-id="1" className="btn blueDark btnSmall w-full">Edit</button>
                                        <button data-id="1" className="btn blue btnSmall w-full">Hapus</button>
                                    </div>
                                    <div className="action-mobile">
                                        <a href="#" onClick={openDetailCard} className="text-decoration-none" data-element=".tooltip3">...</a>
                                        <ul className="tooltip3" style={{display: 'none'}}>
                                            <li>
                                                <a href="#">Edit</a>
                                            </li>
                                            <li>
                                                <a href="#">Hapus</a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td data-name="Tanggal">Kamis, 14 maret 2024</td>
                                <td data-name="Lama Cuti">2 hari</td>
                                <td data-name="Jenis Cuti">
                                    <span className="custom-badge pending">Sakit</span>
                                </td>
                                <td data-name="Tujuan" >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?</td>
                                <td data-name="Status">
                                    <span className="custom-badge pending">Pending</span>
                                </td>
                                <td data-name="Aksi">
                                    <div className="action-desktop">
                                        <button data-id="1" className="btn blueDark btnSmall w-full">Edit</button>
                                        <button data-id="1" className="btn blue btnSmall w-full">Hapus</button>
                                    </div>
                                    <div className="action-mobile">
                                        <a href="#" onClick={openDetailCard} className="text-decoration-none" data-element=".tooltip4">...</a>
                                        <ul className="tooltip4" style={{display: 'none'}}>
                                            <li>
                                                <a href="#">Edit</a>
                                            </li>
                                            <li>
                                                <a href="#">Hapus</a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="modal fades show" id="modalTambah" aria-hidden="true" style={{display: 'none'}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" >Tambah Cuti</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <label className="form-label">Tanggal Pengajuan</label>
                                    <input type="text" name="tanggal" className="form-control"/>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Jenis Cuti</label>
                                    <select className="form-control select">
                                        <option value="">--pilih--</option>
                                        <option value="1">tes</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Lama Cuti</label>
                                    <input type="number" name="lama" className="form-control"/>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Tujuan</label>
                                    <textarea name="tujuan" className="form-control"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btnSmall blueDark">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;