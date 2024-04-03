import '../style.css'
import { Suspense, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { PaginationComponent } from '../component/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { izinselector, prev, next, loadList, pagingTable } from '../redux/izinSlice';
import WelcomingComponent from '../component/WelcomingComponent';
import TableComponent from '../component/TableComponent';
import ModalUbahIzin from '../component/ModalUbahIzin';
import ModalTambahIzin from '../component/ModalTambahIzin';
import { GetListIzin } from '../repo/GetListIzin';
import PagingTable from '../model/PagingTable';
import { IzinModel } from '../model/IzinModel';
import { HandlerObserver } from '../abstract/HandlerObserver';
import CutiItemTableIzinComponentStrategy from '../component/CutiItemTableIzinComponentStrategy';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { DeleteIzin } from '../repo/DeleteIzin';

function IzinPage() {
    const selectorIzin = useAppSelector(izinselector);
    const dispatch = useAppDispatch();
    const toastId = useRef<any>(null);

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());
    
    const loadTable = async (page: number) => {
        const response: any = await GetListIzin(page);
        if (response.status !== 200) {
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

            if (status == 200) {
                const izinList = list.data.map((item: any) =>
                    new IzinModel(item.tanggal_pengajuan, item.tujuan, "Pending", item.id, false)
                );

                const paging: PagingTable = {
                    totalData: list.totalData,
                    totalPage: list.totalPage,
                    currentPage: list.currentPage,
                    start: list.startIndex || 1,
                    end: list.endIndex,
                    prevPage: list.prevPage,
                    nextPage: list.nextPage,
                };

                await dispatch(loadList(izinList));
                await dispatch(pagingTable(paging));
            } else if (status == 500) {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };
    async function deleteIzin(id:any){
        try {
            toastId.current = toast("Loading...", { autoClose: false });
            
            const response:any = await DeleteIzin(id);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message } = response;

                if (status == 200){
                    toast.update(toastId.current, { render:message, type: "success", autoClose: 5000 });
                    loadTable(1)
                } else if (status == 500) {
                    toast.update(toastId.current, { render:message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
                } else {
                    toast.update(toastId.current, { render:message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
                }
            } else {
                toast.update(toastId.current, { render:"terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
            }
        } catch (error:any) {
            toast.update(toastId.current, { render:error.message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
            throw error;
        } finally {
            
        }
    }

    useEffect(() => {
        loadTable(selectorIzin.paging.currentPage)

        return () => { };
    }, [selectorIzin.paging.currentPage]);

    useEffect(() => {
        if(selectorIzin.deletedIzin?.id!=null){
            deleteIzin(selectorIzin.deletedIzin?.id)
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