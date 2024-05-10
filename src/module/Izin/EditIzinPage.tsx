import { useFormik } from 'formik';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import Breadcrumb from '@/components/layouts/Breadcrumb/Breadcrumb';
import Container from '@/components/layouts/Container/Container';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { TInputTypes } from '@/types/input.type';
import SelectReact from '@/components/form/SelectReact';
import Textarea from '@/components/form/Textarea';
import * as Yup from 'yup';
import Validation from '@/components/form/Validation';
import { useEffect, useRef, useState } from 'react';
import { HandlerObserver } from '@/module/abstract/HandlerObserver';
import { AlertObserver } from '@/module/IO/AlertObserver';
import { ConsoleObserver } from '@/module/IO/ConsoleObserver';
import { useNavigate, useParams } from 'react-router-dom';
import { JenisIzinModel } from '@/module/model/JenisIzinModel';
import { izinselector, editIzin, loadListJenisIzin } from '@/module/redux/izinSlice';
import { GetListJenisIzin } from '@/module/repo/GetListJenisIzin';
import { useAppSelector, useAppDispatch } from '@/module/redux/hooks';
import { SelectOptionsAdapter } from '@/module/IO/SelectOptionsAdapter';
import { IzinModel } from '@/module/model/IzinModel';
import { GetIzin } from '@/module/repo/GetIzin';
import { UpdateIzin } from '@/module/repo/UpdateIzin';
import useLevelMode from '@/hooks/useLevelMode';
import { toast } from 'react-toastify';

