import { useRef, useState } from 'react';
import '../style.login.css'
import * as Yup from "yup";
// import { toast } from 'react-toastify';
import { setAuth } from '../redux/authSlice';
import { useAppDispatch } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const buttonmasukRef = useRef<HTMLButtonElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState<Errors>({});
    const [formData, setFormData] = useState({
        nidn: "",
        password: "",
    });
    const validationSchema = Yup.object({
        nidn: Yup.string().required("this is required"),
        password: Yup.string().required("this is required"),
    });
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, {abortEarly: false});
            dispatch(setAuth(formData.nidn))
            setTimeout(()=>{
                navigate('/')
            },1000)

            // const requestOptions = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            //     body: JSON.stringify({
            //         nidn: formData.nidn,
            //         password: formData.password,
            //     })
            // };

            // await toast.promise(
            //     new Promise((resolve, reject) => {
            //         console.log(requestOptions)
            //         if (buttonmasukRef.current) {
            //             buttonmasukRef.current.disabled = true;
            //         }
            //         setTimeout(() => {
            //             fetch(`http://localhost:8000/login`, requestOptions)
            //                 .then(async response => {
            //                     if (response.ok) {
            //                         return response.json()
            //                     } else {
            //                         throw new Error(`${response.status}`);
            //                     }
            //                 })
            //                 .then(async json => {
            //                     console.log(json)
            //                     if (json.status != 200) {
            //                         reject(json.message ?? "terjadi masalah pada saat request ke server")
            //                     } else {
            //                         dispatch(setAuth(formData.nidn))
            //                         resolve(json.message)
            //                     }
            //                 })
            //                 .catch(error => {
            //                     reject(error)
            //                 })
            //                 .finally(() => {
            //                     if (buttonmasukRef.current) {
            //                         buttonmasukRef.current.disabled = false;
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
            //                 setTimeout(()=>{
            //                     navigate('/')
            //                 },2000)
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
          } catch (error) {
            console.log(`error: ${error}`)
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
    
    return (
        <form className="grid" onSubmit={handleSubmit}>
            <div className="layer"></div>
            <section className="section__login">
                <div className="top">
                    <img className="section__login--img" src="https://sippm.unpak.ac.id/assets/img/logo.webp" alt="logo" />
                    <h1 className="section__login--title">Login</h1>
                </div>
                <div className="bottom">
                    <div className="block">
                        <label className="form-label">Nidn</label>
                        <input type="text" 
                            placeholder="Masukkan nidn anda" 
                            className={`form-control${errors.nidn ? ' is-invalid' : ''}`} 
                            defaultValue={formData.nidn}
                            onChange={(e) => setFormData({ ...formData, nidn: e.target.value })} />
                        {errors.nidn && <div className="invalid-feedback">{errors.nidn}</div>}
                    </div>
                    <div className="blck">
                        <label className="form-label">Password</label>
                        <input type="password" 
                            placeholder="Masukkan password anda" 
                            className={`form-control${errors.password ? ' is-invalid' : ''}`} 
                            defaultValue={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <button type="submit" ref={buttonmasukRef} className="btn btn-primary w-full">Masuk</button>
                </div>
            </section>
        </form>
    );
}

export default LoginPage;