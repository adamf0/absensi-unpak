import { useFormik } from 'formik';
import Input from '../../components/form/Input';
import Label from '../../components/form/Label';
import Breadcrumb from '../../components/layouts/Breadcrumb/Breadcrumb';
import Container from '../../components/layouts/Container/Container';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft } from '../../components/layouts/Subheader/Subheader';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import { TInputTypes } from '../../types/input.type';
import SelectReact from '../../components/form/SelectReact';
import Textarea from '../../components/form/Textarea';
import * as Yup from 'yup';
import Validation from '../../components/form/Validation';
import { useEffect, useRef, useState } from 'react';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { CreateCuti } from '../repo/CreateCuti';
import { useNavigate } from 'react-router-dom';
import { JenisCuti } from '../model/JenisCuti';
import { cutiselector, loadListJenisCuti } from '../redux/cutiSlice';
import { GetListJenisCuti } from '../repo/GetListJenisCuti';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { SelectOptionsAdapter } from '../io/SelectOptionsAdapter';

const NewCutiPage = () => {
	const navigate = useNavigate();
	const FILE_SIZE = 1024 * 1024 * 10; // 10 MB
	const SUPPORTED_FORMATS = ['application/pdf'];
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const fileRef = useRef(null);
	const selectorCuti = useAppSelector(cutiselector);
	const dispatch = useAppDispatch();
	const [min, setMin] = useState<any>(1);
	const [max, setMax] = useState<any>(1);
	const [dokumen, setDokumen] = useState<any>(false);

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const loadJenisCuti = async () => {
		const response: any = await GetListJenisCuti();
		if (response.status !== 200) {
			throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
		}

		if (response.status === 200 || response.status === 500) {
			const { status, message, list } = response;

			if (status == 200) {
				const listJenisCuti = list.map((item: any) =>
					new JenisCuti(
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
				console.trace(message ?? "Terjadi masalah pada saat request ke server")
			} else {
				console.trace(message ?? "Terjadi masalah pada saat request ke server")
			}
		}
	};
	useEffect(() => {
		loadJenisCuti()
	}, [])

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
			dokumen: Yup.mixed().nullable().test(
				'required',
				'this is required',
				(value: any) => {
					console.log(value,dokumen);
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
					return value==null || (SUPPORTED_FORMATS.includes(value.type) || dokumen)
				}
			),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				const response: any = await CreateCuti({
					nidn: localStorage.getItem('userRef') ?? "-",
					tanggal_pengajuan: value.tanggal_pengajuan,
					lama_cuti: value.lama_cuti,
					tujuan: value.tujuan_cuti,
					jenis_cuti: value.jenis_cuti,
					dokumen: value.dokumen
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message } = response;

					if (status == 200) {
						// toast.update(toastId.current, { render:message, type: "success", autoClose: 5000 }); //not show
						alert(message);
						navigate(`/cuti`)
					} else if (status == 500) {
						alert(message ?? "terjadi masalah pada saat request ke server");
					} else {
						alert(message ?? "terjadi masalah pada saat request ke server");
					}
				} else {
					alert("terjadi masalah pada saat request ke server");
				}
			} catch (error: any) {
				// toast.update(toastId.current, { render:error.message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
				throw error;
			} finally {
				setDisableButton(false);
			}
			console.log(value)
		},
	});

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
					<Breadcrumb currentPage='Tambah Cuti' />
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
														const jenisCuti: JenisCuti = selectorCuti.list_jenis_cuti.filter(jenisCuti => jenisCuti.id == selected.value)[0];
														setMin(parseInt(jenisCuti.min))
														setMax(parseInt(jenisCuti.max))
														setDokumen(jenisCuti.dokumen)
														if (!dokumen) {
															formik.setFieldValue("dokumen", null)
														}
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
													formik.values.dokumen?.name ? <div className="bg-blue-50 border-b border-blue-400 text-blue-800 text-sm p-4 flex justify-between">
														<div className="flex items-center">
															<p>
																{formik.values.dokumen?.name}
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

export default NewCutiPage;