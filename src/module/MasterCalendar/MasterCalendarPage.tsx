import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/layouts/Breadcrumb/Breadcrumb";
import Container from "@/components/layouts/Container/Container";
import PageWrapper from "@/components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "@/components/layouts/Subheader/Subheader";
import Button from "@/components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "@/components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "@/components/ui/Table";
import { useEffect, useRef } from "react";
import { AlertObserver } from "@/module/IO/AlertObserver";
import { ConsoleObserver } from "@/module/IO/ConsoleObserver";
import PagingTable from "@/module/model/PagingTable";
import { loadList, next, pagingTable, prev } from "@/module/redux/masterCalendarSlice";
import { useAppSelector, useAppDispatch } from "@/module/redux/hooks";
import { HandlerObserver } from "@/module/abstract/HandlerObserver";
import { jenisizinselector } from "@/module/redux/masterCalendarSlice";
import { DeleteMasterCalendar } from "@/module/repo/DeleteMasterCalendar";
import { GetListMasterCalendar } from "@/module/repo/GetListMasterCalendar";
import { MasterCalendarModel } from "@/module/model/MasterCalendarModel";
import { toast } from "react-toastify";
import moment from "moment";

const MasterCalendarPage = () => {
    const navigate = useNavigate();
    const selectorMasterCalendar = useAppSelector(jenisizinselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        const response: any = await GetListMasterCalendar(page);
        if (response.status !== 200) {
            toast(response.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, log, list } = response;

            if (status == 200) {
                const jenisizinList = list.data.map((item: any) =>
                    new MasterCalendarModel(
                        item.id,
                        item.tanggal_mulai,
                        item.tanggal_akhir,
                        item.keterangan,
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

                await dispatch(loadList(jenisizinList));
                await dispatch(pagingTable(paging));
            } else if (status == 500) {
                toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                console.trace(log)
            } else {
                toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };

    async function deleteMasterCalendar(id:any){
        try {
            const response:any = await DeleteMasterCalendar(id);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message,log } = response;

                if (status == 200){
                    toast(message, { type: "success", autoClose: 2000 });
                    loadTable(1)
                } else if (status == 500) {
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                    console.trace(log)
                } else {
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                }
            } else {
                toast("terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
            }
        } catch (error:any) {
            toast(error.message, { type: "error", autoClose: 2000 });
            console.trace(error.message)
        } finally {

        }
    }

    useEffect(() => {
        loadTable(selectorMasterCalendar.paging.currentPage)

        return () => { };
    }, [selectorMasterCalendar.paging.currentPage]);

    useEffect(() => {
        if (selectorMasterCalendar.deletedMasterCalendar?.id != null) {
            deleteMasterCalendar(selectorMasterCalendar.deletedMasterCalendar?.id)
        }

        return () => { };
    }, [selectorMasterCalendar.deletedMasterCalendar]);

    return (
        <>
            <PageWrapper name='Master Calendar'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Master Calendar' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardHeader>
                        <CardHeaderChild>
                            <Button variant='solid' onClick={()=>navigate('/master_calendar/tambah')}>
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
                                    <Th>Keterangan</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorMasterCalendar.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorMasterCalendar.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{item.tanggal_akhir==null? moment(item.tanggal_mulai).locale('id-ID').format("dddd, DD MMMM YYYY"):`${moment(item.tanggal_mulai).locale('id-ID').format("dddd, DD MMMM YYYY")} - ${moment(item.tanggal_akhir).locale('id-ID').format("dddd, DD MMMM YYYY")}`}</Td>
                                        <Td>{item.keterangan}</Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/master_calendar/edit/${item.id}`)}>
                                                    edit
                                                </Button>
                                                <Button variant='solid' className="grow" color="red" onClick={()=>deleteMasterCalendar(item.id)}>
                                                    hapus
                                                </Button>
                                            </div>
                                        </Td>
                                    </Tr>
                                    )
                                }
                            </TBody>
                        </Table>
                        <div className="flex items-center gap-8">
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorMasterCalendar.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorMasterCalendar.paging.currentPage}</b > of < b > {selectorMasterCalendar.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorMasterCalendar.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default MasterCalendarPage;