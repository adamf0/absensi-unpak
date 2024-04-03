import '../style.css'
import { Suspense, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { PaginationComponent } from '../component/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { cutiselector, loadList, loadListJenisCuti, next, pagingTable, prev } from '../redux/cutiSlice';
import WelcomingComponent from '../component/WelcomingComponent';
import TableComponent from '../component/TableComponent';
import ModalTambahCuti from '../component/ModalTambahCuti';
import ModalUbahCuti from '../component/ModalUbahCuti';
import CutiItemTableCutiComponentStrategy from '../component/CutiItemTableCutiComponentStrategy';
import { CutiModel } from '../model/CutiModel';
import { JenisCuti } from '../model/JenisCuti';
import PagingTable from '../model/PagingTable';
import { GetListCuti } from '../repo/GetListCuti';
import { GetListJenisCuti } from '../repo/GetListJenisCuti';
import { DeleteCuti } from '../repo/DeleteCuti';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';

function CutiPage() {
    const selectorCuti = useAppSelector(cutiselector);
    const dispatch = useAppDispatch();
    const toastId = useRef<any>(null);

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());
    
    const loadTable = async (page: number) => {
        const response: any = await GetListCuti(page);
        if (response.status !== 200) {
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

            if (status == 200) {
                const cutiList = list.data.map((item: any) =>
                    new CutiModel(
                        item.tanggal_pengajuan,
                        item.lama_cuti,
                        new JenisCuti(
                            item.JenisCuti?.id ?? "",
                            item.JenisCuti?.nama ?? "",
                            item.JenisCuti?.min ?? "",
                            item.JenisCuti?.max ?? "",
                            item.JenisCuti?.dokumen ?? false,
                            item.JenisCuti?.kondisi ?? "",
                        ),
                        item.tujuan,
                        "Pending",
                        item.id,
                        false
                    )
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

                await dispatch(loadList(cutiList));
                await dispatch(pagingTable(paging));
            } else if (status == 500) {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };
    const loadJenisCuti = async () => {
        const response: any = await GetListJenisCuti();
        if (response.status !== 200) {
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

            if (status == 200) {
                const listJenisCuti = list.map((item: any) =>
                    new JenisCuti(
                        item.id,
                        item.nama,
                        item.min,
                        item.max,
                        item.dokumen,
                        item.kondisi,
                    )
                )

                await dispatch(loadListJenisCuti(listJenisCuti));
            } else if (status == 500) {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };
    async function deleteCuti(id:any){
        try {
            toastId.current = toast("Loading...", { autoClose: false });
            
            const response:any = await DeleteCuti(id);
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
        loadJenisCuti();
    }, []);

    useEffect(() => {
        loadTable(selectorCuti.paging.currentPage)

        return () => { };
    }, [selectorCuti.paging.currentPage]);

    useEffect(() => {
        if (selectorCuti.deletedCuti?.id != null) {
            deleteCuti(selectorCuti.deletedCuti?.id)
        }

        return () => { };
    }, [selectorCuti.deletedCuti]);

    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="wrapper">
                <WelcomingComponent />

                <section className="leave card">
                    <div className="leave__content row-container spaceBetweenRow">
                        <h3>Cuti</h3>
                        { }
                        <button id="btnModalTambah" className="button buttonSmall blueDark" data-bs-toggle="modal" data-bs-target="#modalTambah">Tambah</button>
                    </div>
                    <div className="leave__content row-container spaceAroundRow">
                        <TableComponent
                            colums={["Tanggal", "Lama", "Jenis", "Tujuan", "Status", "Aksi",]}
                            rows={selectorCuti.list}
                            template={new CutiItemTableCutiComponentStrategy}
                        />
                        <PaginationComponent
                            currentPage={selectorCuti.paging.currentPage}
                            start={selectorCuti.paging.start}
                            end={selectorCuti.paging.end}
                            totalData={selectorCuti.paging.totalData}
                            prevPage={selectorCuti.paging.prevPage}
                            nextPage={selectorCuti.paging.nextPage}
                            handlePrevPage={() => dispatch(prev())}
                            handleNextPage={() => dispatch(next())} />
                    </div>
                </section>

                <ModalTambahCuti />
                <ModalUbahCuti
                    id={selectorCuti.editCuti?.id ?? ''}
                    tanggal_pengajuan={selectorCuti.editCuti?.tanggal ?? ''}
                    jenis_cuti={selectorCuti.editCuti?.jenis.id ?? ''}
                    lama_cuti={`${selectorCuti.editCuti?.lama ?? ''}`}
                    tujuan={selectorCuti.editCuti?.tujuan ?? ""}
                />
            </div>
            <ToastContainer />
        </Suspense>
    );
}

export default CutiPage;