import '../home.css'
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { CutiModel } from '../model/CutiModel';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { PaginationComponent } from '../component/PaginationComponent';

const Welcoming = lazy(() => import('../component/Welcoming'));
const TableComponent = lazy(() => import('../component/TableComponent'));
const ModalTambahCuti = lazy(() => import('../component/ModalTambahCuti'));
const ModalUbahCuti = lazy(() => import('../component/ModalUbahCuti'));

function Cuti() {
    const boxRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current, {
        modifiers: [{ name: 'offset', options: { offset: [10, 0] } }],
    });

    const [totalData, setTotalData] = useState(0);
    const [totalPage, setTotalPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [listData, setListData] = useState<CutiModel[]>([]);

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
                            const list = json.list.data.map((item:any) => 
                                new CutiModel(item.tanggal_pengajuan, item.lama_cuti, item.jenis_cuti, item.tujuan, "Pending", item.id, false)
                            );

                            setTotalData(json.list.totalData) 
                            setTotalPage(json.list.totalPage)
                            setCurrentPage(json.list.currentPage)
                            setListData(list);
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

    const toggleDialog = (index: number) => {
        console.log(boxRef.current, tooltipRef.current, index)
        setListData(prevListData => prevListData.map((data, i) => ({
            ...data,
            openDetail: i === index
        })));
    };

    const handleOutsideClick = (event: any) => {
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
        loadTable(currentPage)

        return () => {};
    }, [currentPage]);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleOutsideClick]);

    
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
                            listData={listData}
                            toggleDialog={()=>toggleDialog}
                            boxRef={boxRef}
                            tooltipRef={tooltipRef}
                            styles={styles}
                            attributes={attributes}
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
                    id={""}
                    tanggal_pengajuan={""}
                    jenis_cuti={""}
                    lama_cuti={0}
                    tujuan={""}
                />
            </div>
            <ToastContainer />
        </Suspense>
    );
}

export default Cuti;