const EditIzinPage = () => {
	const { id } = useParams();
	const { levelMode } = useLevelMode();
	const navigate = useNavigate();
	const FILE_SIZE = 1024 * 1024 * 10; // 10 MB
	const SUPPORTED_FORMATS = ['application/pdf','image/jpeg','image/jpg','image/png'];
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const fileRef = useRef(null);
	const selectorIzin = useAppSelector(izinselector);
	const dispatch = useAppDispatch();
	const [izin, setIzin] = useState<IzinModel|null>(null);

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const loadJenisIzin = async () => {
		try {
			const response: any = await GetListJenisIzin();
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, list, log } = response;

				if (status == 200) {
					const listJenisIzin = list.map((item: any) =>
						new JenisIzinModel(
							item.id,
							item.nama
						)
					)

					await dispatch(loadListJenisIzin(listJenisIzin));
				} else if (status == 500) {
					handler1.notifyObservers(log)
					toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				} else {
					handler1.notifyObservers(log)
					toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				}
			}   
		} catch (error:any) {
			toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
			throw error;
		}
	};
	const loadIzin = async (id:any) => {
		try {
			const response: any = await GetIzin(id);
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, data, log } = response;

				if (status == 200) {
					const izinParse = new IzinModel(
						data.id,
						data.tanggal_pengajuan,
						new JenisIzinModel(
							data.JenisIzin?.id,
							data.JenisIzin?.nama,
						),
						data.tujuan,
						data.dokumen,
						data.status,
					);
					setIzin(izinParse)
					await dispatch(editIzin(izinParse));
				} else if (status == 500) {
					handler1.notifyObservers(log)
					toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				} else {
					handler1.notifyObservers(log)
					toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				}
			}   
		} catch (error:any) {
			toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
			throw error;
		}
	}

	function isValidURL(string:any) 
        {
            if(typeof string === 'string' || string instanceof String){
				var res = string.match(`(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-
				]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]
				\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|w
				ww\.[a-zA-Z0-9]+\.[^\s]{2,})`);
				return (res !== null);
			}
			return true
    };

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			tanggal_pengajuan: "",
			jenis_izin: "",
			tujuan_izin: "",
			dokumen: null,
		},
		validationSchema: Yup.object({
			tanggal_pengajuan: Yup.date().required("this is required"),
			tujuan_izin: Yup.string().required("this is required"),
			jenis_izin: Yup.mixed().test(
				'is-selected',
				'Jenis izin harus dipilih',
				(value: any) => {
					return !(value == undefined || value == "");
				}
			),
			dokumen: Yup.mixed().nullable().optional().test(
				'required',
				'this is required',
				(value: any) => {
					return !(value == undefined || value == "")
				}
			).test(
				'10mb',
				'this is max 10mb',
				(value: any) => {
					return value==null || !(value.size > FILE_SIZE)
				}
			).test(
				'type',
				`this is support ${SUPPORTED_FORMATS.join(",")} only`,
				(value: any) => {
					return (value==null) || isValidURL(value) || SUPPORTED_FORMATS.includes(value.type)
				}
			),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				let form = null
				if(value.dokumen==null){
					if(levelMode == "pegawai"){
						form = {
							id:id,
							nip: localStorage.getItem('userRef') ?? "-",
							tanggal_pengajuan: value.tanggal_pengajuan,
							tujuan: value.tujuan_izin,
							jenis_izin: value.jenis_izin,
							dokumen: value.dokumen
						}
					} else{
						form = {
							id:id,
							nidn: localStorage.getItem('userRef') ?? "-",
							tanggal_pengajuan: value.tanggal_pengajuan,
							tujuan: value.tujuan_izin,
							jenis_izin: value.jenis_izin,
							dokumen: value.dokumen
						}
					}
				} else{
					form = new FormData()
					form.append("id",String(id))
					if(levelMode == "pegawai"){
						form.append("nip",localStorage.getItem('userRef') ?? "-")
					} else{
						form.append("nidn",localStorage.getItem('userRef') ?? "-")
					}
					form.append("tanggal_pengajuan",value.tanggal_pengajuan)
					form.append("tujuan",value.tujuan_izin)
					form.append("jenis_izin",value.jenis_izin)
					form.append("dokumen",value.dokumen)
				}

				const response: any = await UpdateIzin(form);
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message, log } = response;

					if (status == 200) {
						toast(message, { type: "success", autoClose: 2000 });
						navigate(`/izin`)
					} else if (status == 500) {
						handler1.notifyObservers(log)
						toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
					} else {
						handler1.notifyObservers(log)
						toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
					}
				}   
			} catch (error:any) {
				toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				throw error;
			} finally {
				setDisableButton(false);
			}
			console.log(value)
		},
	});

	useEffect(() => {
		loadJenisIzin()
		loadIzin(id)

		console.log(SelectOptionsAdapter.adaptFromJenisIzin(selectorIzin.list_jenis_izin).filter((option:any) => option.value === formik.values.jenis_izin?.id ))
	}, [])

	useEffect(()=>{
		formik.setFieldValue("tanggal_pengajuan", izin?.tanggal??"")
		formik.setFieldValue("jenis_izin", izin?.jenis?.id)
		formik.setFieldValue("tujuan_izin", izin?.tujuan??"")
		formik.setFieldValue("dokumen", izin?.dokumen??"")
	},[izin])

	const handleFileChange = (event: any) => {
		if (event.currentTarget.files) {
			const files = event.currentTarget.files[0];
			console.log(files);
			formik.setFieldValue("dokumen", files);
		}
	};

	return (
		<PageWrapper name='Izin'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Tambah Izin' />
				</SubheaderLeft>
			</Subheader>
			<Container>
				<div className="col-span-6">
					<div
						id='borderWidth'
						className='scroll-mt-offset col-span-12 md:col-span-6'>
						<Card>
							<CardBody>
								<div className='grid gap-4'>
									<div key={"tanggal_pengajuan"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tanggal_pengajuan as boolean}
											invalidFeedback={formik.errors.tanggal_pengajuan as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tanggal_pengajuan"}>Tanggal Pengajuan</Label>
												<Input
													id={"tanggal_pengajuan"}
													name={"tanggal_pengajuan"}
													onChange={formik.handleChange}
													value={formik.values["tanggal_pengajuan"]}
													type={"date" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"jenis_izin"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.jenis_izin as boolean}
											invalidFeedback={formik.errors.jenis_izin as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"jenis_izin"}>Jenis Izin</Label>
												<SelectReact
													options={SelectOptionsAdapter.adaptFromJenisIzin(selectorIzin.list_jenis_izin)}
													id='jenis_izin'
													name='jenis_izin'
													value={SelectOptionsAdapter.adaptFromJenisIzin(selectorIzin.list_jenis_izin).filter((option:any) => option.value === formik.values.jenis_izin )}
													onChange={(selected: any) => {
														const jenisIzin: JenisIzinModel = selectorIzin.list_jenis_izin.filter(jenisIzin => jenisIzin.id == selected.value)[0];
														formik.setFieldValue('jenis_izin', selected.value)
													}}
												/>
											</>
										</Validation>
									</div>
									<div key={"tujuan_izin"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tujuan_izin as boolean}
											invalidFeedback={formik.errors.tujuan_izin as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tujuan_izin"}>Tujuan</Label>
												<Textarea
													id='tujuan_izin'
													name='tujuan_izin'
													onChange={formik.handleChange}
													value={formik.values.tujuan_izin}
													placeholder='masukkan tujuan izin...'
													rows={8} />
											</>
										</Validation>
									</div>
									<div key={"dokumen"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.dokumen as boolean}
											invalidFeedback={formik.errors.dokumen as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"dokumen"}>Dokumen</Label>
												<Input
													id={"dokumen"}
													name={"dokumen"}
													ref={fileRef}
													onChange={handleFileChange}
													// @ts-ignore
													// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
													type={"file" as TInputTypes}
												/>
												{
													formik.values.dokumen?.name||formik.values.dokumen ? <div className="bg-blue-50 border-b border-blue-400 text-blue-800 text-sm p-4 flex justify-between">
														<div className="flex items-center">
															<p>
																{formik.values.dokumen?.name||formik.values.dokumen}
															</p>
														</div>
														<div>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-6 w-6"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																onClick={() => formik.setFieldValue("dokumen", null)}>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M6 18L18 6M6 6l12 12"
																/>
															</svg>
														</div>
													</div> : <></>
												}
											</>
										</Validation>
									</div>
									<div key={"end"} className='col-span-12 lg:col-span-4'>
										<Button variant='solid' icon='HeroPlus' isDisable={disableButton} onClick={() => formik.handleSubmit()}>
											Simpan
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default EditIzinPage;