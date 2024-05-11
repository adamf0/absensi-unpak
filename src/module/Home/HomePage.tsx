import Container from "@/components/layouts/Container/Container";
import PageWrapper from "@/components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "@/components/layouts/Subheader/Subheader";
import Card, { CardBody } from "@/components/ui/Card";
import Icon from "@/components/icon/Icon";
import CardBadgeInfo from "@/module/component/CardBadgeInfo";
import Button, { IButtonProps } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Periode, { TPeriod } from "@/module/Enum/Periode";
import CalendarView from "@/module/component/CalendarView";
import classNames from "classnames";
import themeConfig from "@/config/theme.config";
import moment from "moment";
import 'moment-timezone';
import { DeliveryMan5WithDog } from "@/assets/images";
import Alert from "@/components/ui/Alert";
import { GetAbsen } from "@/module/repo/GetAbsen";
import { toast } from "react-toastify";
import { CreateAbsentMasuk } from "@/module/repo/CreateAbsentMasuk";
import { CreateAbsentKeluar } from "@/module/repo/CreateAbsentKeluar";
import { HandlerObserver } from "@/module/abstract/HandlerObserver";
import Label from "@/components/form/Label";
import Textarea from "@/components/form/Textarea";
import { GetInfo } from "@/module/repo/GetInfo";
import { ConsoleObserver } from "@/module/IO/ConsoleObserver";
import { GetListCalendar } from "@/module/repo/GetListCalendar";
import { getInfoUser } from "@/module/InfoUser";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState<TPeriod>(Periode.HARI);
    const [isBefore8AM, setIsBefore8AM] = useState<boolean>(false);
    const [eighthour, set8hour] = useState<boolean>(false);
    const [isLate, setIsLate] = useState<boolean>(false);
    const [messageBlockAbsent, setMessageBlockAbsent] = useState<any>(null);
    const timeAbsenString = "08:00:00"
    const timeAbsen = parseInt(timeAbsenString.split(":")[0])

    const [keterangan, setKeterangan] = useState<any>("");
    const [catatanTelat, setCatatanTelat] = useState<any>(null);
    const [catatanPulang, setCatatanPulang] = useState<any>(null);
    const [absenMasuk, setAbsenMasuk] = useState<any>(null);
    const [absenKeluar, setAbsenKeluar] = useState<any>(null);
    const [disableAbsen, setDisableAbsen] = useState<boolean>(true);
    const [listEvent, setListEvent] = useState<any>([]);
    const [info, setInfo] = useState<any>({
        absen: {
            masuk: 0,
            tidak_masuk: 0,
            lebih_8jam: 0,
            kurang_8jam: 0,
            tepat_waktu: 0,
            telat: 0
        },
        izin: {
            total: 0,
            menunggu: 0,
            tolak: 0,
            terima: 0
        },
        cuti: {
            total: 0,
            menunggu: 0,
            tolak: 0,
            terima: 0
        }
    });
    const dateNow = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const defaultProps: IButtonProps = {
        size: 'sm',
        color: 'zinc',
        rounded: 'rounded-full',
    };
    const activeProps: IButtonProps = {
        ...defaultProps,
        isActive: true,
        color: 'blue',
        colorIntensity: '500',
        variant: 'solid',
    };

    function rangeMingguan(tanggal: string): { senin: string, minggu: string } {
        const date = new Date(tanggal);
        const dayOfWeek = date.getDay();
        const daysToMonday = (dayOfWeek + 6) % 7; // Number of days to the previous Monday
        const daysToSunday = 7 - dayOfWeek; // Number of days to the next Sunday
        const mondayDate = new Date(date);

        mondayDate.setDate(date.getDate() - daysToMonday);
        const sundayDate = new Date(date);
        sundayDate.setDate(date.getDate() + daysToSunday);
        const formatDate = (d: Date) => d.toISOString().split('T')[0];
        return {
            senin: formatDate(mondayDate),
            minggu: formatDate(sundayDate),
        };
    }
    function rangeBulanan(tanggal: string): { tanggal_awal: string, tanggal_akhir: string } {
        const date = new Date(tanggal);
        const tanggal_awal = new Date(date);
        tanggal_awal.setDate(1); // Set the date to the first day of the month
        const tanggal_akhir = new Date(date);
        // Increment the month by 1, then set the date to 0 to get the last day of the month
        tanggal_akhir.setMonth(tanggal_akhir.getMonth() + 1);
        tanggal_akhir.setDate(0);
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        return {
            tanggal_awal: formatDate(tanggal_awal),
            tanggal_akhir: formatDate(tanggal_akhir),
        };
    }

    const getCurrentTime = () => {
        return moment('2024-05-11 16:11:00').tz('Asia/Jakarta')
    }
    const checkTime = () => {
        const currentTime = getCurrentTime();
        const checkBefore8AM = currentTime.isBefore(currentTime.clone().startOf('day').add(timeAbsen, 'hours').add('1', 'minutes'));
        setIsBefore8AM(checkBefore8AM);
    }
    const check8hour = () => {
        const masuk = moment(absenMasuk).tz('Asia/Jakarta')
        // console.info(getCurrentTime().format('YYYY-MM-DD HH:mm:ss'), masuk.format('YYYY-MM-DD HH:mm:ss'), masuk.clone().add(timeAbsen, 'hours').format('YYYY-MM-DD HH:mm:ss'))

        const check =getCurrentTime().isAfter(moment(absenMasuk).tz('Asia/Jakarta').add(timeAbsen, 'hours'));
        set8hour(check);
    }
    const checkCurrentAbove15 = () => {
        const requireCheckout = !isLate? moment(dateNow+' 14:59:00').tz('Asia/Jakarta'):moment(absenMasuk).tz('Asia/Jakarta').startOf('day').add(timeAbsen, 'hours');
        const check = getCurrentTime().isSameOrAfter(requireCheckout);
        return check;
    }
    const checkLate = () => {
        const currentTime = (absenMasuk == null ? getCurrentTime() : moment(absenMasuk)).tz('Asia/Jakarta');
        const absenMasukTime = moment(timeAbsenString, 'HH:mm:ss').tz('Asia/Jakarta').add('1', 'minutes');
        const checkLate = currentTime.isAfter(absenMasukTime);
        setIsLate(checkLate);
    }
    const loadAbsen = async () => {
        if (!["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"")) {
            console.log("loadAbsen hanya berjalan untuk pegawai dan dosen hukan ")
        } else {
            try {
                const response: any = await GetAbsen(
                    dateNow, 
                    localStorage.getItem('levelMode') == "dosen" ? localStorage.getItem('userRef') : null, 
                    localStorage.getItem('levelMode') == "pegawai" ? localStorage.getItem('userRef') : null
                );
                
                if (response.status === 200 || response.status === 500) {
                    const { status, message, data, log } = response;
    
                    if (status == 200) {
                        setAbsenMasuk(data?.absen_masuk)
                        setAbsenKeluar(data?.absen_keluar)
                        setCatatanTelat(data?.catatan_telat)
                        setCatatanPulang(data?.catatan_pulang)
                        setDisableAbsen(false)
                    } else if (status == 500) {
                        toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                        setDisableAbsen(true)
                        handler1.notifyObservers(log)
                    } else {
                        toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                        setDisableAbsen(true)
                        handler1.notifyObservers(message ?? "Terjadi masalah pada saat request ke server")
                    }
                }   
            } catch (error:any) {
                if(error.message.includes("hari ini anda sudah")){
                    setMessageBlockAbsent(error.message)
                } else{
                    toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                }
                throw error;
            }
        }
    }
    const loadInfo = async () => {
        if (!["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"")) {
            console.log("loadInfo hanya berjalan untuk pegawai dan dosen hukan ")
        } else {
            let tanggal_awaldx = null
            let tanggal_akhirdx = null
            if (activeTab == Periode.HARI) {
                tanggal_awaldx = dateNow
                tanggal_akhirdx = null
            } else if (activeTab == Periode.MINGGU) {
                const { senin, minggu } = rangeMingguan(dateNow)
                tanggal_awaldx = senin
                tanggal_akhirdx = minggu
            } else if (activeTab == Periode.BULAN) {
                const { tanggal_awal, tanggal_akhir } = rangeBulanan(dateNow)
                tanggal_awaldx = tanggal_awal
                tanggal_akhirdx = tanggal_akhir
            } else if (activeTab == Periode.Semua) {
                tanggal_awaldx = null
                tanggal_akhirdx = null
            }
            const response: any = await GetInfo(
                localStorage.getItem('levelMode') == "dosen" ? localStorage.getItem('userRef') : null,
                localStorage.getItem('levelMode') == "pegawai" ? localStorage.getItem('userRef') : null,
                tanggal_awaldx,
                tanggal_akhirdx
            );
            if (response.status !== 200) {
                toast(response.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
            }

            if (response.status === 200 || response.status === 500) {
                const { status, message, data, log } = response;

                if (status == 200) {
                    setInfo(data)
                } else if (status == 500) {
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                    setDisableAbsen(true)
                    handler1.notifyObservers(log)
                } else {
                    toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                    setDisableAbsen(true)
                    handler1.notifyObservers(message ?? "Terjadi masalah pada saat request ke server")
                }
            }
        }
    }
    const absenHandler = async (type: string) => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const ipAddress = data.ip

            if(!(ipAddress.match(/103\.169/)!==null || ipAddress.match(/2001:df0:3140/)!=null)){
                toast(`berada diluar jaringan universitas pakuan`, { type: "error", autoClose: 2000 });
            } else{
                try {
                    const timeNow = getCurrentTime().format("HH:mm:ss")
                    const response: any = (type == "masuk" ?
                        await CreateAbsentMasuk({
                            "nidn": localStorage.getItem('levelMode') == "dosen" ? localStorage.getItem('userRef') : null,
                            "nip": localStorage.getItem('levelMode') == "pegawai" ? localStorage.getItem('userRef') : null,
                            "tanggal": dateNow,
                            "absen_masuk": timeNow,
                            "keterangan": keterangan,
                        }) :
                        await CreateAbsentKeluar({
                            "nidn": localStorage.getItem('levelMode') == "dosen" ? localStorage.getItem('userRef') : null,
                            "nip": localStorage.getItem('levelMode') == "pegawai" ? localStorage.getItem('userRef') : null,
                            "tanggal": dateNow,
                            "absen_keluar": timeNow,
                            "keterangan": keterangan,
                        })
                    );
        
                    handler1.notifyObservers(response);
                    if (response.status === 200 || response.status === 500) {
                        const { status, message } = response;
        
                        if (status == 200) {
                            toast(message, { type: "success", autoClose: 2000 });
                            if (type == "masuk") {
                                setAbsenMasuk(`${dateNow} ${timeNow}`)
                            } else {
                                setAbsenKeluar(`${dateNow} ${timeNow}`)
                            }
                            setKeterangan("")
                            loadInfo()
                        } else if (status == 500) {
                            toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                        } else {
                            toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                        }
                    } else {
                        toast("Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                    }
                } catch (error: any) {
                    toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                    handler1.notifyObservers(error.message)
                } finally {
        
                }
            }   
        } catch (error:any) {
            toast(error.message ?? "error mendapatkan IP Address", { type: "error", autoClose: 2000 });
            handler1.notifyObservers(error.message)
        }
    }
    const loadCalendar = async () => {
        const response: any = await GetListCalendar(
            localStorage.getItem('levelMode')=="pegawai"? "nip":"nidn",
            localStorage.getItem('userRef'),
            getCurrentTime().format('YYYY')
        );
        if (response.status === 200 || response.status === 500) {
            const { status, message, list, log } = response;

            if (status == 200) {
                setListEvent(list);
            } else if (status == 500) {
                toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                handler1.notifyObservers(log)
            } else {
                toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                handler1.notifyObservers(message ?? "Terjadi masalah pada saat request ke server")
            }
        }
    }

    useEffect(() => {
        checkTime()
        const intervalCheck = setInterval(checkTime, 1000);
        loadAbsen()
        loadInfo()
        loadCalendar()

        return () => {
            clearInterval(intervalCheck);
        }
    }, []);

    useEffect(() => {
        checkLate()
        check8hour()

    }, [absenMasuk]);

    useEffect(() => {
        loadInfo()
        
    }, [activeTab]);

    const alertTerlambatTidakBisaAbsen = () => {
        if(messageBlockAbsent!=null && messageBlockAbsent!=""){
            return ["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"") ?
                <div className='col-span-12'>
                    <Alert className='border-transparent' color="red" variant='outline'>
                        {messageBlockAbsent}
                    </Alert>
                </div> : null
        }
        return isLate && ["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"") ?
            <div className='col-span-12'>
                <Alert className='border-transparent' color="red" variant='outline'>
                    anda telat masuk jam {timeAbsenString}
                </Alert>
            </div> : null
    }
    const alertMasuk = () => {
        let catatan = ""
        if (catatanTelat) {
            catatan = `dengan catatan telat "${catatanTelat}"`
        }

        return absenMasuk && ["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"") ?
            <div className='col-span-12'>
                <Alert className='border-transparent' color="blue" variant='outline'>
                    anda masuk jam {moment(absenMasuk).tz('Asia/Jakarta').format("HH:mm:ss")} {catatan}
                </Alert>
            </div> : null
    }
    const alertPulang = () => {
        let catatan = ""
        if (catatanPulang) {
            catatan = `dengan catatan pulang "${catatanTelat}"`
        }

        return absenKeluar && ["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"") ?
            <div className='col-span-12'>
                <Alert className='border-transparent' color="blue" variant='outline'>
                    anda pulang jam {moment(absenKeluar).tz('Asia/Jakarta').format("HH:mm:ss")} {catatan}
                </Alert>
            </div> : null
    }
    const keteranganComponent = () => {
        const output = [];

        if ( 
            absenMasuk!=null && absenKeluar==null &&( 
                (isLate && !eighthour) || (!isLate && !checkCurrentAbove15()) 
            ) 
        ) {
            output.push(
                <Label key="pulang-cepat" htmlFor="keterangan" className="font-bold">
                    Pulang cepat? Kasih tahu alasannya.
                </Label>
            );
        } else if (absenMasuk == null && !isBefore8AM) { //belum absen jam <=08:30
            output.push(
                <Label key="terlambat" htmlFor="keterangan" className="font-bold">
                    {isBefore8AM ? 'Masih belum terlambat, langsung absen sekarang' : 'Yah terlambat, kasih tahu alasannya'}
                </Label>
            );
        }

        console.log(absenMasuk,absenKeluar, isLate, eighthour, checkCurrentAbove15())
        if ( 
                (absenMasuk!=null && absenKeluar==null &&( 
                    (isLate && !eighthour) || (!isLate && !checkCurrentAbove15()) 
                )) || 
                ( absenMasuk == null && !isBefore8AM )
            ) {
            output.push(
                <Textarea
                    key="alasan"
                    name='alasan_khusus'
                    onChange={(e) => setKeterangan(e.target.value)}
                    value={keterangan}
                    placeholder={absenMasuk!=null && isLate ? 'Masukkan alasan pulang cepat...' : 'Masukkan alasan telat...'}
                    rows={8}
                />
            );
        }

        return <>{output}</>
    }
    return (
        <>
            <PageWrapper name='Home'>
                <Subheader className="flex flex-col">
                    <h3>{getInfoUser("nama")??"N/a"}</h3>
                    {
                        ["dosen", "pegawai", "sdm"].includes(localStorage.getItem('levelMode')??"")? 
                        <SubheaderLeft>
                            <div className='flex flex-wrap justify-center items-center rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
                                {Object.values(Periode).map((i) => (
                                    <Button
                                        key={i.text}
                                        {...(activeTab.text === i.text ? { ...activeProps } : { ...defaultProps })}
                                        onClick={() => {
                                            setActiveTab(i);
                                        }}>
                                        {i.text}
                                    </Button>
                                ))}
                            </div>
                        </SubheaderLeft> : null
                    }
                </Subheader>
                <Container>
                    <div className='grid grid-cols-12 gap-4'>
                        {alertTerlambatTidakBisaAbsen()}
                        {alertMasuk()}
                        {alertPulang()}
                        {
                            ["dosen", "pegawai", "sdm"].includes(localStorage.getItem('levelMode')??"")? 
                            <div className='col-span-12'>
                                <div className='grid grid-cols-12 gap-4'>
                                    <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
                                        <Card className={`h-full`}>
                                            <CardBody>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                                                        <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                                                    </div>
                                                    <div className='space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                                        <span className='font-semibold'>Absen Masuk</span>
                                                    </div>
                                                    <div className='text-4xl font-semibold'>{info?.absen?.masuk??0}</div>
                                                    <div className='flex flex-wrap gap-2'>
                                                        <CardBadgeInfo status="waiting" value={info?.absen?.lebih_8jam??0}>&ge;8 Jam Kerja</CardBadgeInfo>
                                                        <CardBadgeInfo status="reject" value={info?.absen?.kurang_8jam??0}>&lt;7 Jam Kerja</CardBadgeInfo>
                                                        <CardBadgeInfo status="success" value={info?.absen?.tepat_waktu??0}>Tepat Waktu</CardBadgeInfo>
                                                        <CardBadgeInfo status="reject" value={info?.absen?.telat??0}>Telat</CardBadgeInfo>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
                                        <Card className={`h-full`}>
                                            <CardBody>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                                                        <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                                                    </div>
                                                    <div className='space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                                        <span className='font-semibold'>Tidak Masuk</span>
                                                    </div>
                                                    <div className='text-4xl font-semibold'>{info?.absen?.tidak_masuk??0}</div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
                                        <Card className={`h-full`}>
                                            <CardBody>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                                                        <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                                                    </div>
                                                    <div className='space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                                        <span className='font-semibold'>Izin</span>
                                                    </div>
                                                    <div className='text-4xl font-semibold'>{info?.izin?.total??0}</div>
                                                    <div className='flex flex-wrap gap-2'>
                                                        <CardBadgeInfo status="waiting" value={info?.izin?.menunggu??0}>Menunggu</CardBadgeInfo>
                                                        <CardBadgeInfo status="reject" value={info?.izin?.tolak??0}>Tolak</CardBadgeInfo>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
                                        <Card className={`h-full`}>
                                            <CardBody>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                                                        <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                                                    </div>
                                                    <div className='space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                                        <span className='font-semibold'>Cuti</span>
                                                    </div>
                                                    <div className='text-4xl font-semibold'>{info?.cuti?.total??0}</div>
                                                    <div className='flex flex-wrap gap-2'>
                                                        <CardBadgeInfo status="waiting" value={info?.cuti?.menunggu??0}>Menunggu</CardBadgeInfo>
                                                        <CardBadgeInfo status="reject" value={info?.cuti?.tolak??0}>Tolak</CardBadgeInfo>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
                                        <Card className={`h-full`}>
                                            <CardBody>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                                                        <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                                                    </div>
                                                    <div className='space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                                        <span className='font-semibold'>SPPD</span>
                                                    </div>
                                                    <div className='text-4xl font-semibold'>0</div>
                                                    <div className='flex flex-wrap gap-2'>
                                                        <CardBadgeInfo status="waiting" value={0}>Menunggu</CardBadgeInfo>
                                                        <CardBadgeInfo status="reject" value={0}>Tolak</CardBadgeInfo>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </div> : null
                        }
                        {
                            ["dosen", "pegawai"].includes(localStorage.getItem('levelMode')??"") && !disableAbsen ?
                                <>
                                    <div className='col-span-12 2xl:col-span-4'>
                                        <div className='grid h-full grid-cols-12 gap-4'>
                                            <div className='col-span-12 h-full'>
                                                <Card>
                                                    <CardBody className="flex flex-col">
                                                        {keteranganComponent()}
                                                        {
                                                            absenMasuk == null || absenKeluar == null ?
                                                                <button
                                                                    disabled={disableAbsen}
                                                                    type='button'
                                                                    onClick={() => absenHandler(absenMasuk == null ? "masuk" : "keluar")}
                                                                    className={classNames(
                                                                        'group flex w-full cursor-pointer items-center justify-center rounded-xl p-4 mt-2',
                                                                        {
                                                                            'bg-lime-600 hover:bg-lime-500 hover:dark:bg-lime-800 text-white': isBefore8AM && absenMasuk == null,
                                                                            'bg-amber-600 hover:bg-amber-500 hover:dark:bg-amber-800 text-white': !isBefore8AM && absenMasuk == null,
                                                                            'bg-blue-600 hover:bg-blue-500 hover:dark:bg-blue-800 text-white': absenMasuk != null && absenKeluar == null,
                                                                        },
                                                                        themeConfig.transition,
                                                                    )}>
                                                                    {absenMasuk == null ? "Absen Masuk" : "Absen Keluar"}
                                                                </button> :
                                                                <div className='col-span-6 flex flex-col items-center justify-center'>
                                                                    <img src={DeliveryMan5WithDog as string} alt='' className='max-h-[32rem]' />
                                                                    <p className="text-xl font-bold">Anda sudah pulang kantor</p>
                                                                </div>
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-span-12 2xl:col-span-8'>
                                        <CalendarView source={listEvent}></CalendarView>
                                    </div>
                                </> : 
                                <div className='col-span-12'>
                                    <CalendarView source={listEvent}></CalendarView>
                                </div>
                        }
                    </div>
                </Container>
            </PageWrapper>
        </>
    );
};

export default HomePage;