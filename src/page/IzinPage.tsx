import '../style.css'
import { Dispatch, Suspense, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { PaginationComponent } from '../component/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { izinselector, fetchListIzin, prev, next } from '../redux/izinSlice';
import WelcomingComponent from '../component/WelcomingComponent';
import TableComponent from '../component/TableComponent';
import ModalUbahIzin from '../component/ModalUbahIzin';
import ModalTambahIzin from '../component/ModalTambahIzin';
import CutiItemTableIzinComponentStrategy from '../component/CutiItemTableIzinComponentStrategy';

function IzinPage() {
    const selectorIzin = useAppSelector(izinselector);
    const dispatch = useAppDispatch();
    
    const loadTable = async (dispatch: Dispatch<any>, page: number) => {
        await dispatch(fetchListIzin(page));
    };

    useEffect(() => {
        loadTable(dispatch, selectorIzin.paging.currentPage)

        return () => {};
    }, [selectorIzin.paging.currentPage]);

    useEffect(() => {
        if(selectorIzin.deletedIzin?.id!=null){
            toast.promise(
                new Promise((resolve, reject) => {
                    console.log(selectorIzin.deletedIzin?.id)
                    setTimeout(() => {
                        fetch(`${process.env.base_url_api}/izin/delete/${selectorIzin.deletedIzin?.id}`, {})
                            .then(async response => response.json())
                            .then(async json => {
                                console.log(json)
                                if (json.status != 200) {
                                    reject(json.message ?? "terjadi masalah pada saat request ke server")
                                } else {
                                    resolve(json.message)
                                }
                            })
                            .catch(error => {
                                console.log(error)
                                reject(error)
                            })
                            .finally(() => {
                                //masig gagal refresh
                            })
                    }, 2000)
                }),
                {
                    pending: {
                        render() {
                            return "Loading"
                        },
                    },
                    success: {
                        render({ data }) {
                            loadTable(dispatch, 1)
                            return `${data}`
                        },
                    },
                    error: {
                        render({ data }) {
                            return `${data}`
                        }
                    }
                }
            )
        }

        return () => {};
    }, [selectorIzin.deletedIzin]);
    
    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="wrapper">
                <WelcomingComponent />

                <section className="leave card">
                    <div className="leave__content row-container spaceBetweenRow">
                        <h3>Izin</h3>
                        {}
                        <button id="btnModalTambah" className="button buttonSmall blueDark" data-bs-toggle="modal" data-bs-target="#modalTambah">Tambah</button>
                    </div>
                    <div className="leave__content row-container spaceAroundRow">
                        <TableComponent
                            colums={["Tanggal","Tujuan","Status","Aksi",]}
                            rows={selectorIzin.list}
                            template={new CutiItemTableIzinComponentStrategy}
                        />
                        <PaginationComponent 
                        currentPage={selectorIzin.paging.currentPage}
                        start={selectorIzin.paging.start}
                        end={selectorIzin.paging.end}
                        totalData={selectorIzin.paging.totalData}
                        prevPage={selectorIzin.paging.prevPage}
                        nextPage={selectorIzin.paging.nextPage}
                        handlePrevPage={()=>dispatch(prev())}
                        handleNextPage={()=>dispatch(next())}/>
                    </div>
                </section>

                <ModalTambahIzin/>
                <ModalUbahIzin 
                    id={selectorIzin.editIzin?.id??''}
                    tanggal_pengajuan={selectorIzin.editIzin?.tanggal??''}
                    tujuan={selectorIzin.editIzin?.tujuan??""}
                />
            </div>
            <ToastContainer />
        </Suspense>
    );
}

export default IzinPage;