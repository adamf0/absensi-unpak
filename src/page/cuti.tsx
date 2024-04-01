import '../style.css'
import { Dispatch, Suspense, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { PaginationComponent } from '../component/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { cutiselector, fetchListCuti } from '../redux/cutiSlice';
import Welcoming from '../component/Welcoming';
import TableComponent from '../component/TableComponent';
import ModalTambahCuti from '../component/ModalTambahCuti';
import ModalUbahCuti from '../component/ModalUbahCuti';

function Cuti() {
    const selectorCuti = useAppSelector(cutiselector);
    const dispatch = useAppDispatch();
    
    const loadTable = async (dispatch: Dispatch<any>, page: number) => {
        await dispatch(fetchListCuti(page));
    };

    useEffect(() => {
        loadTable(dispatch, selectorCuti.paging.currentPage)

        return () => {};
    }, [selectorCuti.paging.currentPage]);

    useEffect(() => {
        if(selectorCuti.deletedCuti?.id!=null){
            toast.promise(
                new Promise((resolve, reject) => {
                    console.log(selectorCuti.deletedCuti?.id)
                    setTimeout(() => {
                        fetch(`http://localhost:8000/cuti/delete/${selectorCuti.deletedCuti?.id}`, {})
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
    }, [selectorCuti.deletedCuti]);
    
    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="wrapper">
                <Welcoming />

                <section className="leave card">
                    <div className="leave__content row-container spaceBetweenRow">
                        <h3>Cuti</h3>
                        {}
                        <button id="btnModalTambah" className="button buttonSmall blueDark" data-bs-toggle="modal" data-bs-target="#modalTambah">Tambah</button>
                    </div>
                    <div className="leave__content row-container spaceAroundRow">
                        <TableComponent
                            colums={["Tanggal","Lama","Jenis","Tujuan","Status","Aksi",]}
                        />
                        <PaginationComponent/>
                    </div>
                </section>

                <ModalTambahCuti/>
                <ModalUbahCuti 
                    id={selectorCuti.editCuti?.id??''}
                    tanggal_pengajuan={selectorCuti.editCuti?.tanggal??''}
                    jenis_cuti={selectorCuti.editCuti?.jenis??''}
                    lama_cuti={`${selectorCuti.editCuti?.lama??''}`}
                    tujuan={selectorCuti.editCuti?.tujuan??""}
                />
            </div>
            <ToastContainer />
        </Suspense>
    );
}

export default Cuti;