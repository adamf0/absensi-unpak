import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/layouts/Breadcrumb/Breadcrumb";
import Container from "../../components/layouts/Container/Container";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "../../components/layouts/Subheader/Subheader";
import Button from "../../components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "../../components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "../../components/ui/Table";
import { useEffect } from "react";
import { AlertObserver } from "../IO/AlertObserver";
import { ConsoleObserver } from "../IO/ConsoleObserver";
import PagingTable from "../model/PagingTable";
import { loadList, next, pagingTable, prev } from "../redux/jenisCutiSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { HandlerObserver } from "../abstract/HandlerObserver";
import { jeniscutiselector } from "../redux/jenisCutiSlice";
import { DeleteJenisCuti } from "../repo/DeleteJenisCuti";
import { GetListJenisCuti } from "../repo/GetListJenisCuti";
import { JenisCutiModel } from "../model/JenisCutiModel";
import Badge from "../../components/ui/Badge";

const JenisCutiPage = () => {
    const navigate = useNavigate();

    const selectorJenisCuti = useAppSelector(jeniscutiselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        const response: any = await GetListJenisCuti(page);
        if (response.status !== 200) {
            throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

            if (status == 200) {
                const jeniscutiList = list.data.map((item: any) =>
                    new JenisCutiModel(
                        item.id,
                        item.nama,
                        item.min,
                        item.max,
                        item.dokumen==1,
                        ["", "{}", null].includes(item.kondisi)? null:item.kondisi,
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

                await dispatch(loadList(jeniscutiList));
                await dispatch(pagingTable(paging));
            } else if (status == 500) {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };

    async function deleteJenisCuti(id:any){
        try {
            const response:any = await DeleteJenisCuti(id);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message } = response;

                if (status == 200){
                    alert(message);
                    loadTable(1)
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
        loadTable(selectorJenisCuti.paging.currentPage)

        return () => { };
    }, [selectorJenisCuti.paging.currentPage]);

    useEffect(() => {
        if (selectorJenisCuti.deletedJenisCuti?.id != null) {
            deleteJenisCuti(selectorJenisCuti.deletedJenisCuti?.id)
        }

        return () => { };
    }, [selectorJenisCuti.deletedJenisCuti]);

    return (
        <>
            <PageWrapper name='Jenis Cuti'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Jenis Cuti' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardHeader>
                        <CardHeaderChild>
                            <Button variant='solid' onClick={()=>navigate('/jenis_cuti/tambah')}>
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
                                    <Th>Minimal Cuti</Th>
                                    <Th>Maksimal Cuti</Th>
                                    <Th>Kondisi</Th>
                                    <Th>Dokumen</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorJenisCuti.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorJenisCuti.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{item.nama}</Td>
                                        <Td>{item.min} hari</Td>
                                        <Td>{item.max} hari</Td>
                                        <Td>{item.kondisi==null? "tidak ada kondisi khusus":JSON.stringify(item.kondisi)}</Td>
                                        <Td>
                                            <div className='flex items-center gap-2'>
                                                <Badge variant='outline' color={item.dokumen? "blue":"red"} className='border-transparent'>
                                                    {item.dokumen? "Wajib Upload":"Tidak Wajib"}
                                                </Badge>
                                            </div>
                                        </Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/jenis_cuti/edit/${item.id}`)}>
                                                    edit
                                                </Button>
                                                <Button variant='solid' className="grow" color="red" onClick={()=>deleteJenisCuti(item.id)}>
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
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorJenisCuti.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorJenisCuti.paging.currentPage}</b > of < b > {selectorJenisCuti.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorJenisCuti.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default JenisCutiPage;