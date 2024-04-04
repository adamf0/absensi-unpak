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
import { useState } from 'react';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { CreateIzin } from '../repo/CreateIzin';
import { useNavigate } from 'react-router-dom';

const NewIzinPage = () => {
	const [disableButton,setDisableButton] = useState<boolean>(false);
	const navigate = useNavigate();
	
    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());
	
	const formik = useFormik({
		initialValues: {
			tanggal_pengajuan: '',
			tujuan_izin: '',
		},
		validationSchema: Yup.object({
			tanggal_pengajuan: Yup.date().required("this is required"),
			tujuan_izin: Yup.string().required("this is required"),
		}),
		onSubmit: async (value:any) => {
			try {
				setDisableButton(true);
				
				const response:any = await CreateIzin({
					nidn:localStorage.getItem('authData')??"-",
					tanggal_pengajuan: value.tanggal_pengajuan,
					tujuan: value.tujuan_izin,
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status,message } = response;
	
					if (status == 200){
						alert(message);
						navigate(`/izin`)
					} else if (status == 500) {
						alert(message ?? "terjadi masalah pada saat request ke server");
					} else {
						alert(message ?? "terjadi masalah pada saat request ke server");
					}
				} else {
					alert("terjadi masalah pada saat request ke server");
				}
			} catch (error:any) {
				// toast.update(toastId.current, { render:error.message ?? "terjadi masalah pada saat request ke server", type: "error", autoClose: 5000 });
				throw error;
			} finally {
				setDisableButton(false);
			}
			console.log(value)
		},
	});

	return (
		<PageWrapper name='Input'>
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
										isTouched={formik.touched.tanggal_pengajuan}
										invalidFeedback={formik.errors.tanggal_pengajuan}
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
									<div key={"tujuan_izin"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tujuan_izin}
											invalidFeedback={formik.errors.tujuan_izin}
											validFeedback='Good'>
												<>
													<Label htmlFor={"tujuan_izin"}>Tujuan</Label>
													<Textarea
														id='tujuan_izin'
														name='tujuan_izin'
														onChange={formik.handleChange}
														value={formik.values.tujuan_izin}
														placeholder='masukkan tujuan izin...'
														rows={8}/>
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

export default NewIzinPage;
