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
import Textarea from '../../components/form/Textarea';
import * as Yup from 'yup';
import Validation from '../../components/form/Validation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../IO/AlertObserver';
import { ConsoleObserver } from '../IO/ConsoleObserver';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { JenisCutiModel } from '../model/JenisCutiModel';
import Radio, { RadioGroup } from '../../components/form/Radio';
import { editJenisCuti } from '../redux/jenisCutiSlice';
import { GetJenisCuti } from '../repo/GetJenisCuti';
import { UpdateJenisCuti } from '../repo/UpdateJenisCuti';

const EditJenisCutiPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const maxRef = useRef<any>(null);
	const [jenisCuti,setJenisCuti] = useState<JenisCutiModel|null>(null); 
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const dispatch = useAppDispatch();

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const options: { value: string; content: ReactNode }[] = [
		{ value: "1", content: "wajib upload file" },
		{ value: "0", content: "tidak wajib upload file" },
	];

	const loadJenisCuti = async (id:any) => {
		const response: any = await GetJenisCuti(id);
		if (response.status !== 200) {
			throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
		}

		if (response.status === 200 || response.status === 500) {
			const { status, message, data } = response;

			if (status == 200) {
				const jenisCutiParse = new JenisCutiModel(
					data.id,
					data.nama,
					data.min,
					data.max,
					data.dokumen,
					data.kondisi,
				)
				setJenisCuti(jenisCutiParse)
				await dispatch(editJenisCuti(jenisCutiParse));
			} else if (status == 500) {
				console.trace(message ?? "Terjadi masalah pada saat request ke server")
			} else {
				console.trace(message ?? "Terjadi masalah pada saat request ke server")
			}
		}
	}

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			nama: "",
			min: "",
			max: "",
			kondisi: "",
			dokumen: "",
		},
		validationSchema: Yup.object({
			nama: Yup.string().required("this is required"),
			min: Yup.string().required("this is required"),
			max: Yup.string().required("this is required"),
			kondisi: Yup.string().required("this is required"),
			dokumen: Yup.string().required("this is required"),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				const response: any = await UpdateJenisCuti({
					id: id,
					nama: value.nama,
					min: value.min,
					max: value.max,
					kondisi: value.kondisi,
					dokumen: value.dokumen,
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message } = response;

					if (status == 200) {
						// toast.update(toastId.current, { render:message, type: "success", autoClose: 5000 }); //not show
						alert(message);
						navigate(`/jenis_cuti`)
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

	useEffect(() => {
		loadJenisCuti(id)
	}, [])

	useEffect(()=>{
		formik.setFieldValue("nama", jenisCuti?.nama??"")
		formik.setFieldValue("min", jenisCuti?.min??"")
		formik.setFieldValue("max", jenisCuti?.max??"")
		formik.setFieldValue("kondisi", jenisCuti?.kondisi??"")
		formik.setFieldValue("dokumen", jenisCuti?.dokumen??"")
	},[jenisCuti])

	return (
		<PageWrapper name='Izin'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Ubah Izin' />
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
									<div key={"nama"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.nama as boolean}
											invalidFeedback={formik.errors.nama as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"nama"}>Nama</Label>
												<Input
													id={"nama"}
													name={"nama"}
													onChange={formik.handleChange}
													value={formik.values["nama"]}
													type={"text" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"min"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.min as boolean}
											invalidFeedback={formik.errors.min as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"min"}>Minimum Cuti <b>(hari)</b></Label>
												<Input
													id={"min"}
													name={"min"}
													min={0}
													onChange={(e)=>{
														formik.setFieldValue("min",e.target.value)
														if(parseInt(formik.values.max) < parseInt(e.target.value)){
															formik.setFieldValue("max","")
															maxRef.current.min = e.target.value
														}
													}}
													value={formik.values["min"]}
													type={"number" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"max"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.max as boolean}
											invalidFeedback={formik.errors.max as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"max"}>Maksimum Cuti <b>(hari)</b></Label>
												<Input
													id={"max"}
													name={"max"}
													min={formik.values["min"]}
													ref={maxRef}
													onChange={formik.handleChange}
													value={formik.values["max"]}
													type={"number" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"kondisi"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.kondisi as boolean}
											invalidFeedback={formik.errors.kondisi as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"kondisi"}>Kondisi</Label>
												<Textarea
													onChange={(e)=>formik.setFieldValue("kondisi",e.target.value)}
													value={formik.values["kondisi"]??"{}"}
													placeholder='masukkan rule json kondisi...'
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
													<Label htmlFor={"kondisi"}>Dokumen</Label>
													<RadioGroup>
														{options.map((i) => (
															<Radio
																key={i.value}
																label={i.content}
																name='dokumen'
																value={i.value}
																selectedValue={formik.values.dokumen? "1":"0"}
																onChange={formik.handleChange}
																color="emerald"
															/>
														))}
													</RadioGroup>
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

export default EditJenisCutiPage;