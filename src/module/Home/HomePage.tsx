import { useNavigate } from "react-router-dom";
import Container from "../../components/layouts/Container/Container";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft } from "../../components/layouts/Subheader/Subheader";
import Card, { CardBody } from "../../components/ui/Card";
import { useAppDispatch } from "../redux/hooks";
import Icon from "../../components/icon/Icon";
import CardBadgeInfo from "../component/CardBadgeInfo";
import Button, { IButtonProps } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import Periode, { TPeriod } from "../Enum/Periode";
import CalendarView from "../component/CalendarView";
import classNames from "classnames";
import themeConfig from "../../config/theme.config";
import moment from "moment";
import 'moment-timezone';
import { DeliveryMan5WithDog } from "../../assets/images";
import Alert from "../../components/ui/Alert";
import { GetAbsen } from "../repo/GetAbsen";
import { toast } from "react-toastify";
import useLevelMode from "../../hooks/useLevelMode";
import { CreateAbsentMasuk } from "../repo/CreateAbsentMasuk";
import { CreateAbsentKeluar } from "../repo/CreateAbsentKeluar";
import { HandlerObserver } from "../abstract/HandlerObserver";
import { ConsoleObserver } from "../IO/ConsoleObserver";
import Label from "../../components/form/Label";
import Textarea from "../../components/form/Textarea";
import { idea } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { GetInfo } from "../repo/GetInfo";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState<TPeriod>(Periode.HARI);
    const [isBefore8AM, setIsBefore8AM] = useState<boolean>(false);
    const [is8hour, set8hour] = useState<boolean>(false);
    const [isLate, setIsLate] = useState<boolean>(false);

    const [keterangan, setKeterangan] = useState<any>("");
    const [catatanTelat, setCatatanTelat] = useState<any>(null);
    const [catatanPulang, setCatatanPulang] = useState<any>(null);
    const [absenMasuk, setAbsenMasuk] = useState<any>(null);
    const [absenKeluar, setAbsenKeluar] = useState<any>(null);
    const [disableAbsen, setDisableAbsen] = useState<boolean>(true);
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
    const { levelMode } = useLevelMode();
    const dateNow = new Date().toISOString().slice(0, 10);

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


    const checkTime = () => {
        const currentTime = moment().tz('Asia/Jakarta');
        const checkBefore8AM = currentTime.isBefore(currentTime.clone().startOf('day').add(8, 'hours'));
        setIsBefore8AM(checkBefore8AM);
    }
    const check8hour = () => {
        const masuk = moment(absenMasuk).tz('Asia/Jakarta')
        const check = masuk.isAfter(masuk.startOf('day').add(8, 'hours'));
        set8hour(check);
    }
    const checkLate = () => {
        const currentTime = (absenMasuk == null ? moment() : moment(absenMasuk)).tz('Asia/Jakarta');
        const absenMasukTime = moment("08:00", 'HH:mm').tz('Asia/Jakarta');
        const checkLate = currentTime.isAfter(absenMasukTime);
        setIsLate(checkLate);
    }
    const loadAbsen = async () => {
        if (!["dosen", "karyawan"].includes(levelMode)) {
            console.log("loadAbsen hanya berjalan untuk karyawan dan dosen hukan ")
        } else {
            const response: any = await GetAbsen(dateNow, levelMode == "dosen" ? localStorage.getItem('userRef') : null, levelMode == "karyawan" ? localStorage.getItem('userRef') : null);
            if (response.status !== 200) {
                toast(response.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
                throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
            }

            if (response.status === 200 || response.status === 500) {
                const { status, message, data, log } = response;

                if (status == 200) {
                    setAbsenMasuk(data.absen_masuk)
                    setAbsenKeluar(data.absen_keluar)
                    setCatatanTelat(data.catatan_telat)
                    setCatatanPulang(data.catatan_pulang)
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
        }
    }
    const loadInfo = async () => {
        if (!["dosen", "karyawan"].includes(levelMode)) {
            console.log("loadInfo hanya berjalan untuk karyawan dan dosen hukan ")
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
                levelMode == "dosen" ? localStorage.getItem('userRef') : null,
                levelMode == "karyawan" ? localStorage.getItem('userRef') : null,
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
            const timeNow = new Date().toISOString().split('T')[1].slice(0, 8)
            const response: any = (type == "masuk" ?
                await CreateAbsentMasuk({
                    "nidn": levelMode == "dosen" ? localStorage.getItem('userRef') : null,
                    "nip": levelMode == "karyawan" ? localStorage.getItem('userRef') : null,
                    "tanggal": dateNow,
                    "absen_masuk": timeNow,
                    "keterangan": keterangan,
                }) :
                await CreateAbsentKeluar({
                    "nidn": levelMode == "dosen" ? localStorage.getItem('userRef') : null,
                    "nip": levelMode == "karyawan" ? localStorage.getItem('userRef') : null,
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
                        setAbsenMasuk(new Date().toISOString())
                    } else {
                        setAbsenKeluar(new Date().toISOString())
                    }
                    setKeterangan("")
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

    useEffect(() => {
        checkTime()
        const interval = setInterval(checkTime, 1000);
        loadAbsen()
        loadInfo()

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        checkLate()
        check8hour()

    }, [absenMasuk]);

    useEffect(() => {
        loadInfo()
        
    }, [activeTab]);

    const alertTerlambat = () => {
        return isLate && ["dosen", "karyawan"].includes(levelMode) ?
            <div className='col-span-12'>
                <Alert className='border-transparent' color="red" variant='outline'>
                    anda telat masuk jam 08:00
                </Alert>
            </div> : null
    }
    const alertMasuk = () => {
        return absenMasuk && ["dosen", "karyawan"].includes(levelMode) ?
            <div className='col-span-12'>
                <Alert className='border-transparent' color="blue" variant='outline'>
                    anda masuk jam {moment(absenMasuk).tz('Asia/Jakarta').format("HH:mm")}
                </Alert>
            </div> : null
    }
    const alertPulang = () => {
        let catatan = ""
        if (catatanTelat && catatanPulang) {
            catatan = `dengan catatan telat ${catatanTelat} dan pulang cepat karena ${catatanPulang}`
        } else if (catatanTelat) {
            catatan = `dengan catatan telat ${catatanTelat}`
        } else if (catatanPulang) {
            catatan = `dengan catatan pulang ${catatanTelat}`
        }

        return absenKeluar && ["dosen", "karyawan"].includes(levelMode) ?
            <div className='col-span-12'>
                <Alert className='border-transparent' color="blue" variant='outline'>
                    anda pulang jam {moment(absenKeluar).tz('Asia/Jakarta').format("HH:mm")} {catatan}
                </Alert>
            </div> : null
    }
    const keteranganComponent = () => {
        const output = [];

        if (absenMasuk && absenKeluar == null) {
            output.push(
                <Label key="pulang-cepat" htmlFor="keterangan" className="font-bold">
                    Pulang cepat? Kasih tahu alasannya.
                </Label>
            );
        } else if (absenMasuk == null && !isBefore8AM) {
            output.push(
                <Label key="terlambat" htmlFor="keterangan" className="font-bold">
                    {isBefore8AM ? 'Masih belum terlambat, langsung absen sekarang' : 'Yah terlambat, kasih tahu alasannya'}
                </Label>
            );
        }

        if ((is8hour && absenKeluar == null) || (isLate && absenMasuk == null)) {
            output.push(
                <Textarea
                    key="alasan"
                    name='alasan_khusus'
                    onChange={(e) => setKeterangan(e.target.value)}
                    value={keterangan}
                    placeholder={isBefore8AM ? 'Masukkan alasan pulang cepat...' : 'Masukkan alasan telat...'}
                    rows={8}
                />
            );
        }

        return <>{output}</>
    }
    return (
        <>
            <PageWrapper name='Home'>
                <Subheader>
                    <SubheaderLeft>
                        <div className='flex rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
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
                    </SubheaderLeft>
                </Subheader>
                <Container>
                    <div className='grid grid-cols-12 gap-4'>
                        {alertTerlambat()}
                        {alertMasuk()}
                        {alertPulang()}
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
                                                <div className='text-4xl font-semibold'>{info.absen.masuk}</div>
                                                <div className='flex flex-wrap gap-2'>
                                                    <CardBadgeInfo status="waiting" value={info.absen.lebih_8jam}>&ge;8 Jam Kerja</CardBadgeInfo>
                                                    <CardBadgeInfo status="reject" value={info.absen.kurang_8jam}>&lt;7 Jam Kerja</CardBadgeInfo>
                                                    <CardBadgeInfo status="success" value={info.absen.tepat_waktu}>Tepat Waktu</CardBadgeInfo>
                                                    <CardBadgeInfo status="reject" value={info.absen.telat}>Telat</CardBadgeInfo>
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
                                                <div className='text-4xl font-semibold'>{info.absen.tidak_masuk}</div>
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
                                                <div className='text-4xl font-semibold'>{info.izin.total}</div>
                                                <div className='flex flex-wrap gap-2'>
                                                    <CardBadgeInfo status="waiting" value={info.izin.menunggu}>Menunggu</CardBadgeInfo>
                                                    <CardBadgeInfo status="reject" value={info.izin.tolak}>Tolak</CardBadgeInfo>
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
                                                <div className='text-4xl font-semibold'>{info.cuti.total}</div>
                                                <div className='flex flex-wrap gap-2'>
                                                    <CardBadgeInfo status="waiting" value={info.cuti.menunggu}>Menunggu</CardBadgeInfo>
                                                    <CardBadgeInfo status="reject" value={info.cuti.tolak}>Tolak</CardBadgeInfo>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        {
                            ["dosen", "karyawan"].includes(levelMode) ?
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
                                        <CalendarView></CalendarView>
                                    </div>
                                </> : null
                        }
                    </div>
                </Container>
            </PageWrapper>
        </>
    );
};

export default HomePage;