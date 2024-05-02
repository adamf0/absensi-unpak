import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/layouts/Breadcrumb/Breadcrumb";
import Container from "@/components/layouts/Container/Container";
import PageWrapper from "@/components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "@/components/layouts/Subheader/Subheader";
import Button from "@/components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "@/components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "@/components/ui/Table";
import { useEffect } from "react";
import { AlertObserver } from "@/module/IO/AlertObserver";
import { ConsoleObserver } from "@/module/IO/ConsoleObserver";
import { IzinModel } from "@/module/model/IzinModel";
import PagingTable from "@/module/model/PagingTable";
import { loadList, next, pagingTable, prev } from "@/module/redux/izinSlice";
import { useAppSelector, useAppDispatch } from "@/module/redux/hooks";
import { DeleteIzin } from "@/module/repo/DeleteIzin";
import { GetListIzin } from "@/module/repo/GetListIzin";
import { HandlerObserver } from "@/module/abstract/HandlerObserver";
import moment from "moment";
import { izinselector } from "@/module/redux/izinSlice";
import { JenisIzinModel } from "@/module/model/JenisIzinModel";
import { toast } from "react-toastify";
import useLevelMode from "@/hooks/useLevelMode";

const IzinPage = () => {
    const navigate = useNavigate();
    const { levelMode } = useLevelMode();
    const selectorIzin = useAppSelector(izinselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        try {
            const response: any = await GetListIzin(
                page,
                levelMode == "dosen" ? localStorage.getItem('userRef') : null,
                levelMode == "pegawai" ? localStorage.getItem('userRef') : null,
            );

            if (response.status === 200 || response.status === 500) {
                const { status, message, list, log } = response;

                if (status == 200) {
                    const izinList = list.data.map((item: any) =>
                        new IzinModel(
                            item.id,
                            item.tanggal_pengajuan,
                            new JenisIzinModel(
                                item.JenisIzin?.id ?? "",
                                item.JenisIzin?.nama ?? ""
                            ),
                            item.tujuan,
                            item.dokumen,
                            item.status,
                        )
                    );

                    const paging: PagingTable = {
                        totalData: list.totalData,
                        totalPage: list.totalPage,
                        currentPage: list.currentPage,
                        start: list.startIndex || 1,
                        end: list.endIndex,
                        pageSize: list.pageSize,
                        prevPage: list.prevPage,
                        nextPage: list.nextPage,
                    };

                    await dispatch(loadList(izinList));
                    await dispatch(pagingTable(paging));
                } else if (status == 500) {
                    handler1.notifyObservers(log)
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                } else {
                    handler1.notifyObservers(log)
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                }
            }   
        } catch (error:any) {
            toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
            throw error;
        }
    };

    async function deleteIzin(id:any){
        try {
            const response:any = await DeleteIzin(id);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message,log } = response;

                if (status == 200){
                    toast(message, { type: "success", autoClose: 2000 });
                    loadTable(1)
                } else if (status == 500) {
                    handler1.notifyObservers(log)
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                } else {
                    handler1.notifyObservers(log)
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                }
            }   
        } catch (error:any) {
            toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
            throw error;
        } finally {

        }
    }

    useEffect(() => {
        loadTable(selectorIzin.paging.currentPage)

        return () => { };
    }, [selectorIzin.paging.currentPage]);

    useEffect(() => {
        if (selectorIzin.deletedIzin?.id != null) {
            deleteIzin(selectorIzin.deletedIzin?.id)
        }

        return () => { };
    }, [selectorIzin.deletedIzin]);

    return (
        <>
            <PageWrapper name='Izin'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Izin' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardHeader>
                        <CardHeaderChild>
                            <Button variant='solid' onClick={()=>navigate('/izin/tambah')}>
                                Tambah
                            </Button>
                        </CardHeaderChild>
                    </CardHeader>
                    <CardBody className='overflow-auto'>
                        <Table className='table-fixed max-md:min-w-[70rem]'>
                            <THead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>Tanggal</Th>
                                    <Th>Tujuan</Th>
                                    <Th>Dokumen</Th>
                                    <Th>Status</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorIzin.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorIzin.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{moment(item.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</Td>
                                        <Td>{item.tujuan}</Td>
                                        <Td><a href={item?.dokumen??""} target="_blank" className="inline-flex items-center justify-center bg-transparent border-2 border-blue-500/50 text-black dark:text-white hover:border-blue-500 active:border-blue-500 px-5 py-1.5 text-base rounded-lg transition-all duration-300 ease-in-out grow">Buka</a></Td>
                                        <Td>{item.status}</Td>
                                        <Td>
                                            {
                                                item.status=="" || item.status=="menunggu"? 
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/izin/edit/${item.id}`)}>
                                                        edit
                                                    </Button>
                                                    <Button variant='solid' className="grow" color="red" onClick={()=>deleteIzin(item.id)}>
                                                        hapus
                                                    </Button>
                                                </div>:null
                                            }
                                        </Td>
                                    </Tr>
                                    )
                                }
                            </TBody>
                        </Table>
                        <div className="flex items-center gap-8">
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorIzin.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorIzin.paging.currentPage}</b > of < b > {selectorIzin.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorIzin.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default IzinPage;