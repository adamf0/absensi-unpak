import '../style.css'
import agendaIcon from '../assets/agenda-icon.png'
import { useNavigate } from 'react-router-dom';

function WelcomingComponent() {
    const navigate = useNavigate();
    const path = window.location.pathname.split('/');

    return (
        <section className="welcoming">
            <div className="container row-container spaceAroundRow">
                <div className="container__content containerYaxis">
                    <h1>Tetap fokus dan teratur dengan aplikasi ABSEN.</h1>
                    <h2>Buat absensi pribadi maupun cuti dengan aplikasi ABSEN.</h2>
                    <div className="shortMenu">
                        {
                            localStorage.getItem('authData')==null? 
                                <button className="btn button blueDark" onClick={()=>navigate('/login')}>Login</button>:
                                <button className="btn button blueDark" onClick={()=>navigate('/logout')}>Logout</button>
                        }
                        {
                            localStorage.getItem('authData')==null? <></>: 
                            <>
                                <button className={`btn button ${path.indexOf('absensi')==1? "":"blue"}`} onClick={()=>navigate('/absensi')}>Absensi</button>
                                <button className={`btn button ${path.indexOf('cuti')==1? "":"blue"}`} onClick={()=>navigate('/cuti')}>Cuti</button>
                                <button className={`btn button ${path.indexOf('izin')==1? "":"blue"}`} onClick={()=>navigate('/izin')}>Izin</button>    
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

export default WelcomingComponent;