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
import { claimAbsenselector, editClaimAbsen, loadListAbsen } from '@/module/redux/claimAbsenSlice';
import { useAppSelector, useAppDispatch } from '@/module/redux/hooks';
import { SelectOptionsAdapter } from '@/module/IO/SelectOptionsAdapter';
import useLevelMode from '@/hooks/useLevelMode';
import { toast } from "react-toastify";
import { AbsenModel } from '@/module/model/AbsenModel';
import { GetListAbsen } from '@/module/repo/GetListAbsen';
import { GetClaimAbsen } from '@/module/repo/GetClaimAbsen';
import { ClaimAbsenModel } from '@/module/model/ClaimAbsenModel';
import moment from 'moment';
import { UpdateClaimAbsen } from '@/module/repo/UpdateClaimAbsen';

const EditClaimAbsenPage = () => {
	const { id } = useParams();
	const { levelMode } = useLevelMode();
	const navigate = useNavigate();
	const FILE_SIZE = 1024 * 1024 * 10; // 10 MB
	const SUPPORTED_FORMATS = ['application/pdf','image/jpeg','image/jpg','image/png'];
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const fileRef = useRef(null);
	const selectorClaimAbsen = useAppSelector(claimAbsenselector);
	const [claimAbsen, setClaimAbsen] = useState<ClaimAbsenModel|null>(null);
	const dispatch = useAppDispatch();

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const loadAbsen = async () => {
		try {
			const response: any = await GetListAbsen(
				levelMode == "dosen" ? localStorage.getItem('userRef') : null,
                levelMode == "pegawai" ? localStorage.getItem('userRef') : null,
			);
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, list, log } = response;

				if (status == 200) {
					const listAbsen = list.map((item: any) =>
						new AbsenModel(
							item.id,
							item.nidn,
							item.nip,
							item.tanggal,
							item.absen_masuk,
							item.absen_keluar,
							item.otomatis_keluar? 1:0,
						)
					)
					const listAbsenAutoFilter = listAbsen.filter((item:AbsenModel)=>item.otomatis_keluar==1)

					await dispatch(loadListAbsen(listAbsenAutoFilter));
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
	const loadClaimAbsen = async (id:any) => {
		try {
			const response: any = await GetClaimAbsen(id);
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, data, log } = response;

				if (status == 200) {
					const claimAbsenParse = new ClaimAbsenModel(
						data.id,
						new AbsenModel(
							data.Absen?.id ?? "",
							data.Absen?.nidn,
							data.Absen?.nip,
							moment(data.Absen?.tanggal ?? "").locale('id-ID').format("dddd, DD MMMM YYYY"),
							moment(data.Absen?.absen_masuk ?? "").locale('id-ID').format("HH:mm:ss"),
							moment(data.Absen?.absen_keluar ?? "").locale('id-ID').format("HH:mm:ss"),
							data.Absen?.otomatis_keluar ?? false,
						),
						data.catatan,
						data.dokumen,
						data.perbaikan_absen_masuk,
                        data.perbaikan_absen_keluar,
						data.status,
					);
					setClaimAbsen(claimAbsenParse)
					await dispatch(editClaimAbsen(claimAbsenParse));
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
			absenId: "",
			catatan: "",
			absen_masuk: "",
			absen_keluar: "",
			dokumen: null,
		},
		validationSchema: Yup.object({
			absenId: Yup.mixed().test(
				'is-selected',
				'absen harus dipilih',
				(value: any) => {
					return !(value == undefined || value == "");
				}
			),
			catatan: Yup.mixed().nullable().optional(),
			absen_masuk: Yup.mixed().nullable().optional(),
			absen_keluar: Yup.mixed().nullable().optional(),
			dokumen: Yup.mixed().nullable().optional().test(
				'required',
				'this is required',
				(value: any) => {
					console.log(value);
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
					return value==null || isValidURL(value) || SUPPORTED_FORMATS.includes(value.type)
				}
			),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				let form = null
				if(value.dokumen==null){
					form = {
						id: id,
						absenId: value.absenId,
						catatan: value.catatan,
						absen_masuk: value.absen_masuk,
						absen_keluar: value.absen_keluar,
						dokumen: value.dokumen
					}
				} else{
					form = new FormData()
					form.append("id",String(id))
					form.append("absenId",value.absenId)
					form.append("catatan",value.catatan)
					form.append("absen_masuk",value.absen_masuk)
					form.append("absen_keluar",value.absen_keluar)
					form.append("dokumen",value.dokumen)
				}

				const response: any = await UpdateClaimAbsen(form);
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message, log } = response;

					if (status == 200) {
						toast(message, { type: "success", autoClose: 2000 });
						navigate(`/claim_absen`)
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
		loadAbsen()
		loadClaimAbsen(id)
	}, [])

	useEffect(()=>{
		formik.setFieldValue("absenId", claimAbsen?.absen?.id??"")
		formik.setFieldValue("catatan", claimAbsen?.catatan??"")
		formik.setFieldValue("absen_masuk", claimAbsen?.absen_masuk??"")
		formik.setFieldValue("absen_keluar", claimAbsen?.absen_keluar??"")
		formik.setFieldValue("dokumen", claimAbsen?.dokumen??"")
	},[claimAbsen])

	const handleFileChange = (event: any) => {
		if (event.currentTarget.files) {
			const files = event.currentTarget.files[0];
			console.log(files);
			formik.setFieldValue("dokumen", files);
		}
	};

	return (
		<PageWrapper name='Claim Lupa Absen Keluar'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Ubah Claim Lupa Absen Keluar' />
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
								<div key={"absenId"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.absenId as boolean}
											invalidFeedback={formik.errors.absenId as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"absenId"}>Absen</Label>
												<SelectReact
													options={SelectOptionsAdapter.adaptFromAbsen(selectorClaimAbsen.list_absen)}
													id='absenId'
													name='absenId'
													value={SelectOptionsAdapter.adaptFromAbsen(selectorClaimAbsen.list_absen).filter((option:any) => option.value === formik.values.absenId )}
													onChange={(selected: any) => {
														console.log(selected.value)
														formik.setFieldValue('absenId', selected.value)
													}}
												/>
											</>
										</Validation>
									</div>
									<div key={"absen_masuk"} className='col-span-12 lg:col-span-2'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.absen_masuk as boolean}
											invalidFeedback={formik.errors.absen_masuk as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"absen_masuk"}>Absen Masuk</Label>
												<Input
													id={"absen_masuk"}
													name={"absen_masuk"}
													onChange={formik.handleChange}
													// @ts-ignore
													// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
													value={formik.values["absen_masuk"]}
													type={"time" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"absen_keluar"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.absen_keluar as boolean}
											invalidFeedback={formik.errors.absen_keluar as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"absen_keluar"}>Absen Keluar</Label>
												<Input
													id={"absen_keluar"}
													name={"absen_keluar"}
													onChange={formik.handleChange}
													// @ts-ignore
													// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
													value={formik.values["absen_keluar"]}
													type={"time" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"catatan"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.catatan as boolean}
											invalidFeedback={formik.errors.catatan as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"catatan"}>Catatan</Label>
												<Textarea
													id='catatan'
													name='catatan'
													onChange={formik.handleChange}
													value={formik.values.catatan}
													placeholder='masukkan catatan...'
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

export default EditClaimAbsenPage;