import { ModalEditCutiProps } from '../model/ModalEditCutiProps';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { JenisCuti } from '../model/JenisCuti';
import { cutiselector } from '../redux/cutiSlice';
import { useAppSelector } from '../redux/hooks';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { CreateCuti } from '../repo/CreateCuti';
import { UpdateCuti } from '../repo/UpdateCuti';

const ModalUbahCuti: React.FC<ModalEditCutiProps> = ({id,tanggal_pengajuan,jenis_cuti,lama_cuti,tujuan}) => {
    
    const selectorCuti = useAppSelector(cutiselector);
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
        lama_cuti: "",
        tujuan: "",
        jenis_cuti: "",
    });
    useEffect(() => {
        setFormData({
            id: id,
            tanggal_pengajuan: tanggal_pengajuan,
            lama_cuti: lama_cuti,
            tujuan: tujuan,
            jenis_cuti: jenis_cuti,
        });
    }, [id, tanggal_pengajuan, jenis_cuti, lama_cuti, tujuan]);
    
    const validationSchema = Yup.object({
        tanggal_pengajuan: Yup.date().required("this is required"),
        lama_cuti: Yup.number()
          .typeError("must be a number")
          .min(1, "this must be at least 1 day")
          .required("this is required"),
          tujuan: Yup.string().required("this is required"),
          jenis_cuti: Yup.string().required("this is required"),
    });
    async function updateCuti(cuti:any){
        try {
            if (buttonCloseModalRef.current) {
                buttonCloseModalRef.current.disabled = true;
            }
            if (buttonSubmitModalRef.current) {
                buttonSubmitModalRef.current.disabled = true;
            }
            toastId.current = toast("Loading...", { autoClose: false });
            
            const response:any = await UpdateCuti(cuti);
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
            await updateCuti({
                id: formData.id,
                nidn:localStorage.getItem('authData'),
                tanggal_pengajuan: new Date(formData.tanggal_pengajuan).toISOString()?.split('T')[0] ?? "",
                lama_cuti: formData.lama_cuti,
                tujuan: formData.tujuan,
                jenis_cuti: formData.jenis_cuti,
            });
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
                            <h5 className="modal-title" >Tambah Cuti</h5>
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
                                    <label className="form-label">Jenis Cuti</label>
                                    <select className={`form-control select${errors.jenis_cuti ? ' is-invalid' : ''}`} 
                                            defaultValue={formData.jenis_cuti} 
                                            onChange={(e) => setFormData({ ...formData, jenis_cuti: e.target.value })}>
                                        <option selected={formData.jenis_cuti==""} value="">--pilih--</option>
                                        {
                                            selectorCuti.list_jenis_cuti.map((jenis_cuti:JenisCuti, _) => (
                                                <option selected={formData.jenis_cuti==jenis_cuti.id} key={jenis_cuti.id} value={jenis_cuti.id}>{jenis_cuti.nama}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.jenis_cuti && <div className="invalid-feedback">{errors.jenis_cuti}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Lama Cuti</label>
                                    <input type="number" 
                                            className={`form-control${errors.lama_cuti ? ' is-invalid' : ''}`} 
                                            defaultValue={formData.lama_cuti}
                                            onChange={(e) => setFormData({ ...formData, lama_cuti: e.target.value })} />
                                    {errors.lama_cuti && <div className="invalid-feedback">{errors.lama_cuti}</div>}
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
        document.getElementById('modal-ubah-cuti')!
    );
};

export default ModalUbahCuti;
