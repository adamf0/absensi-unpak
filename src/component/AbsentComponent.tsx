import moment from 'moment';
import '../style.css'
import CalendarComponent from './CalendarComponent';
import { absenselector, setAbsent } from '../redux/absenSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authselector } from '../redux/authSlice';
import { useEffect } from 'react';
import { Absen } from '../model/Absen';

function AbsentComponent() {
    const selectorAuth = useAppSelector(authselector);
    const selectorAbsen = useAppSelector(absenselector);
    const dispatch = useAppDispatch();

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

    const dayEvents: EventData[] = data.filter(ev => moment(ev.startdate).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"));
    const openDay = (date: EventData[]) => {
        console.log(date);
    };

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            // body: JSON.stringify({
            //     nidn: selectorAuth.nidn,
            //     tanggal: new Date().toISOString().slice(0, 10),
            // })
        };


        fetch(`http://localhost:8000/absen/check/${selectorAuth.nidn}/${new Date().toISOString().slice(0, 10)}`, requestOptions)
            .then(async response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(`${response.status}`);
                }
            })
            .then(async json => {
                console.log(json)
                if (json.status != 200) {
                    alert(json.message ?? "terjadi masalah pada saat request ke server")
                } else {
                    if (json.data == null) {
                        dispatch(setAbsent(null))
                    } else {
                        dispatch(setAbsent(new Absen(
                            json.data.id,
                            json.data.nidn,
                            json.data.tanggal,
                            json.data.absen_masuk,
                            json.data.absen_keluars,
                        )))
                    }
                }
            })
            .catch(error => {
                alert(error.message)
            })
            .finally(() => {

            })
    }, []);

    const absent = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (selectorAbsen.absen == null) {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({
                                "nidn": selectorAuth.nidn,
                                "tanggal": new Date().toISOString().slice(0, 10),
                                "absen_masuk": "08:00:00",
                                "lat": position.coords.latitude,
                                "long": position.coords.longitude
                            })
                        };

                        fetch(`http://localhost:8000/absen/masuk`, requestOptions)
                            .then(async response => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    throw new Error(`${response.status}`);
                                }
                            })
                            .then(async json => {
                                console.log(json)
                                if (json.status != 200) {
                                    alert(json.message ?? "terjadi masalah pada saat request ke server")
                                } else {
                                    dispatch(setAbsent(new Absen(
                                        json.data.id,
                                        selectorAuth.nidn,
                                        new Date().toISOString().slice(0, 10),
                                        "08:00:00",
                                        null
                                    )))
                                }
                            })
                            .catch(error => {
                                alert(error.message)
                            })
                            .finally(() => {

                            })
                    } else if (selectorAbsen.absen?.absen_keluar == null) {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({
                                "nidn": selectorAuth.nidn,
                                "tanggal": new Date().toISOString().slice(0, 10),
                                "absen_keluar": "09:00:00"
                            })
                        };

                        fetch(`http://localhost:8000/absen/keluar`, requestOptions)
                            .then(async response => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    throw new Error(`${response.status}`);
                                }
                            })
                            .then(async json => {
                                console.log(json)
                                if (json.status != 200) {
                                    alert(json.message ?? "terjadi masalah pada saat request ke server")
                                } else {
                                    
                                }
                            })
                            .catch(error => {
                                alert(error.message)
                            })
                            .finally(() => {

                            })
                    }
                },
                (error) => {
                    alert(error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    return (
        <section className="absent card">
            <div className="absent__content row-container spaceBetweenRow">
                <h3>Absensi</h3>
                {selectorAuth.nidn != null && (selectorAbsen.absen == null || selectorAbsen.absen != null) ?
                    <button className="btn button buttonSmall blueDark" onClick={absent}>{selectorAbsen.absen == null? "Absen masuk":"Absen keluar"}</button> : <></>}
            </div>
            <div className="absent__content row-container spaceAroundRow">
                <CalendarComponent events={data} click={openDay} />
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

export default AbsentComponent;