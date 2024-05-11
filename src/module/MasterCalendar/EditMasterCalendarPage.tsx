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
import * as Yup from 'yup';
import Validation from '@/components/form/Validation';
import { useEffect, useRef, useState } from 'react';
import { HandlerObserver } from '@/module/abstract/HandlerObserver';
import { AlertObserver } from '@/module/IO/AlertObserver';
import { ConsoleObserver } from '@/module/IO/ConsoleObserver';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/module/redux/hooks';
import { CreateMasterCalendar } from '@/module/repo/CreateMasterCalendar';
import { toast } from 'react-toastify';
import Textarea from '@/components/form/Textarea';
import { MasterCalendarModel } from '@/module/model/MasterCalendarModel';
import { editMasterCalendar } from '@/module/redux/masterCalendarSlice';
import { GetMasterCalendar } from '@/module/repo/GetMasterCalendar';
import { UpdateMasterCalendar } from '@/module/repo/UpdateMasterCalendar';

const EditMasterCalendarPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const maxRef = useRef<any>(null);
	const [disableButton, setDisableButton] = useState<boolean>(false);
	const [masterCalendar,setMasterCalendar] = useState<MasterCalendarModel|null>(null); 
	// const toastId = useRef<any>(null);
	const dispatch = useAppDispatch();

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const loadMasterCalendar = async (id:any) => {
		const response: any = await GetMasterCalendar(id);
		if (response.status !== 200) {
			toast(response.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
			throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
		}

		if (response.status === 200 || response.status === 500) {
			const { status, message, data, log } = response;

			if (status == 200) {
				const masterCalendarParse = new MasterCalendarModel(
					data.id,
					data.tanggal_mulai,
					data.tanggal_akhir,
					data.keterangan,
				)
				setMasterCalendar(masterCalendarParse)
				await dispatch(editMasterCalendar(masterCalendarParse));
			} else if (status == 500) {
				toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				console.trace(log)
			} else {
				toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				console.trace(message ?? "Terjadi masalah pada saat request ke server")
			}
		}
	}

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			tanggal_mulai: "",
			tanggal_akhir: "",
			keterangan: "",
		},
		validationSchema: Yup.object({
			tanggal_mulai: Yup.string().required("this is required"),
			keterangan: Yup.string().required("this is required"),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				const response: any = await UpdateMasterCalendar({
					id:id,
					tanggal_mulai: value.tanggal_mulai,
					tanggal_akhir: value.tanggal_akhir,
					keterangan: value.keterangan,
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message, log } = response;

					if (status == 200) {
						toast(message, { type: "success", autoClose: 2000 });
						navigate(`/master_calendar`)
					} else if (status == 500) {
						toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
						console.trace(log)
					} else {
						toast(message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
					}
				} else {
					toast("Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				}
			} catch (error: any) {
				toast(error.message ?? "Terjadi masalah pada saat request ke server", { type: "error", autoClose: 2000 });
				console.trace(error.message)
			} finally {
				setDisableButton(false);
			}
			console.log(value)
		},
	});

	useEffect(() => {
		loadMasterCalendar(id)
	}, [])

	useEffect(()=>{
		formik.setFieldValue("tanggal_mulai", masterCalendar?.tanggal_mulai??"")
		formik.setFieldValue("tanggal_akhir", masterCalendar?.tanggal_akhir??"")
		formik.setFieldValue("keterangan", masterCalendar?.keterangan??"")
	},[masterCalendar])

	return (
		<PageWrapper name='MasterCalendar'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Tambah Master Calendar' />
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
									<div key={"tanggal_mulai"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tanggal_mulai as boolean}
											invalidFeedback={formik.errors.tanggal_mulai as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tanggal_mulai"}>Tanggal Awal</Label>
												<Input
													id={"tanggal_mulai"}
													name={"tanggal_mulai"}
													onChange={formik.handleChange}
													value={formik.values["tanggal_mulai"]}
													type={"date" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"tanggal_akhir"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tanggal_akhir as boolean}
											invalidFeedback={formik.errors.tanggal_akhir as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tanggal_akhir"}>Tanggal Akhir</Label>
												<Input
													id={"tanggal_akhir"}
													name={"tanggal_akhir"}
													min={formik.values["tanggal_mulai"]}
													onChange={formik.handleChange}
													value={formik.values["tanggal_akhir"]}
													type={"date" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"keterangan"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.keterangan as boolean}
											invalidFeedback={formik.errors.keterangan as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"keterangan"}>Tujuan</Label>
												<Textarea
													id='keterangan'
													name='keterangan'
													onChange={formik.handleChange}
													value={formik.values.keterangan}
													placeholder='masukkan keterangan...'
													rows={8} />
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

export default EditMasterCalendarPage;
