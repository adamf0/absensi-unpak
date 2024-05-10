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
import { JenisCutiModel } from '@/module/model/JenisCutiModel';
import { cutiselector, editCuti, loadListJenisCuti } from '@/module/redux/cutiSlice';
import { GetListJenisCuti } from '@/module/repo/GetListJenisCuti';
import { useAppSelector, useAppDispatch } from '@/module/redux/hooks';
import { SelectOptionsAdapter } from '@/module/IO/SelectOptionsAdapter';
import { CutiModel } from '@/module/model/CutiModel';
import { GetCuti } from '@/module/repo/GetCuti';
import { UpdateCuti } from '@/module/repo/UpdateCuti';
import useLevelMode from '@/hooks/useLevelMode';
import { toast } from 'react-toastify';

const EditCutiPage = () => {
	const { id } = useParams();
	const { levelMode } = useLevelMode();
	const navigate = useNavigate();
	const FILE_SIZE = 1024 * 1024 * 10; // 10 MB
	const SUPPORTED_FORMATS = ['application/pdf','image/jpeg','image/jpg','image/png'];
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const fileRef = useRef(null);
	const selectorCuti = useAppSelector(cutiselector);
	const dispatch = useAppDispatch();
	const [min, setMin] = useState<any>(1);
	const [max, setMax] = useState<any>(1);
	const [dokumen, setDokumen] = useState<any>(false);
	const [cuti, setCuti] = useState<CutiModel|null>(null);

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const loadJenisCuti = async () => {
		try {
			const response: any = await GetListJenisCuti();
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, list, log } = response;

				if (status == 200) {
					const listJenisCuti = list.map((item: any) =>
						new JenisCutiModel(
							item.id,
							item.nama,
							item.min,
							item.max,
							item.dokumen,
							item.kondisi,
						)
					)

					await dispatch(loadListJenisCuti(listJenisCuti));
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
	const loadCuti = async (id:any) => {
		try {
			const response: any = await GetCuti(id);
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, data, log } = response;

				if (status == 200) {
					const cutiParse = new CutiModel(
						data.id,
						data.tanggal_pengajuan,
						data.lama_cuti,
						new JenisCutiModel(
							data.JenisCuti?.id,
							data.JenisCuti?.nama,
							data.JenisCuti?.min,
							data.JenisCuti?.max,
							data.JenisCuti?.dokumen,
							data.JenisCuti?.kondisi
						),
						data.tujuan,
						data.dokumen,
						data.status,
					);
					setCuti(cutiParse)
					setMin(parseInt(data.JenisCuti?.min))
					setMax(parseInt(data.JenisCuti?.max))
					await dispatch(editCuti(cutiParse));
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
			jenis_cuti: "",
			lama_cuti: "",
			tujuan_cuti: "",
			dokumen: null,
		},
		validationSchema: Yup.object({
			tanggal_pengajuan: Yup.date().required("this is required"),
			lama_cuti: Yup.number()
				.typeError("must be a number")
				.min(1, "this must be at least 1 day")
				.required("this is required"),
			tujuan_cuti: Yup.string().required("this is required"),
			jenis_cuti: Yup.mixed().test(
				'is-selected',
				'Jenis cuti harus dipilih',
				(value: any) => {
					return !(value == undefined || value == "");
				}
			),
			dokumen: Yup.mixed().nullable().optional().test(
				'required',
				'this is required',
				(value: any) => {
					return (dokumen? !(value == undefined || value == ""):true)
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
					return (value==null) || isValidURL(value) || (SUPPORTED_FORMATS.includes(value.type) || dokumen)
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
							nip: levelMode == "pegawai" ? localStorage.getItem('userRef') : null,
							tanggal_pengajuan: value.tanggal_pengajuan,
							lama_cuti: value.lama_cuti,
							tujuan: value.tujuan_cuti,
							jenis_cuti: value.jenis_cuti,
							dokumen: value.dokumen
						}
					} else{
						form = {
							id:id,
							nidn: levelMode == "dosen" ? localStorage.getItem('userRef') : null,
							tanggal_pengajuan: value.tanggal_pengajuan,
							lama_cuti: value.lama_cuti,
							tujuan: value.tujuan_cuti,
							jenis_cuti: value.jenis_cuti,
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
					form.append("lama_cuti",value.lama_cuti)
					form.append("tujuan",value.tujuan_cuti)
					form.append("jenis_cuti",value.jenis_cuti)
					form.append("dokumen",value.dokumen)
				}
				const response: any = await UpdateCuti(form);
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message, log } = response;

					if (status == 200) {
						toast(message, { type: "success", autoClose: 2000 });
						navigate(`/cuti`)
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
		loadJenisCuti()
		loadCuti(id)

		console.log(SelectOptionsAdapter.adaptFromJenisCuti(selectorCuti.list_jenis_cuti).filter((option:any) => option.value === formik.values.jenis_cuti?.id ))
	}, [])

	useEffect(()=>{
		formik.setFieldValue("tanggal_pengajuan", cuti?.tanggal??"")
		formik.setFieldValue("jenis_cuti", cuti?.jenis?.id)
		formik.setFieldValue("lama_cuti", cuti?.lama??"")
		formik.setFieldValue("tujuan_cuti", cuti?.tujuan??"")
		formik.setFieldValue("dokumen", cuti?.dokumen??"")
	},[cuti])

	const handleFileChange = (event: any) => {
		if (event.currentTarget.files) {
			const files = event.currentTarget.files[0];
			console.log(files);
			formik.setFieldValue("dokumen", files);
		}
	};

	return (
		<PageWrapper name='Cuti'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Ubah Cuti' />
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
									<div key={"jenis_cuti"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.jenis_cuti as boolean}
											invalidFeedback={formik.errors.jenis_cuti as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"jenis_cuti"}>Jenis Cuti</Label>
												<SelectReact
													options={SelectOptionsAdapter.adaptFromJenisCuti(selectorCuti.list_jenis_cuti)}
													id='jenis_cuti'
													name='jenis_cuti'
													value={SelectOptionsAdapter.adaptFromJenisCuti(selectorCuti.list_jenis_cuti).filter((option:any) => option.value === formik.values.jenis_cuti )}
													onChange={(selected: any) => {
														const jenisCuti: JenisCutiModel = selectorCuti.list_jenis_cuti.filter(jenisCuti => jenisCuti.id == selected.value)[0];
														setMin(parseInt(jenisCuti.min))
														setMax(parseInt(jenisCuti.max))
														setDokumen(jenisCuti.dokumen)
														formik.setFieldValue("dokumen", !jenisCuti.dokumen? null:selectorCuti.editCuti?.dokumen)
														formik.setFieldValue('jenis_cuti', selected.value)
													}}
												/>
											</>
										</Validation>
									</div>
									<div key={"lama_cuti"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.lama_cuti as boolean}
											invalidFeedback={formik.errors.lama_cuti as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"lama_cuti"}>Lama Cuti</Label>
												<Input
													id={"lama_cuti"}
													name={"lama_cuti"}
													onChange={formik.handleChange}
													min={min}
													max={max}
													// @ts-ignore
													// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
													value={formik.values["lama_cuti"]}
													type={"number" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"tujuan_cuti"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tujuan_cuti as boolean}
											invalidFeedback={formik.errors.tujuan_cuti as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tujuan_cuti"}>Tujuan</Label>
												<Textarea
													id='tujuan_cuti'
													name='tujuan_cuti'
													onChange={formik.handleChange}
													value={formik.values.tujuan_cuti}
													placeholder='masukkan tujuan cuti...'
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

export default EditCutiPage;