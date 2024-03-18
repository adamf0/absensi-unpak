import '../home.css'
import agendaIcon from '../assets/agenda-icon.png'

function Welcoming() {
    return (
        <section className="welcoming">
            <div className="container row-container spaceAroundRow">
                <div className="container__content containerYaxis">
                    <h1>Tetap fokus dan teratur dengan aplikasi ABSEN.</h1>
                    <h2>Buat catatan absensi pribadi maupun cuti dengan aplikasi ABSEN.</h2>
                    <div className="shortMenu">
                        <button className="btn blueDark">Logout</button>
                        <button className="btn blue">Absensi</button>
                        <button className="btn blue">Cuti</button>
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