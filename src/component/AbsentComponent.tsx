import moment from 'moment';
import '../style.css'
import CalendarComponent from './CalendarComponent';
import { absenselector, setAbsent } from '../redux/absenSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import { Absen } from '../model/Absen';

function AbsentComponent() {
    const [yearMonthEvent, setYearMonthEvent] = useState<string>(moment().format("YYYY-MM"));
    const [listEvent, setListEvent] = useState<EventData[]>([]);
    const [listEventNow, setListEventNow] = useState<EventData[]>([]);
    const selectorAbsen = useAppSelector(absenselector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            // body: JSON.stringify({
            //     nidn: selectorAuth.nidn,
            //     tanggal: new Date().toISOString().slice(0, 10),
            // })
        };

        if(localStorage.getItem('authData')!=null || localStorage.getItem('authData')!="null"){
            fetch(`http://localhost:8000/absen/check/${localStorage.getItem('authData')}/${new Date().toISOString().slice(0, 10)}`, requestOptions)
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
                            json.data.absen_keluar,
                        )))
                    }
                }
            })
            .catch(error => {
                alert(error.message)
            })
            .finally(() => {

            })
        }
    }, []);

    async function loadCalendar(){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        };

        if(localStorage.getItem('authData')!=null || localStorage.getItem('authData')!="null"){
            await fetch(`http://localhost:8000/calendar/${localStorage.getItem('authData')}/${yearMonthEvent}`, requestOptions)
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
                    const eventDataArray = json.list.map((item:any) => ({
                        id: item.id,
                        tanggal: item.tanggal,
                        type: item.type,
                        absen_masuk: item.type=="absen"? item.absen_masuk:null,
                        absen_keluar: item.type=="absen"? item.absen_keluar:null,
                        jenis_cuti: item.type=="cuti"? item.jenis_cuti:null,
                        tujuan: item.type=="cuti"? item.tujuan:null,
                    }));

                    setListEvent(eventDataArray);
                    setListEventNow(
                        listEvent.filter(ev => moment(ev.tanggal).format("YYYY-MM-DD") === yearMonthEvent)
                    )
                }
            })
            .catch(error => {
                alert(error.message)
            })
            .finally(() => {

            })
        }
    }
    useEffect(() => {
        loadCalendar()
    }, []);

    const openDay = (events: EventData[]) => {
        console.log(events);
        setListEventNow(events)
    };

    const absent = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (selectorAbsen.absen == null) {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({
                                "nidn": localStorage.getItem('authData'),
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
                                        localStorage.getItem('authData'),
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
                                "nidn": localStorage.getItem('authData'),
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

    let absenButton = <></>
    if(localStorage.getItem('authData') != null && (selectorAbsen.absen == null || selectorAbsen.absen.absen_masuk == null)){
        absenButton = <button className="btn button buttonSmall blueDark" onClick={absent}>Absen Masuk</button>
    } else if(localStorage.getItem('authData') != null && selectorAbsen.absen?.absen_masuk != null && selectorAbsen.absen?.absen_keluar == null){
        absenButton = <button className="btn button buttonSmall blueDark" onClick={absent}>Absen Keluar</button>
    }

    return (
        <section className="absent card">
            <div className="absent__content row-container spaceBetweenRow">
                <h3>Absensi</h3>
                {absenButton}
            </div>
            <div className="absent__content row-container spaceAroundRow">
                <CalendarComponent events={listEvent} click={openDay} />
                <div className="calendar-event">
                    {
                        listEventNow.length > 0 ?
                            listEventNow.map((event, i) => (
                                <div key={i} className="event-item">
                                    <p>{moment(event.tanggal).locale("id").format('DD MMMM YYYY')}</p>
                                    <label className={`event-status ${event.type}`}>{event.type}</label>
                                    <p className="event-tujuan">Keterangan: {event.type=="cuti"? event.tujuan:"Masuk"}</p>
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