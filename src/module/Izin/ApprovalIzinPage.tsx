import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/layouts/Breadcrumb/Breadcrumb";
import Container from "../../components/layouts/Container/Container";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "../../components/layouts/Subheader/Subheader";
import Button from "../../components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "../../components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "../../components/ui/Table";
import { useEffect, useState } from "react";
import { AlertObserver } from "../IO/AlertObserver";
import { ConsoleObserver } from "../IO/ConsoleObserver";
import { IzinModel } from "../model/IzinModel";
import PagingTable from "../model/PagingTable";
import { loadList, next, pagingTable, prev } from "../redux/izinSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { GetListIzin } from "../repo/GetListIzin";
import { HandlerObserver } from "../abstract/HandlerObserver";
import moment from "moment";
import { izinselector } from "../redux/izinSlice";
import { Approval } from "../model/Approval";
import { ApprovalIzin } from "../repo/ApprovalIzin";
import Textarea from "../../components/form/Textarea";
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from "../../components/ui/Modal";
import { JenisIzinModel } from "../model/JenisIzinModel";

const ApprovalIzinPage = () => {
    const [modalTolak, setModalTolak] = useState<boolean>(false);
    const [approval, setApproval] = useState<Approval|null>(null);
    const navigate = useNavigate();

    const selectorIzin = useAppSelector(izinselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        const response: any = await GetListIzin(page);
        // if (response.status !== 200) {
        //     throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        // }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

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
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };

    async function sendApproval(){
        try {
            const response:any = await ApprovalIzin({
                "id":approval?.id,
                "type":approval?.type,
                "note":approval?.note,
            });
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message } = response;

                if (status == 200){
                    alert(message);
                    loadTable(selectorIzin.paging.currentPage)
                    setModalTolak(false)
                    setApproval(null)
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
        loadTable(selectorIzin.paging.currentPage)

        return () => { };
    }, [selectorIzin.paging.currentPage]);

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
                                    <Th>Status</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorIzin.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{item.id}</Td>
                                        <Td>{moment(item.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</Td>
                                        <Td>{item.tujuan}</Td>
                                        <Td>{item.status}</Td>
                                        <Td className="flex flex-wrap gap-2">
                                            {
                                                item.status!="tolak"? 
                                                <>
                                                    <Button variant='solid' className="grow"  color="green" onClick={()=>setApproval(new Approval(true,item.id,"terima"))}>
                                                        Terima
                                                    </Button>
                                                    <Button variant='solid' className="grow" color="red" onClick={()=>setApproval(new Approval(false,item.id,"tolak"))}>
                                                        Tolak
                                                    </Button>
                                                </>:null
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
                        <Modal isStaticBackdrop={true} isOpen={modalTolak} setIsOpen={setModalTolak}>
                            <ModalHeader>Alasan Penolakan</ModalHeader>
                            <ModalBody>
                                <Textarea
                                    id='alasan_penolakan_izin'
                                    name='alasan_penolakan_izin'
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

export default ApprovalIzinPage;