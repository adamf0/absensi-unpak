import moment from 'moment';
import { deletedCuti, editCuti } from '@/module/redux/cutiSlice';
import { useAppDispatch } from '@/module/redux/hooks';
import Button from '@/components/ui/Button';
import { Td, Tr } from '@/components/ui/Table';
// import "moment/locale/id";

class ItemTableCutiComponentStrategy { //implements TableItemStrategy 
    render(data: any, index: number): JSX.Element {
        const dispatch = useAppDispatch();
        return (
            <Tr>
                <Td>1</Td>
                <Td>{moment(data.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")}</Td>
                <Td>{data.lama} hari</Td>
                <Td>{data.jenis?.nama ?? "-"}</Td>
                <Td>{data.tujuan}</Td>
                <Td>-</Td>
                <Td>{data.status}</Td>
                <Td>
                    <Button variant='solid' onClick={() => dispatch(editCuti(data))}>
                        Tambah
                    </Button>
                    <Button variant='solid' onClick={() => dispatch(deletedCuti(data))}>
                        Tambah
                    </Button>
                </Td>
            </Tr>
        );
    }
}
export default ItemTableCutiComponentStrategy;