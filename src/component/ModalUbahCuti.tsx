import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ModalEditCutiProps } from '../model/ModalEditCutiProps';
import { schema } from '@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { z } from 'zod';

const ModalUbahCuti: React.FC<ModalEditCutiProps> = ({id,tanggal_pengajuan,jenis_cuti,lama_cuti,tujuan}) => {
    const [errTanggalPengajuan, setErrTanggalPengajuan] = useState<string | null>(null);
    const [errJenisCuti, setErrJenisCuti] = useState<string | null>(null);
    const [errLamaCuti, setErrLamaCuti] = useState<string | null>(null);
    const [errTujuan, setErrTujuan] = useState<string | null>(null);

    type ValidationSchemaType = z.infer<typeof schema>
    const buttonSubmitModalRef = useRef<HTMLButtonElement>(null);
    const buttonCloseModalRef = useRef<HTMLButtonElement>(null);
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
                if (buttonCloseModalRef.current) {
                    buttonCloseModalRef.current.disabled = true;
                }
                if (buttonSubmitModalRef.current) {
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
                        .finally(() => {
                            if (buttonCloseModalRef.current) {
                                buttonCloseModalRef.current.disabled = false;
                            }
                            if (buttonSubmitModalRef.current) {
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

    useEffect(() => {
        if (errors.tanggal_pengajuan) {
            const message = errors.tanggal_pengajuan.message;
            setErrTanggalPengajuan(`<div className="invalid-feedback">${message}</div>`);
        } else {
            setErrTanggalPengajuan(null);
        }

        if (errors.jenis_cuti) {
            const message = errors.jenis_cuti.message;
            setErrJenisCuti(`<div className="invalid-feedback">${message}</div>`);
        } else {
            setErrJenisCuti(null);
        }

        if (errors.lama_cuti) {
            const message = errors.lama_cuti.message;
            setErrLamaCuti(`<div className="invalid-feedback">${message}</div>`);
        } else {
            setErrLamaCuti(null);
        }

        if (errors.tujuan) {
            const message = errors.tujuan.message;
            setErrTujuan(`<div className="invalid-feedback">${message}</div>`);
        } else {
            setErrTujuan(null);
        }
    }, [errors]);

    return ReactDOM.createPortal(
        <div className="modal fades show" id="modalEdit" aria-hidden="true" style={{ display: 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="hidden" defaultValue={id} {...register('tanggal_pengajuan')}/>

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
                                        <option>--pilih--</option>
                                        <option value="1">tes</option>
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
