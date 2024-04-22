import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/layouts/Breadcrumb/Breadcrumb";
import Container from "../../components/layouts/Container/Container";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "../../components/layouts/Subheader/Subheader";
import Button from "../../components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "../../components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "../../components/ui/Table";
import { useEffect, useRef } from "react";
import { AlertObserver } from "@module/IO/IO/AlertObserver";
import { ConsoleObserver } from "../IO/ConsoleObserver";
import PagingTable from "../model/PagingTable";
import { loadList, next, pagingTable, prev } from "../redux/jenisIzinSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { HandlerObserver } from "../abstract/HandlerObserver";
import { jenisizinselector } from "../redux/jenisIzinSlice";
import { DeleteJenisIzin } from "../repo/DeleteJenisIzin";
import { GetListJenisIzin } from "../repo/GetListJenisIzin";
import { JenisIzinModel } from "../model/JenisIzinModel";
import { toast } from "react-toastify";

const JenisIzinPage = () => {
    const navigate = useNavigate();
    const selectorJenisIzin = useAppSelector(jenisizinselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        const response: any = await GetListJenisIzin(page);
        if (response.status !== 200) {
            toast(response.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, log, list } = response;

            if (status == 200) {
                const jenisizinList = list.data.map((item: any) =>
                    new JenisIzinModel(
                        item.id,
                        item.nama,
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

    async function deleteJenisIzin(id:any){
        try {
            const response:any = await DeleteJenisIzin(id);
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
        loadTable(selectorJenisIzin.paging.currentPage)

        return () => { };
    }, [selectorJenisIzin.paging.currentPage]);

    useEffect(() => {
        if (selectorJenisIzin.deletedJenisIzin?.id != null) {
            deleteJenisIzin(selectorJenisIzin.deletedJenisIzin?.id)
        }

        return () => { };
    }, [selectorJenisIzin.deletedJenisIzin]);

    return (
        <>
            <PageWrapper name='Jenis Izin'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Jenis Izin' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardHeader>
                        <CardHeaderChild>
                            <Button variant='solid' onClick={()=>navigate('/jenis_izin/tambah')}>
                                Tambah
                            </Button>
                        </CardHeaderChild>
                    </CardHeader>
                    <CardBody className='overflow-auto'>
                        <Table className='table-fixed max-md:min-w-[70rem]'>
                            <THead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>Nama</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorJenisIzin.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorJenisIzin.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{item.nama}</Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/jenis_izin/edit/${item.id}`)}>
                                                    edit
                                                </Button>
                                                <Button variant='solid' className="grow" color="red" onClick={()=>deleteJenisIzin(item.id)}>
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
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorJenisIzin.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorJenisIzin.paging.currentPage}</b > of < b > {selectorJenisIzin.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorJenisIzin.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default JenisIzinPage;