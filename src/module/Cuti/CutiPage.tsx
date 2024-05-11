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
import { CutiModel } from "@/module/model/CutiModel";
import { JenisCutiModel } from "@/module/model/JenisCutiModel";
import PagingTable from "@/module/model/PagingTable";
import { cutiselector, loadList, next, pagingTable, prev } from "@/module/redux/cutiSlice";
import { useAppSelector, useAppDispatch } from "@/module/redux/hooks";
import { DeleteCuti } from "@/module/repo/DeleteCuti";
import { GetListCuti } from "@/module/repo/GetListCuti";
import { HandlerObserver } from "@/module/abstract/HandlerObserver";
import moment from "moment";
import { toast } from "react-toastify";
import useLevelMode from "@/hooks/useLevelMode";
import { TInputTypes } from "@/types/input.type";
import Input from "@/components/form/Input";

const CutiPage = () => {
    const navigate = useNavigate();
    const { levelMode } = useLevelMode();
    const selectorCuti = useAppSelector(cutiselector);
    const [search, setSearch] = useState<any>(null);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number, search: any = null) => {
        try {
            const response: any = await GetListCuti(
                page,
                levelMode == "dosen" ? localStorage.getItem('userRef') : null,
                levelMode == "pegawai" ? localStorage.getItem('userRef') : null,
                search,
            );
            if (response.status === 200 || response.status === 500) {
                const { status, message, list, log } = response;
    
                if (status == 200) {
                    const cutiList = list.data.map((item: any) =>
                        new CutiModel(
                            item.id,
                            item?.nidn,
						    item?.nip,
                            item.tanggal_mulai,
                            item.tanggal_akhir,
                            item.lama_cuti,
                            new JenisCutiModel(
                                item.JenisCuti?.id ?? "",
                                item.JenisCuti?.nama ?? "",
                                item.JenisCuti?.min ?? "",
                                item.JenisCuti?.max ?? "",
                                item.JenisCuti?.dokumen ?? false,
                                item.JenisCuti?.kondisi ?? "",
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
    
                    await dispatch(loadList(cutiList));
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

    async function deleteCuti(id:any){
        try {
            const response:any = await DeleteCuti(id);
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
        loadTable(selectorCuti.paging.currentPage, search)

        return () => { };
    }, [search]);

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
        <>
            <PageWrapper name='Cuti'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Cuti' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <div className="flex flex-wrap justify-between gap-4 px-4 pb-4 [&:first-child]:pt-4">
                        <Button variant='solid' onClick={()=>navigate('/cuti/tambah')}>
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
                                    <Th>Tanggal</Th>
                                    <Th>Lama</Th>
                                    <Th>Jenis Cuti</Th>
                                    <Th>Tujuan</Th>
                                    <Th>Dokumen</Th>
                                    <Th>Status</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorCuti.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorCuti.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{ moment(item.tanggal_mulai).locale('id-ID').format("dddd, DD MMMM YYYY") } - { moment(item.tanggal_akhir).locale('id-ID').format("dddd, DD MMMM YYYY") }</Td>
                                        <Td>{item.lama} hari</Td>
                                        <Td>{item.jenis?.nama??"-"}</Td>
                                        <Td>{item.tujuan}</Td>
                                        <Td><a href={item?.dokumen??""} target="_blank" className="inline-flex items-center justify-center bg-transparent border-2 border-blue-500/50 text-black dark:text-white hover:border-blue-500 active:border-blue-500 px-5 py-1.5 text-base rounded-lg transition-all duration-300 ease-in-out grow">Buka</a></Td>
                                        <Td>{item.status}</Td>
                                        <Td>
                                            {
                                                item.status=="" || item.status=="menunggu"? 
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/cuti/edit/${item.id}`)}>
                                                        edit
                                                    </Button>
                                                    <Button variant='solid' className="grow" color="red" onClick={()=>deleteCuti(item.id)}>
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
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorCuti.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorCuti.paging.currentPage}</b > of < b > {selectorCuti.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorCuti.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default CutiPage;