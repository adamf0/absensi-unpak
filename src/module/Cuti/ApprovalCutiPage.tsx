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
import { ApprovalCuti } from "@/module/repo/ApprovalCuti";
import { Approval } from "@/module/model/Approval";
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from "@/components/ui/Modal";
import Textarea from "@/components/form/Textarea";
import { toast } from "react-toastify";

const ApprovalCutiPage = () => {
    const [modalTolak, setModalTolak] = useState<boolean>(false);
    const [approval, setApproval] = useState<Approval|null>(null);
    const [search, setSearch] = useState<any>(null);
    const navigate = useNavigate();

    const selectorCuti = useAppSelector(cutiselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number, search:any = null) => {
        const response: any = await GetListCuti(page, null, null, search);
        // if (response.status !== 200) {
        //     throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        // }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

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
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };

    async function sendApproval(){
        try {
            const response:any = await ApprovalCuti({
                "id":approval?.id,
                "type":approval?.type,
                "note":approval?.note,
            });
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message,log } = response;

                if (status == 200){
                    alert(message);
                    loadTable(selectorCuti.paging.currentPage)
                    setModalTolak(false)
                    setApproval(null)
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
        if(approval?.execute){
            sendApproval()
        } else if(approval?.execute==false){
            setModalTolak(true)
        }
        return () => { };
    }, [approval]);

    return (
        <>
            <PageWrapper name='ApprovalCuti'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='ApprovalCuti' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardBody className='overflow-auto'>
                        <Table className='table-fixed max-md:min-w-[70rem]'>
                            <THead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>NIDN</Th>
                                    <Th>NIP</Th>
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
                                        <Td>{item.nidn}</Td>
                                        <Td>{item.nip}</Td>
                                        <Td>{ moment(item.tanggal_mulai).locale('id-ID').format("dddd, DD MMMM YYYY") } - { moment(item.tanggal_akhir).locale('id-ID').format("dddd, DD MMMM YYYY") }</Td>
                                        <Td>{item.lama} hari</Td>
                                        <Td>{item.jenis?.nama??"-"}</Td>
                                        <Td>{item.tujuan}</Td>
                                        <Td><a href={item?.dokumen??""} target="_blank" className="inline-flex items-center justify-center bg-transparent border-2 border-blue-500/50 text-black dark:text-white hover:border-blue-500 active:border-blue-500 px-5 py-1.5 text-base rounded-lg transition-all duration-300 ease-in-out grow">Buka</a></Td>
                                        <Td>{item.status}</Td>
                                        <Td>
                                            {
                                                item.status==""||item.status=="menunggu"? 
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant='solid' className="grow" color="blue" onClick={()=>setApproval(new Approval(true,item.id,"terima"))}>
                                                        Terima
                                                    </Button>
                                                    <Button variant='solid' className="grow" color="red" onClick={()=>setApproval(new Approval(false,item.id,"tolak"))}>
                                                        Tolak
                                                    </Button>
                                                </div>:""
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
                        <Modal isStaticBackdrop={true} isOpen={modalTolak} setIsOpen={setModalTolak}>
                            <ModalHeader>Alasan Penolakan</ModalHeader>
                            <ModalBody>
                                <Textarea
                                    id='alasan_penolakan_cuti'
                                    name='alasan_penolakan_cuti'
                                    onChange={(e)=>setApproval(prevState=>{
                                        if(prevState!=null){
                                            return new Approval(prevState.execute, prevState?.id, prevState?.type, e.target.value)
                                        }
                                        return prevState
                                    })}
                                    value={approval?.note??""}
                                    placeholder='masukkan alasan penolakan...'
                                    rows={8} />
                            </ModalBody>
                            <ModalFooter>
                                <ModalFooterChild>
                                    <Button color='red' onClick={()=>setModalTolak(false)}>batal</Button>
                                    <Button variant='solid' onClick={()=>{
                                        return setApproval(prevState=>{
                                            if(prevState!=null){
                                                return new Approval(true, prevState?.id, prevState?.type, prevState?.note)
                                            }
                                            return prevState
                                        })
                                    }}>Kirim</Button>
                                </ModalFooterChild>
                            </ModalFooter>
                        </Modal>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default ApprovalCutiPage;