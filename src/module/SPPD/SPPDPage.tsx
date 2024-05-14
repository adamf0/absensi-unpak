import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/layouts/Breadcrumb/Breadcrumb";
import Container from "@/components/layouts/Container/Container";
import PageWrapper from "@/components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "@/components/layouts/Subheader/Subheader";
import Button from "@/components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "@/components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "@/components/ui/Table";
import { useEffect, useRef, useState } from "react";
import { AlertObserver } from "@/module/IO/AlertObserver";
import { ConsoleObserver } from "@/module/IO/ConsoleObserver";
import PagingTable from "@/module/model/PagingTable";
import { loadList, next, pagingTable, prev } from "@/module/redux/sppdSlice";
import { useAppSelector, useAppDispatch } from "@/module/redux/hooks";
import { HandlerObserver } from "@/module/abstract/HandlerObserver";
import { sppdselector } from "@/module/redux/sppdSlice";
// import { DeleteSPPD } from "@/module/repo/DeleteSPPD";
import { GetListSPPD } from "@/module/repo/GetListSPPD";
import { SPPDModel } from "@/module/model/SPPDModel";
import { toast } from "react-toastify";
import { JenisSPPDModel } from "../model/JenisSPPDModel";
import moment from "moment";
import useLevelMode from "@/hooks/useLevelMode";

const SPPDPage = () => {
    const { levelMode } = useLevelMode();
    const navigate = useNavigate();
    const selectorSPPD = useAppSelector(sppdselector);
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState<any>(null);

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        const response: any = await GetListSPPD(
            page,
            levelMode == "dosen" ? localStorage.getItem('userRef') : null,
            levelMode == "pegawai" ? localStorage.getItem('userRef') : null,
            search,
        );
        if (response.status !== 200) {
            toast(response.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, log, list } = response;

            if (status == 200) {
                const sppdList = list.data.map((item: any) =>
                    new SPPDModel(
                        item.id,
                        item?.nidn,
                        item?.nip,
                        item?.tujuan,
                        new JenisSPPDModel(
                            item?.jenisSppd?.id,
                            item?.jenisSppd?.nama
                        ),
                        item?.tanggal_berangkat,
                        item?.tanggal_kembali,
                        item?.keterangan
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

                await dispatch(loadList(sppdList));
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

    async function deleteSPPD(id:any){
        // try {
        //     const response:any = await DeleteSPPD(id);
        //     handler1.notifyObservers(response);
        //     if (response.status === 200 || response.status === 500) {
        //         const { status,message,log } = response;

        //         if (status == 200){
        //             toast(message, { type: "success", autoClose: 2000 });
        //             loadTable(1)
        //         } else if (status == 500) {
        //             toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
        //             console.trace(log)
        //         } else {
        //             toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
        //         }
        //     } else {
        //         toast("terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
        //     }
        // } catch (error:any) {
        //     toast(error.message, { type: "error", autoClose: 2000 });
        //     console.trace(error.message)
        // } finally {

        // }
    }

    useEffect(() => {
        loadTable(selectorSPPD.paging.currentPage)

        return () => { };
    }, [selectorSPPD.paging.currentPage]);

    useEffect(() => {
        if (selectorSPPD.deletedSppd?.id != null) {
            deleteSPPD(selectorSPPD.deletedSppd?.id)
        }

        return () => { };
    }, [selectorSPPD.deletedSppd]);

    return (
        <>
            <PageWrapper name='SPPD'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='SPPD' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardHeader>
                        <CardHeaderChild>
                            <Button variant='solid' onClick={()=>navigate('/sppd/tambah')}>
                                Tambah
                            </Button>
                        </CardHeaderChild>
                    </CardHeader>
                    <CardBody className='overflow-auto'>
                        <Table className='table-fixed max-md:min-w-[70rem]'>
                            <THead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>NIDN</Th>
                                    <Th>NIP</Th>
                                    <Th>Jenis SPPD</Th>
                                    <Th>Tujuan</Th>
                                    <Th>Tanggal Berangkat</Th>
                                    <Th>Tanggal Kembali</Th>
                                    <Th>Keterangan</Th>
                                    <Th>Anggota</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorSPPD.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorSPPD.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{item.nidn}</Td>
                                        <Td>{item.nip}</Td>
                                        <Td>{item.jenis_sppd?.nama??"N/a"}</Td>
                                        <Td>{item.tujuan}</Td>
                                        <Td>{moment(item.tanggal_berangkat).tz('Asia/Jakarta').format('LL')}</Td>
                                        <Td>{moment(item.tanggal_kembali).tz('Asia/Jakarta').format('LL')}</Td>
                                        <Td>{item.keterangan}</Td>
                                        <Td> </Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/sppd/edit/${item.id}`)}>
                                                    edit
                                                </Button>
                                                <Button variant='solid' className="grow" color="red" onClick={()=>deleteSPPD(item.id)}>
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
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorSPPD.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorSPPD.paging.currentPage}</b > of < b > {selectorSPPD.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorSPPD.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default SPPDPage;