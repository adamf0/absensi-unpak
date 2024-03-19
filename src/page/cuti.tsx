import '../home.css'
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { CutiModel } from '../model/CutiModel';

const Welcoming = lazy(() => import('../component/Welcoming'));
const Card = lazy(() => import('../component/Card'));

function Cuti() {
    const boxRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current, {
        modifiers: [{ name: 'offset', options: { offset: [10, 0] } }],
    });
    const [listData, setListData] = useState([
        new CutiModel("Kamis, 14 maret 2024", 2, "Sakit", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?", "Pending", "1", false),
        new CutiModel("Kamis, 17 maret 2024", 10, "Mudik", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?", "Pending", "2", false)
    ]);

    const toggleDialog = (index: number) => {
        setListData(prevListData => prevListData.map((data, i) => ({
            ...data,
            openDetail: i === index
        })));
    };

    const handleOutsideClick = (event:any) => {
        if (
            boxRef.current &&
            tooltipRef.current &&
            !boxRef.current.contains(event.target) &&
            !tooltipRef.current.contains(event.target)
        ) {
            setListData(prevListData => prevListData.map(data => ({
                ...data,
                openDetail: false
            })));
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleOutsideClick]);

    return (
        <Suspense fallback={<></>}>
            <div className="wrapper">
                <Welcoming />

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
                                {
                                    listData.map((data, index) => {
                                        return <Card
                                            key={index}
                                            data={data}
                                            toggleDialog={() => toggleDialog(index)}
                                            boxRef={boxRef}
                                            tooltipRef={tooltipRef}
                                            styleDialog={{ display: data.openDetail ? 'block' : 'none', ...styles.popper }}
                                            attributes={attributes} />;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="modal fades show" id="modalTambah" aria-hidden="true" style={{ display: 'none' }}>
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
                                        <input type="text" name="tanggal" className="form-control" />
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
                                        <input type="number" name="lama" className="form-control" />
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
        </Suspense>
    );
}

export default Cuti;