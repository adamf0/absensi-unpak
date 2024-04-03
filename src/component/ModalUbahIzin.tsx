import { ModalEditIzinProps } from '../model/ModalEditIzinProps';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { UpdateIzin } from '../repo/UpdateIzin';

const ModalUbahIzin: React.FC<ModalEditIzinProps> = ({id,tanggal_pengajuan,tujuan}) => {
    const buttonSubmitModalRef = useRef<HTMLButtonElement>(null);
    const buttonCloseModalRef = useRef<HTMLButtonElement>(null);
    const toastId = useRef<any>(null);

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    const [errors, setErrors] = useState<Errors>({});
    const [formData, setFormData] = useState({
        id: "",
        tanggal_pengajuan: "",
        tujuan: "",
    });
    useEffect(() => {
        setFormData({
            id: id,
            tanggal_pengajuan: tanggal_pengajuan,
            tujuan: tujuan,
        });
    }, [id, tanggal_pengajuan, tujuan]);
    
    const validationSchema = Yup.object({
        tanggal_pengajuan: Yup.date().required("this is required"),
        tujuan: Yup.string().required("this is required"),
    });

    async function updateIzin(izin:any){
        try {
            if (buttonCloseModalRef.current) {
                buttonCloseModalRef.current.disabled = true;
            }
            if (buttonSubmitModalRef.current) {
                buttonSubmitModalRef.current.disabled = true;
            }
            toastId.current = toast("Loading...", { autoClose: false });
            
            const response:any = await UpdateIzin(izin);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message } = response;

                if (status == 200){
                    toast.update(toastId.current, { render:message, type: "success", autoClose: 5000 });
                } else if (status == 500) {
                    toast.update(toastId.current, { render:message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
                } else {
                    toast.update(toastId.current, { render:message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
                }
            } else {
                toast.update(toastId.current, { render:"terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
            }
        } catch (error:any) {
            toast.update(toastId.current, { render:error.message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
            throw error;
        } finally {
            if (buttonCloseModalRef.current) {
                buttonCloseModalRef.current.disabled = false;
            }
            if (buttonSubmitModalRef.current) {
                buttonSubmitModalRef.current.disabled = false;
            }
        }
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        try {
            await validationSchema.validate(formData, {abortEarly: false});
            await updateIzin({
                id: formData.id,
                nidn:localStorage.getItem('authData'),
                tanggal_pengajuan: formData.tanggal_pengajuan,
                tujuan: formData.tujuan,
            })
          } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors: Errors = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    }
    
    return ReactDOM.createPortal(
        <div className="modal fades show" id="modalEdit" aria-hidden="true" style={{ display: 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" >Tambah Izin</h5>
                            <button type="button" ref={buttonCloseModalRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <label className="form-label">Tanggal Pengajuan</label>
                                    <input type="date" 
                                            className={`form-control${errors.tanggal_pengajuan ? ' is-invalid' : ''}`} 
                                            defaultValue={formData.tanggal_pengajuan}
                                            onChange={(e) => setFormData({ ...formData, tanggal_pengajuan: e.target.value })} />
                                    {errors.tanggal_pengajuan && <div className="invalid-feedback">{errors.tanggal_pengajuan}</div>}
                                </div>
                                
                                <div className="col-12">
                                    <label className="form-label">Tujuan</label>
                                    <textarea defaultValue={formData.tujuan} 
                                                className={`form-control${errors.tujuan ? ' is-invalid' : ''}`} 
                                                onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}></textarea>
                                    {errors.tujuan && <div className="invalid-feedback"></div>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type='submit' ref={buttonSubmitModalRef} className="button buttonSmall blueDark">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.getElementById('modal-ubah-izin')!
    );
};

export default ModalUbahIzin;
