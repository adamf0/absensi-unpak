import '../home.css'
import { Suspense, lazy, useEffect, useState } from 'react';
// import { usePopper } from 'react-popper';
import { CutiModel } from '../model/CutiModel';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { PaginationComponent } from '../component/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { cutiselector, loadList } from '../redux/cutiSlice';

const Welcoming = lazy(() => import('../component/Welcoming'));
const TableComponent = lazy(() => import('../component/TableComponent'));
const ModalTambahCuti = lazy(() => import('../component/ModalTambahCuti'));
const ModalUbahCuti = lazy(() => import('../component/ModalUbahCuti'));

function Cuti() {
    const [totalData, setTotalData] = useState(0);
    const [totalPage, setTotalPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    const selectorCuti = useAppSelector(cutiselector);
    const dispatch = useAppDispatch();
    
    const loadTable = async (page=1) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            // body: JSON.stringify({})
        };

        await fetch(`http://localhost:8000/cuti?page=${page}&pageSize=10`, requestOptions)
                    .then(async response => response.json())
                    .then(async json => {
                        console.log(json)
                        if (json.status != 200) {
                            toast.error(json.message ?? "terjadi masalah pada saat request ke server")
                        } else{
                            let list = json.list.data.map((item:any) => 
                                new CutiModel(item.tanggal_pengajuan, item.lama_cuti, item.jenis_cuti, item.tujuan, "Pending", item.id, false)
                            );

                            setTotalData(json.list.totalData) 
                            setTotalPage(json.list.totalPage)
                            setCurrentPage(json.list.currentPage)

                            dispatch(loadList(list))
                            setStart(json.list.startIndex || 1)
                            setEnd(json.list.endIndex)
                            
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        toast.error(error)
                    })
                    .finally(()=>{

                    })
    }

    useEffect(() => {
        loadTable(currentPage)

        return () => {};
    }, [currentPage]);
    
    const handlePrevPage = () => {
        if (currentPage ?? 0 > 1) {
            setCurrentPage(prevState => prevState-1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(prevState => prevState+1);
        }
    };
    console.log(selectorCuti.edit);
    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="wrapper">
                <Welcoming />

                <section className="leave card">
                    <div className="leave__content row-container spaceBetweenRow">
                        <h3>Cuti</h3>
                        <button id="btnModalTambah" className="btn btnSmall blueDark" data-bs-toggle="modal" data-bs-target="#modalTambah">Tambah</button>
                    </div>
                    <div className="leave__content row-container spaceAroundRow">
                        <TableComponent
                            colums={["Tanggal","Lama","Jenis","Tujuan","Status","Aksi",]}
                            record={selectorCuti.list}
                            // toggleDialog={()=>toggleDialog}
                            // boxRef={boxRef}
                            // tooltipRef={tooltipRef}
                            // styles={styles}
                            // attributes={attributes}
                        />
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPage={totalPage}
                            start={start}
                            end={end}
                            totalData={totalData}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                        />
                    </div>
                </section>

                <ModalTambahCuti/>
                <ModalUbahCuti 
                    id={selectorCuti.edit?.id??''}
                    tanggal_pengajuan={selectorCuti.edit?.tanggal??''}
                    jenis_cuti={selectorCuti.edit?.jenis??''}
                    lama_cuti={`${selectorCuti.edit?.lama??''}`}
                    tujuan={selectorCuti.edit?.tujuan??""}
                />
            </div>
            <ToastContainer />
        </Suspense>
    );
}

export default Cuti;