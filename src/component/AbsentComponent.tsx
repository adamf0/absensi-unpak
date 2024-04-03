import moment from 'moment';
import '../style.css'
import CalendarComponent from './CalendarComponent';
import { absenselector, setAbsent, setOutAbsent } from '../redux/absenSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import { Absen } from '../model/Absen';
import { GetListCalendar } from '../repo/GetListCalendar';
import { CheckAvaibiliyAbsen } from '../repo/CheckAvaibiliyAbsen';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { AlertObserver } from '../io/AlertObserver';
import { CreateAbsentMasuk } from '../repo/CreateAbsentMasuk';
import { CreateAbsentKeluar } from '../repo/CreateAbsentKeluar';

function AbsentComponent() {
    const [yearMonthEvent, _] = useState<string>(moment().format("YYYY-MM"));
    const [listEvent, setListEvent] = useState<EventData[]>([]);
    const [listEventNow, setListEventNow] = useState<EventData[]>([]);
    const selectorAbsen = useAppSelector(absenselector);
    const [absenButton, setAbsenButton] = useState<any>(<></>);
    const dispatch = useAppDispatch();

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());

    async function loadCalendar() {
        const authData = localStorage.getItem('authData');
        if (authData != null || authData != "null") {
            try {
                const response:any = await GetListCalendar(yearMonthEvent);
                handler1.notifyObservers(response);
                if (response.status === 200 || response.status === 500) {
                    const { status,message,list } = response;
                    if(status == 200){
                        const eventDataArray = list.map((item: any) => ({
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
                    } else if(status == 500){
                        handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                    } else{
                        handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                    }
                } else {
                    handler2.notifyObservers("terjadi masalah pada saat request ke server");
                }
            } catch (error:any) {
                handler1.notifyObservers(error);
            }
        }
    }
    async function checkAvaibilityAbsent() {
        const authData = localStorage.getItem('authData');
        if (authData != null || authData != "null") {
            try {
                const response:any = await CheckAvaibiliyAbsen();
                handler1.notifyObservers(response);
                if (response.status === 200 || response.status === 500) {
                    const { status,message,data } = response;

                    if (status == 200 && data == null) {
                        dispatch(setAbsent(null))
                    } else if (status == 200 && data != null){
                        dispatch(setAbsent(new Absen(
                            data.id,
                            data.nidn,
                            data.tanggal,
                            data.absen_masuk,
                            data.absen_keluar,
                        )))
                    } else if (status == 500) {
                        dispatch(setAbsent(null))
                        handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                    } else {
                        handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                    }
                } else {
                    handler2.notifyObservers("terjadi masalah pada saat request ke server");    
                }
            } catch (error:any) {
                handler1.notifyObservers(error);
            }
        }
    }
    async function AbsenMasuk(absen:any){
        try {
            const response:any = await CreateAbsentMasuk(absen);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message,data } = response;

                if (status == 200){
                    dispatch(setAbsent(new Absen(
                        data.id,
                        localStorage.getItem('authData'),
                        new Date().toISOString().slice(0, 10),
                        absen,
                        null
                    )))
                    setAbsenButton(<button className="btn button buttonSmall blueDark" onClick={handlerAbsent}>Absen Keluar</button>)
                    await loadCalendar()
                    handler2.notifyObservers(message);
                } else if (status == 500) {
                    // dispatch(setAbsent(null))
                    handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                } else {
                    handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                }
            } else {
                handler2.notifyObservers("terjadi masalah pada saat request ke server");    
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            // Logika untuk menangani pengaktifan tombol
        }
    }
    async function AbsenKeluar(absen:any){
        try {
            const response:any = await CreateAbsentKeluar(absen);
            handler1.notifyObservers(response);
            if (response.status === 200 || response.status === 500) {
                const { status,message } = response;

                if (status == 200 ){
                    dispatch(setOutAbsent(absen.absen_keluar))
                    setAbsenButton(<></>)
                    handler2.notifyObservers(message);
                } else if (status == 500) {
                    // dispatch(setAbsent(null))
                    handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                } else {
                    handler2.notifyObservers(message ?? "terjadi masalah pada saat request ke server");
                }
            } else {
                handler2.notifyObservers("terjadi masalah pada saat request ke server");    
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            // Logika untuk menangani pengaktifan tombol
        }
    }

    useEffect(() => {
        loadCalendar()
        checkAvaibilityAbsent();
    }, []);

    const openDay = (events: EventData[]) => {
        setListEventNow(events)
    };

    const handlerAbsent = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    if (selectorAbsen.absen == null) {
                        const absenMasuk = moment().format('H:mm:ss')
                        await AbsenMasuk({
                            "nidn": localStorage.getItem('authData'),
                            "tanggal": new Date().toISOString().slice(0, 10),
                            "absen_masuk": absenMasuk,
                            "lat": position.coords.latitude,
                            "long": position.coords.longitude
                        })
                    } else if (selectorAbsen.absen?.absen_keluar == null) {
                        const absenKeluar = moment().format('H:mm:ss')
                        AbsenKeluar({
                            "nidn": localStorage.getItem('authData'),
                            "tanggal": new Date().toISOString().slice(0, 10),
                            "absen_keluar": absenKeluar
                        })
                    }
                },
                (error) => {
                    handler2.notifyObservers(error.message);    
                }
            );
        } else {
            handler2.notifyObservers("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {
        if (localStorage.getItem('authData') != null && (selectorAbsen.absen == null || selectorAbsen.absen?.absen_masuk == null)) {
            setAbsenButton(<button className="btn button buttonSmall blueDark" onClick={handlerAbsent}>Absen Masuk</button>)
        } else if (localStorage.getItem('authData') != null && selectorAbsen.absen?.absen_masuk != null && selectorAbsen.absen?.absen_keluar == null) {
            setAbsenButton(<button className="btn button buttonSmall blueDark" onClick={handlerAbsent}>Absen Keluar</button>)
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