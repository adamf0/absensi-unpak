import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/layouts/Breadcrumb/Breadcrumb";
import Container from "../../components/layouts/Container/Container";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "../../components/layouts/Subheader/Subheader";
import Button from "../../components/ui/Button";
import { CardBody, CardHeader, CardHeaderChild } from "../../components/ui/Card";
import Table, { THead, Tr, Th, TBody, Td } from "../../components/ui/Table";
import { useEffect } from "react";
import { AlertObserver } from "@module/IO/AlertObserver";
import { ConsoleObserver } from "@module/IO/ConsoleObserver";
import { PenggunaModel } from "../model/PenggunaModel";
import PagingTable from "../model/PagingTable";
import { loadList, next, pagingTable, prev } from "../redux/penggunaSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { HandlerObserver } from "../abstract/HandlerObserver";
import { penggunaselector } from "../redux/penggunaSlice";
import { DeletePengguna } from "../repo/DeletePengguna";
import { GetListPengguna } from "../repo/GetListPengguna";

const PenggunaPage = () => {
    const navigate = useNavigate();

    const selectorPengguna = useAppSelector(penggunaselector);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const loadTable = async (page: number) => {
        const response: any = await GetListPengguna(page);
        // if (response.status !== 200) {
        //     throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
        // }

        if (response.status === 200 || response.status === 500) {
            const { status, message, list } = response;

            if (status == 200) {
                const penggunaList = list.data.map((item: any) =>
                    new PenggunaModel(
                        item.id,
                        item.username,
                        item.password,
                        item.nama,
                        item.level,
                        item.nidn,
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

                await dispatch(loadList(penggunaList));
                await dispatch(pagingTable(paging));
            } else if (status == 500) {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            } else {
                console.trace(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    };

    async function deletePengguna(id:any){
        try {
            const response:any = await DeletePengguna(id);
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
        loadTable(selectorPengguna.paging.currentPage)

        return () => { };
    }, [selectorPengguna.paging.currentPage]);

    useEffect(() => {
        if (selectorPengguna.deletedPengguna?.id != null) {
            deletePengguna(selectorPengguna.deletedPengguna?.id)
        }

        return () => { };
    }, [selectorPengguna.deletedPengguna]);

    return (
        <>
            <PageWrapper name='Pengguna'>
                <Subheader>
                    <SubheaderLeft>
                        <Breadcrumb currentPage='Pengguna' />
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <CardHeader>
                        <CardHeaderChild>
                            <Button variant='solid' onClick={()=>navigate('/pengguna/tambah')}>
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
                                    <Th>Username</Th>
                                    <Th>Level</Th>
                                    <Th>NIDN</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    selectorPengguna.list.map((item,index)=>
                                    <Tr className="text-center" key={index}>
                                        <Td>{((selectorPengguna.paging.currentPage-1)*10 + (index+1))}</Td>
                                        <Td>{item.nama}</Td>
                                        <Td>{item.username}</Td>
                                        <Td>{item.level}</Td>
                                        <Td>{item.nidn}</Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant='outline' className="grow"  color="amber" onClick={()=>navigate(`/pengguna/edit/${item.id}`)}>
                                                    edit
                                                </Button>
                                                <Button variant='solid' className="grow" color="red" onClick={()=>deletePengguna(item.id)}>
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
                            <Button color='red' icon='HeroArrowLeft' isDisable={selectorPengguna.paging.prevPage==null} onClick={() => dispatch(prev())}>
                                prev
                            </Button>
                            Page < b > {selectorPengguna.paging.currentPage}</b > of < b > {selectorPengguna.paging.totalPage}</b>
                            <Button color='red' icon='HeroArrowRight' isDisable={selectorPengguna.paging.nextPage==null} onClick={() => dispatch(next())}>
                                next
                            </Button>
                            </div>
                    </CardBody>
                </Container>
            </PageWrapper>
        </>
    );
};

export default PenggunaPage;