import '../style.css'
import agendaIcon from '../assets/agenda-icon.png'
import { useNavigate } from 'react-router-dom';
import { authselector } from '../redux/authSlice';
import { useAppSelector } from '../redux/hooks';

function Welcoming() {
    const selectorAuth = useAppSelector(authselector);
    const navigate = useNavigate();

    return (
        <section className="welcoming">
            <div className="container row-container spaceAroundRow">
                <div className="container__content containerYaxis">
                    <h1>Tetap fokus dan teratur dengan aplikasi ABSEN.</h1>
                    <h2>Buat absensi pribadi maupun cuti dengan aplikasi ABSEN.</h2>
                    <div className="shortMenu">
                        {
                            selectorAuth.nidn==null? 
                                <button className="btn button blueDark" onClick={()=>navigate('/login')}>Login</button>:
                                <button className="btn button blueDark" onClick={()=>navigate('/logout')}>Logout</button>
                        }
                        {
                            selectorAuth.nidn==null? <></>: 
                            <>
                                <button className="btn button blue" onClick={()=>navigate('/absensi')}>Absensi</button>
                                <button className="btn button blue" onClick={()=>navigate('/cuti')}>Cuti</button>    
                            </>
                        }
                    </div>
                </div>
                <div className="container__content row-container">
                    <img src={agendaIcon} alt="icon" />
                </div>
            </div>
        </section>
    );
}

export default Welcoming;