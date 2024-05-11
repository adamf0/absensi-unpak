import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/layouts/Breadcrumb/Breadcrumb";
import Container from "@/components/layouts/Container/Container";
import PageWrapper from "@/components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "@/components/layouts/Subheader/Subheader";
import Button from "@/components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "@/components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "@/components/ui/Table";
import { useEffect, useState } from "react";
import { AlertObserver } from "@/module/IO/AlertObserver";
import { ConsoleObserver } from "@/module/IO/ConsoleObserver";
import { ClaimAbsenModel } from "@/module/model/ClaimAbsenModel";
import { AbsenModel } from "@/module/model/AbsenModel";
import PagingTable from "@/module/model/PagingTable";
import { claimAbsenselector, loadList, next, pagingTable, prev } from "@/module/redux/claimAbsenSlice";
import { useAppSelector, useAppDispatch } from "@/module/redux/hooks";
import { GetListClaimAbsen } from "@/module/repo/GetListClaimAbsen";
import { HandlerObserver } from "@/module/abstract/HandlerObserver";
import moment from "moment";
import { toast } from "react-toastify";
import useLevelMode from "@/hooks/useLevelMode";
import { ApprovalClaimAbsen } from "@/module/repo/ApprovalClaimAbsen";

const ApprovalClaimAbsenPage = () => {
    const navigate = useNavigate();
    const { levelMode } = useLevelMode();
    const selectorClaimAbsen = useAppSelector(claimAbsenselector);
    const [search, setSearch] = useState<any>(null);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number, search:any = null) => {
        try {
            const response: any = await GetListClaimAbsen(page, null, null, search);
            if (response.status === 200 || response.status === 500) {
                const { status, message, list, log } = response;
    
                if (status == 200) {
                    const claimAbsenList = list.data.map((item: any) =>
                        new ClaimAbsenModel(
                            item.id,
                            new AbsenModel(
                                item.Absen?.id ?? "",
                                item.Absen?.nidn,
                                item.Absen?.nip,
                                moment(item.Absen?.tanggal ?? "").locale('id-ID').format("dddd, DD MMMM YYYY"),
                                moment(item.Absen?.absen_masuk ?? "").locale('id-ID').format("HH:mm:ss"),
                                moment(item.Absen?.absen_keluar ?? "").locale('id-ID').format("HH:mm:ss"),
                                item.Absen?.otomatis_keluar ?? false,
                            ),
                            item.catatan,
                            item.perbaikan_absen_masuk,
                            item.perbaikan_absen_keluar,
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
    
                    await dispatch(loadList(claimAbsenList));
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

    async function sendApproval(id:any, type:any){
        try {
            const response:any = await ApprovalClaimAbsen({
                "id":id,
                "type":type
            });
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message } = response;

                if (status == 200){
                    alert(message);
                    loadTable(selectorClaimAbsen.paging.currentPage)
                } else if (status == 500) {
                    alert(message ?? "terjadi masalah pada saat request ke server")
                } else {
                    alert(message ?? "terjadi masalah pada saat request ke server")
                }
            } else {
                alert("terjadi masalah pada saat request ke server")
            }
        } catch (error:any) {
            alert(error.message ?? "terjadi masalah pada saat request ke server")
            throw error;
        } finally {

        }
    }

    useEffect(() => {
        loadTable(selectorClaimAbsen.paging.currentPage, search)

        return () => { };
    }, [search]);

    useEffect(() => {
        loadTable(selectorClaimAbsen.paging.currentPage)

        return () => { };
    }, [selectorClaimAbsen.paging.currentPage]);

    return (
        <>
            <PageWrapper name='Claim Absen'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Claim Absen' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <div className="flex flex-wrap justify-between gap-4 px-4 pb-4 [&:first-child]:pt-4">
                        <Button variant='solid' onClick={()=>navigate('/izin/tambah')}>
                            Tambah
                        </Button>
                        <input type="text" onChange={(e:any)=>setSearch(e.target.value)} 
                            className="max-w-[216px] max-w-[-webkit-fill-available] appearance-none outline-0 text-black 
                            dark:text-white 
                            disabled:!opacity-25 
                            transition-all duration-299 ease-in-out 
                            border-2 border-black 
                            dark:border-zinc-800 bg-zinc-100 
                            dark:bg-zinc-799 
                            hover:border-blue-500 
                            dark:hover:border-blue-500 
                            disabled:!border-zinc-500 
                            focus:border-zinc-300 
                            dark:focus:border-zinc-800 
                            focus:bg-transparent 
                            dark:focus:bg-transparent 
                            px-1.5 py-1.5 text-base rounded-lg"
                            placeholder="Cari..."/>
                    </div>
                    <CardBody className='overflow-auto'>
                        <Table className='table-fixed max-md:min-w-[70rem]'>
                            <THead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>NIDN</Th>
                                    <Th>NIP</Th>
                                    <Th>Tanggal Absen</Th>
                                    <Th>Jam Absen</Th>
                                    <Th>Perbaikan Absen</Th>
                                    <Th>Catatan</Th>
                                    <Th>Dokumen</Th>
                                    <Th>Status</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorClaimAbsen.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorClaimAbsen.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{item.absen.nidn}</Td>
                                        <Td>{item.absen.nip}</Td>
                                        <Td>{moment(item.absen?.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</Td>
                                        <Td>{item.absen.absen_masuk} - {item.absen.absen_keluar}</Td>
                                        <Td>{item.absen.absen_masuk} - {item.absen.absen_keluar}</Td>
                                        <Td>{item.catatan}</Td>
                                        <Td><a href={item?.dokumen??""} target="_blank" className="inline-flex items-center justify-center bg-transparent border-2 border-blue-500/50 text-black dark:text-white hover:border-blue-500 active:border-blue-500 px-5 py-1.5 text-base rounded-lg transition-all duration-300 ease-in-out grow">Buka</a></Td>
                                        <Td>{item.status}</Td>
                                        <Td>
                                            {
                                                item.status=="" || item.status=="menunggu"? 
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant='outline' className="grow"  color="blue" onClick={()=>sendApproval(item.id,"terima")}>
                                                        Terima
                                                    </Button>
                                                    <Button variant='solid' className="grow" color="red" onClick={()=>sendApproval(item.id,"tolak")}>
                                                        Tolak
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
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorClaimAbsen.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorClaimAbsen.paging.currentPage}</b > of < b > {selectorClaimAbsen.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorClaimAbsen.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default ApprovalClaimAbsenPage;