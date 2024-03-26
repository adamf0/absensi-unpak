import React, { ReactElement, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ModalEditCutiProps } from '../model/ModalEditCutiProps';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { z } from 'zod';

function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
            return [key, undefined]
        })
    )
}

const ModalUbahCuti: React.FC<ModalEditCutiProps> = ({id,tanggal_pengajuan,jenis_cuti,lama_cuti,tujuan}) => {
    const [_, setErrId] = useState<ReactElement | null>(null);
    const [errTanggalPengajuan, setErrTanggalPengajuan] = useState<ReactElement | null>(null);
    const [errJenisCuti, setErrJenisCuti] = useState<ReactElement | null>(null);
    const [errLamaCuti, setErrLamaCuti] = useState<ReactElement | null>(null);
    const [errTujuan, setErrTujuan] = useState<ReactElement | null>(null);

    const schemaUpdate = z.object({
        id: z.string(),
        tanggal_pengajuan: z.coerce.date(),
        lama_cuti: z.coerce.number().min(1),
        tujuan: z.string().nonempty("Tujuan is required"),
        jenis_cuti: z.string().nonempty("Jenis Cuti is required")
    })
    schemaUpdate.safeParse({
        id:id,
        tanggal_pengajuan:tanggal_pengajuan,
        lama_cuti:lama_cuti,
        tujuan:tujuan,
        jenis_cuti:jenis_cuti,
    })

    type ValidationSchemaType = z.infer<typeof schemaUpdate>
    const buttonSubmitModalRef = useRef<HTMLButtonElement>(null);
    const buttonCloseModalRef = useRef<HTMLButtonElement>(null);
    const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm<ValidationSchemaType>({
        resolver: zodResolver(schemaUpdate)
    });
    const handleSelectedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue("jenis_cuti", e.target.value);
        // setSelectedDay(e.target.value);
        trigger("jenis_cuti")
    };
    const onSubmitUpdate: SubmitHandler<ValidationSchemaType> = async (data) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                id: data.id,
                tanggal_pengajuan: new Date(data.tanggal_pengajuan).toISOString()?.split('T')[0] ?? "",
                lama_cuti: data.lama_cuti,
                tujuan: data.tujuan,
                jenis_cuti: data.jenis_cuti,
            })
        };
        console.log(requestOptions)
        // await toast.promise(
        //     new Promise((resolve, reject) => {
        //         console.log(requestOptions)
        //         if (buttonCloseModalRef.current) {
        //             buttonCloseModalRef.current.disabled = true;
        //         }
        //         if (buttonSubmitModalRef.current) {
        //             buttonSubmitModalRef.current.disabled = true;
        //         }

        //         setTimeout(() => {
        //             fetch(`http://localhost:8000/cuti/create`, requestOptions)
        //                 .then(async response => response.json())
        //                 .then(async json => {
        //                     console.log(json)
        //                     if (json.status != 200) {
        //                         reject(json.message ?? "terjadi masalah pada saat request ke server")
        //                     } else {
        //                         resolve(json.message)
        //                     }
        //                 })
        //                 .catch(error => {
        //                     console.log(error)
        //                     reject(error)
        //                 })
        //                 .finally(() => {
        //                     if (buttonCloseModalRef.current) {
        //                         buttonCloseModalRef.current.disabled = false;
        //                     }
        //                     if (buttonSubmitModalRef.current) {
        //                         buttonSubmitModalRef.current.disabled = false;
        //                     }
        //                 })
        //         }, 2000)
        //     }),
        //     {
        //         pending: {
        //             render() {
        //                 return "Loading"
        //             },
        //         },
        //         success: {
        //             render({ data }) {
        //                 return `${data}`
        //             },
        //         },
        //         error: {
        //             render({ data }) {
        //                 return `${data}`
        //             }
        //         }
        //     }
        // )
    }

    useEffect(() => {
        // if (errors.id) {
        //     const message = errors.id.message;
        //     setErrId(<div className="invalid-feedback">{message}</div>);
        // } else {
        //     setErrId(null);
        // }

        if (errors.tanggal_pengajuan) {
            const message = errors.tanggal_pengajuan.message;
            setErrTanggalPengajuan(<div className="invalid-feedback">{message}</div>);
        } else {
            setErrTanggalPengajuan(null);
        }

        if (errors.jenis_cuti) {
            const message = errors.jenis_cuti.message;
            setErrJenisCuti(<div className="invalid-feedback">{message}</div>);
        } else {
            setErrJenisCuti(null);
        }

        if (errors.lama_cuti) {
            const message = errors.lama_cuti.message;
            setErrLamaCuti(<div className="invalid-feedback">{message}</div>);
        } else {
            setErrLamaCuti(null);
        }

        if (errors.tujuan) {
            const message = errors.tujuan.message;
            setErrTujuan(<div className="invalid-feedback">{message}</div>);
        } else {
            setErrTujuan(null);
        }
    }, [errors]);

    return ReactDOM.createPortal(
        <div className="modal fades show" id="modalEdit" aria-hidden="true" style={{ display: 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <input type="hidden" defaultValue={id} {...register('id')}/>

                        <div className="modal-header">
                            <h5 className="modal-title" >Ubah Cuti</h5>
                            <button type="button" ref={buttonCloseModalRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <label className="form-label">Tanggal Pengajuan</label>
                                    <input type="date" defaultValue={tanggal_pengajuan} className={`form-control${errors.tanggal_pengajuan ? ' is-invalid' : ''}`} {...register('tanggal_pengajuan')} />
                                    {errTanggalPengajuan}
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Jenis Cuti</label>
                                    <select defaultValue={jenis_cuti} className={`form-control select${errors.jenis_cuti ? ' is-invalid' : ''}`} onChange={handleSelectedChange}>
                                        <option selected={jenis_cuti==""}>--pilih--</option>
                                        <option selected={jenis_cuti=="1"} value="1">tes</option>
                                    </select>
                                    {errJenisCuti}
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Lama Cuti</label>
                                    <input type="number" defaultValue={lama_cuti} className={`form-control${errors.lama_cuti ? ' is-invalid' : ''}`} {...register('lama_cuti', { valueAsNumber: true })} />
                                    {errLamaCuti}
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Tujuan</label>
                                    <textarea defaultValue={tujuan} className={`form-control${errors.tujuan ? ' is-invalid' : ''}`} {...register('tujuan')}></textarea>
                                    {errTujuan}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type='submit' ref={buttonSubmitModalRef} className="btn btnSmall blueDark">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.getElementById('modal-ubah-cuti')!
    );
};

export default ModalUbahCuti;
