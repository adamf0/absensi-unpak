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
import { AlertObserver } from '@module/IO/AlertObserver';
import { ConsoleObserver } from '@module/IO/ConsoleObserver';
import { useNavigate, useParams } from 'react-router-dom';
import { PenggunaModel } from '../model/PenggunaModel';
import { useAppDispatch } from '../redux/hooks';
import { editPengguna } from '../redux/penggunaSlice';
import { UpdatePengguna } from '../repo/UpdatePengguna';
import { GetPengguna } from '../repo/GetPengguna';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';

const EditPenggunaPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [pengguna,setPengguna] = useState<PenggunaModel|null>(null); 
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const dispatch = useAppDispatch();

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const listLevel = () => {
		return [
			{ value: 'admin', label: 'Admin' },
			{ value: 'sdm', label: 'SDM' },
			{ value: 'warek', label: 'Wakil rektor' }
		]
	}

	const loadPengguna = async (id:any) => {
		const response: any = await GetPengguna(id);
		if (response.status !== 200) {
			throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
		}

		if (response.status === 200 || response.status === 500) {
			const { status, message, data } = response;

			if (status == 200) {
				const penggunaParse = new PenggunaModel(
					data.id,
					data.username,
					data.password,
					data.nama,
					data.level,
					data.nidn,
				)
				setPengguna(penggunaParse)
				await dispatch(editPengguna(penggunaParse));
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
			username: "",
			password: "",
			level: "",
			nidn: "",
		},
		validationSchema: Yup.object({
			nama: Yup.string().required("this is required"),
			username: Yup.string().required("this is required"),
			password: Yup.string().required("this is required"),
			level: Yup.string().required("this is required"),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				const response: any = await UpdatePengguna({
					id: id,
					nama: value.nama,
					username: value.username,
					password: value.password,
					level: value.level,
					nidn: value.nidn,
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message } = response;

					if (status == 200) {
						// toast.update(toastId.current, { render:message, type: "success", autoClose: 5000 }); //not show
						alert(message);
						navigate(`/pengguna`)
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
		loadPengguna(id)
	}, [])

	useEffect(()=>{
		formik.setFieldValue("nama", pengguna?.nama??"")
		formik.setFieldValue("username", pengguna?.username??"")
		formik.setFieldValue("password", pengguna?.password??"")
		formik.setFieldValue("level", pengguna?.level??"")
		formik.setFieldValue("nidn", pengguna?.nidn??"")
	},[pengguna])

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
									<div key={"username"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.username as boolean}
											invalidFeedback={formik.errors.username as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"username"}>Username</Label>
												<Input
													id={"username"}
													name={"username"}
													onChange={formik.handleChange}
													value={formik.values["username"]}
													type={"text" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"password"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.password as boolean}
											invalidFeedback={formik.errors.password as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"password"}>Password</Label>
												<FieldWrap
													lastSuffix={
														<Icon
															className='mx-2 cursor-pointer'
															icon={passwordShowStatus ? 'HeroEyeSlash' : 'HeroEye'}
															onClick={() => {
																setPasswordShowStatus(!passwordShowStatus);
															}}
														/>
													}>
													<Input
														dimension='lg'
														type={passwordShowStatus ? 'text' : 'password'}
														autoComplete='current-password'
														id='password'
														name='password'
														value={formik.values.password}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
													/>
												</FieldWrap>
											</>
										</Validation>
									</div>
									<div key={"nidn"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.nidn as boolean}
											invalidFeedback={formik.errors.nidn as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"nidn"}>NIDN</Label>
												<Input
													id={"nidn"}
													name={"nidn"}
													onChange={formik.handleChange}
													value={formik.values["nidn"]}
													type={"text" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"level"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.level as boolean}
											invalidFeedback={formik.errors.level as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"level"}>Level Pengguna</Label>
												<SelectReact
													options={listLevel()}
													id='level'
													name='level'
													value={listLevel().filter((option:any) => option.value === formik.values.level )}
													onChange={(selected: any) => {
														formik.setFieldValue('level', selected.value)
													}}
												/>
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

export default EditPenggunaPage;