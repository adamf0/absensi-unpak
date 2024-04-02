import moment from 'moment';
import '../style.css'
import CalendarComponent from './CalendarComponent';
import { absenselector, setAbsent, setOutAbsent } from '../redux/absenSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import { Absen } from '../model/Absen';

function AbsentComponent() {
    const [yearMonthEvent, _] = useState<string>(moment().format("YYYY-MM"));
    const [listEvent, setListEvent] = useState<EventData[]>([]);
    const [listEventNow, setListEventNow] = useState<EventData[]>([]);
    const selectorAbsen = useAppSelector(absenselector);
    const [absenButton, setAbsenButton] = useState<any>(<></>);
    const dispatch = useAppDispatch();

    async function loadCalendar() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        };

        if (localStorage.getItem('authData') != null || localStorage.getItem('authData') != "null") {
            await fetch(`${process.env.base_url_api}/calendar/${localStorage.getItem('authData')}/${yearMonthEvent}`, requestOptions)
                .then(async response => {
                    if (response.ok || response.status == 500) {
                        return response.json()
                    }
                })
                .then(async json => {
                    if(json.status == 200){
                        const eventDataArray = json.list.map((item: any) => ({
                            id: item.id,
                            tanggal: item.tanggal,
                            type: item.type,
                            absen_masuk: item.type == "absen" ? item.absen_masuk : null,
                            absen_keluar: item.type == "absen" ? item.absen_keluar : null,
                            jenis_cuti: item.type == "cuti" ? item.jenis_cuti : null,
                            tujuan: item.type == "cuti" ? item.tujuan : null,
                        }));

                        setListEvent(eventDataArray);
                        setListEventNow(
                            listEvent.filter(ev => moment(ev.tanggal).format("YYYY-MM-DD") === yearMonthEvent)
                        )
                    } else if(json.status == 500){
                        alert(json.message ?? "terjadi masalah pada saat request ke server")
                    } else{
                        alert(json.message ?? "terjadi masalah pada saat request ke server")
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

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            // body: JSON.stringify({
            //     nidn: selectorAuth.nidn,
            //     tanggal: new Date().toISOString().slice(0, 10),
            // })
        };

        if (localStorage.getItem('authData') != null || localStorage.getItem('authData') != "null") {
            fetch(`${process.env.base_url_api}/absen/check/${localStorage.getItem('authData')}/${new Date().toISOString().slice(0, 10)}`, requestOptions)
                .then(async response => {
                    if (response.ok || response.status == 500) {
                        return response.json()
                    }
                })
                .then(async json => {
                    if (json.status == 200) {
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
                    } else if (json.status == 500) {
                        dispatch(setAbsent(null))
                    } else {
                        alert(json.message ?? "terjadi masalah pada saat request ke server")
                    }
                })
                .catch(error => {
                    alert(error.message)
                })
                .finally(() => {

                })
        }
    }, []);

    const openDay = (events: EventData[]) => {
        setListEventNow(events)
    };

    const absent = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (selectorAbsen.absen == null) {
                        const absenMasuk = moment().format('H:mm:ss')
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({
                                "nidn": localStorage.getItem('authData'),
                                "tanggal": new Date().toISOString().slice(0, 10),
                                "absen_masuk": absenMasuk,
                                "lat": position.coords.latitude,
                                "long": position.coords.longitude
                            })
                        };

                        fetch(`${process.env.base_url_api}/absen/masuk`, requestOptions)
                            .then(async response => {
                                if (response.ok || response.status==500) {
                                    return response.json()
                                }
                            })
                            .then(async json => {
                                if(json.status == 200){
                                    dispatch(setAbsent(new Absen(
                                        json.data.id,
                                        localStorage.getItem('authData'),
                                        new Date().toISOString().slice(0, 10),
                                        absenMasuk,
                                        null
                                    )))
                                    setAbsenButton(<button className="btn button buttonSmall blueDark" onClick={absent}>Absen Keluar</button>)
                                } else if(json.status == 200){
                                    
                                } else{

                                }
                                alert(json.message ?? "terjadi masalah pada saat request ke server")
                            })
                            .catch(error => {
                                alert(error.message)
                            })
                            .finally(() => {

                            })
                    } else if (selectorAbsen.absen?.absen_keluar == null) {
                        const absenKeluar = moment().format('H:mm:ss')
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({
                                "nidn": localStorage.getItem('authData'),
                                "tanggal": new Date().toISOString().slice(0, 10),
                                "absen_keluar": absenKeluar
                            })
                        };

                        fetch(`${process.env.base_url_api}/absen/keluar`, requestOptions)
                            .then(async response => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    throw new Error(`${response.status}`);
                                }
                            })
                            .then(async json => {
                                if (json.status != 200) {
                                    alert(json.message ?? "terjadi masalah pada saat request ke server")
                                } else {
                                    dispatch(setOutAbsent(absenKeluar))
                                    setAbsenButton(<></>)
                                    alert(json.message)
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

    useEffect(() => {
        if (localStorage.getItem('authData') != null && (selectorAbsen.absen == null || selectorAbsen.absen?.absen_masuk == null)) {
            setAbsenButton(<button className="btn button buttonSmall blueDark" onClick={absent}>Absen Masuk</button>)
        } else if (localStorage.getItem('authData') != null && selectorAbsen.absen?.absen_masuk != null && selectorAbsen.absen?.absen_keluar == null) {
            setAbsenButton(<button className="btn button buttonSmall blueDark" onClick={absent}>Absen Keluar</button>)
        } else {
            setAbsenButton(<></>)
        }
    }, [selectorAbsen.absen])

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
                                    <p className="event-tujuan">Keterangan: {event.type == "cuti" ? event.tujuan : "Masuk"}</p>
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