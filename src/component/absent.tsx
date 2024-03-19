import moment from 'moment';
import '../home.css'
import Calendar from './Calendar';

function Absent() {
    const data: EventData[] = [
        {
          eventName: "Skripsi",
          tahun_akademik: "Ganjil 2023/2024",
          eventLocation: "STAI Al-Andina Sukabumi",
          calendar: "penagihan",
          color: "masuk",
          color_dot: "#b00020;",
          startdate: "2024-03-09",
          enddate: "2024-03-10",
          author: 0,
          description: ""
        },
        {
          eventName: "Pengisian KRS",
          tahun_akademik: "Ganjil 2023/2024",
          eventLocation: "UNU Kalbar Pontianak",
          calendar: "penagihan",
          color: "cuti",
          color_dot: "#b00020;",
          startdate: "2024-02-19",
          enddate: "2024-03-02",
          author: 0,
          description: ""
        }
      ];
      
    const dayEvents:EventData[] = data.filter(ev => moment(ev.startdate).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"));
    const openDay = (date: EventData[]) => {
        console.log(date);
    };

    return (
        <section className="absent card">
            <div className="absent__content row-container spaceBetweenRow">
                <h3>Absensi</h3>
                <button className="btn btnSmall blueDark">Absen</button>
            </div>
            <div className="absent__content row-container spaceAroundRow">
                <Calendar events={data} click={openDay} />
                <div className="calendar-event">
                    {
                    dayEvents.length > 0 ? 
                    dayEvents.map((event, i) => (
                        <div key={i} className="event-item">
                            <label className={`event-status ${event.color}`}>{event.calendar}</label>
                            <p className="event-tujuan">{event.eventLocation}</p>
                        </div>
                    )) :
                    <div className="event-item notFound">
                        Tidak ada acara
                    </div>
                    }
                </div>
            </div>
        </section>
    );
}

export default Absent;