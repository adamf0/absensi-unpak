import '../home.css'
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { CutiModel } from '../model/CutiModel';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Welcoming = lazy(() => import('../component/Welcoming'));
const Card = lazy(() => import('../component/Card'));

const schema = z.object({
    tanggal_pengajuan: z.coerce.date(),
    lama_cuti: z.coerce.number().min(1),
    tujuan: z.string().nonempty("Tujuan is required"),
    jenis_cuti: z.string().nonempty("Jenis Cuti is required")
})

type ValidationSchemaType = z.infer<typeof schema>

function Cuti() {
    const buttonSubmitModalRef = useRef<HTMLButtonElement>(null);
    const buttonCloseModalRef = useRef<HTMLButtonElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current, {
        modifiers: [{ name: 'offset', options: { offset: [10, 0] } }],
    });
    const [listData, setListData] = useState<CutiModel[]>([
        // new CutiModel("Kamis, 14 maret 2024", 2, "Sakit", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?", "Pending", "1", false),
        // new CutiModel("Kamis, 17 maret 2024", 10, "Mudik", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos obcaecati non temporibus dignissimos quasi beatae doloremque corporis fuga consequatur deserunt?", "Pending", "2", false)
    ]);

    const toggleDialog = (index: number) => {
        setListData(prevListData => prevListData.map((data, i) => ({
            ...data,
            openDetail: i === index
        })));
    };

    const handleOutsideClick = (event: any) => {
        if (
            boxRef.current &&
            tooltipRef.current &&
            !boxRef.current.contains(event.target) &&
            !tooltipRef.current.contains(event.target)
        ) {
            setListData(prevListData => prevListData.map(data => ({
                ...data,
                openDetail: false
            })));
        }
    };

    const loadTable = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            // body: JSON.stringify({})
        };

        await fetch(`http://localhost:8000/cuti`, requestOptions)
                    .then(async response => response.json())
                    .then(async json => {
                        console.log(json)
                        if (json.status != 200) {
                            toast.error(json.message ?? "terjadi masalah pada saat request ke server")
                        } else{
                            const newData = json.data.map((item:any) => 
                                new CutiModel(item.tanggal_pengajuan, item.lama_cuti, item.jenis_cuti, item.tujuan, "Pending", item.id, false)
                            );
                            
                            setListData(prevListData => [...prevListData, ...newData]);
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        toast.error(error)
                    })
                    .finally(()=>{

                    })
    }

    useEffect(() => {
        loadTable()

        return () => {};
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleOutsideClick]);

    const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm<ValidationSchemaType>({
        resolver: zodResolver(schema),
    });
    const handleSelectedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue("jenis_cuti", e.target.value);
        // setSelectedDay(e.target.value);
        trigger("jenis_cuti")
    };
    const onSubmit: SubmitHandler<ValidationSchemaType> = async (data) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                tanggal_pengajuan: new Date(data.tanggal_pengajuan).toISOString()?.split('T')[0] ?? "",
                lama_cuti: data.lama_cuti,
                tujuan: data.tujuan,
                jenis_cuti: data.jenis_cuti,
            })
        };

        await toast.promise(
            new Promise((resolve, reject) => {
                console.log(requestOptions)
                if(buttonCloseModalRef.current){
                    buttonCloseModalRef.current.disabled = true;
                }
                if(buttonSubmitModalRef.current){
                    buttonSubmitModalRef.current.disabled = true;
                }

                setTimeout(() => {
                    fetch(`http://localhost:8000/cuti/create`, requestOptions)
                        .then(async response => response.json())
                        .then(async json => {
                            console.log(json)
                            if (json.status != 200) {
                                reject(json.message ?? "terjadi masalah pada saat request ke server")
                            } else {
                                resolve(json.message)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            reject(error)
                        })
                        .finally(()=>{
                            if(buttonCloseModalRef.current){
                                buttonCloseModalRef.current.disabled = false;
                            }
                            if(buttonSubmitModalRef.current){
                                buttonSubmitModalRef.current.disabled = false;
                            }
                        })
                }, 2000)
            }),
            {
                pending: {
                    render() {
                        return "Loading"
                    },
                },
                success: {
                    render({ data }) {
                        return `${data}`
                    },
                },
                error: {
                    render({ data }) {
                        return `${data}`
                    }
                }
            }
        )
    }

    return (
        <Suspense fallback={<></>}>
            <div className="wrapper">
                <Welcoming />

                <section className="leave card">
                    <div className="leave__content row-container spaceBetweenRow">
                        <h3>Cuti</h3>
                        <button id="btnModal" className="btn btnSmall blueDark" data-bs-toggle="modal" data-bs-target="#modalTambah">Tambah</button>
                    </div>
                    <div className="leave__content row-container spaceAroundRow">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Lama Cuti</th>
                                    <th>Jenis</th>
                                    <th>Tujuan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listData.map((data, index) => {
                                        return <Card
                                            key={index}
                                            data={data}
                                            toggleDialog={() => toggleDialog(index)}
                                            boxRef={boxRef}
                                            tooltipRef={tooltipRef}
                                            styleDialog={{ display: data.openDetail ? 'block' : 'none', ...styles.popper }}
                                            attributes={attributes} />;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="modal fades show" id="modalTambah" aria-hidden="true" style={{ display: 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-header">
                                    <h5 className="modal-title" >Tambah Cuti</h5>
                                    <button type="button" ref={buttonCloseModalRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <label className="form-label">Tanggal Pengajuan</label>
                                            <input type="date" className={`form-control${errors.tanggal_pengajuan ? ' is-invalid' : ''}`} {...register('tanggal_pengajuan')} />
                                            {
                                                errors.tanggal_pengajuan &&
                                                (
                                                    <div className="invalid-feedback">
                                                        {errors.tanggal_pengajuan?.message}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Jenis Cuti</label>
                                            <select className={`form-control select${errors.jenis_cuti ? ' is-invalid' : ''}`} onChange={handleSelectedChange}>
                                                <option>--pilih--</option>
                                                <option value="1">tes</option>
                                            </select>
                                            {
                                                errors.jenis_cuti &&
                                                (
                                                    <div className="invalid-feedback">
                                                        {errors.jenis_cuti?.message}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Lama Cuti</label>
                                            <input type="number" className={`form-control${errors.lama_cuti ? ' is-invalid' : ''}`} {...register('lama_cuti', { valueAsNumber: true })} />
                                            {
                                                errors.lama_cuti &&
                                                (
                                                    <div className="invalid-feedback">
                                                        {errors.lama_cuti?.message}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Tujuan</label>
                                            <textarea className={`form-control${errors.tujuan ? ' is-invalid' : ''}`} {...register('tujuan')}></textarea>
                                            {
                                                errors.tujuan &&
                                                (
                                                    <div className="invalid-feedback">
                                                        {errors.tujuan?.message}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type='submit' ref={buttonSubmitModalRef} className="btn btnSmall blueDark">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Suspense>
    );
}

export default Cuti;