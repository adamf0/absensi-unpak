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
import * as Yup from 'yup';
import Validation from '../../components/form/Validation';
import { useRef, useState } from 'react';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '@module/IO/AlertObserver';
import { ConsoleObserver } from '@module/IO/ConsoleObserver';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { CreateJenisIzin } from '../repo/CreateJenisIzin';
import { toast } from 'react-toastify';

const NewJenisIzinPage = () => {
	const navigate = useNavigate();
	const maxRef = useRef<any>(null);
	const [disableButton, setDisableButton] = useState<boolean>(false);
	// const toastId = useRef<any>(null);
	const dispatch = useAppDispatch();

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			nama: "",
		},
		validationSchema: Yup.object({
			nama: Yup.string().required("this is required"),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				const response: any = await CreateJenisIzin({
					nama: value.nama,
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message, log } = response;

					if (status == 200) {
						toast(message, { type: "success", autoClose: 2000 });
						navigate(`/jenis_izin`)
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

	return (
		<PageWrapper name='JenisIzin'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Tambah Jenis Izin' />
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

export default NewJenisIzinPage;
