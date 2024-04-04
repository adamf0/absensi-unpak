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
import SelectReact, { TSelectOptions } from '../../components/form/SelectReact';
import Textarea from '../../components/form/Textarea';
import * as Yup from 'yup';
import Validation from '../../components/form/Validation';
import { useRef, useState } from 'react';
import { HandlerObserver } from '../abstract/HandlerObserver';
import { AlertObserver } from '../io/AlertObserver';
import { ConsoleObserver } from '../io/ConsoleObserver';
import { CreateCuti } from '../repo/CreateCuti';
import { useNavigate, useParams } from 'react-router-dom';

const EditCutiPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const FILE_SIZE = 1024 * 1024 * 10; // 10 MB
	const SUPPORTED_FORMATS = ['application/pdf'];
	const [disableButton,setDisableButton] = useState<boolean>(false);
	const toastId = useRef<any>(null);

    const handler1 = new HandlerObserver();
    handler1.addObserver(new ConsoleObserver());

    const handler2 = new HandlerObserver();
    handler2.addObserver(new AlertObserver());
	
	const jenisCutiOptions: TSelectOptions = [
		{ value: '1', label: 'Tahunan' },
		{ value: '2', label: 'Sakit' },
		{ value: '3', label: 'Melahirkan' },
	];
	const formik = useFormik({
		initialValues: {
			tanggal_pengajuan: "",
			jenis_cuti: "",
			lama_cuti: "",
			tujuan_cuti: '',
			dokumen: '',
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
				(value:any) => {
				  return !(value == undefined || value.value=="");
				}
			  ),
			dokumen: Yup.string().required("this is required"),
		}),
		onSubmit: async (value:any) => {
			try {
				setDisableButton(true);
				
				const response:any = await CreateCuti({
					id: id,
					nidn:localStorage.getItem('authData')??"-",
					tanggal_pengajuan: value.tanggal_pengajuan,
					lama_cuti: value.lama_cuti,
					tujuan: value.tujuan_cuti,
					jenis_cuti: value.jenis_cuti?.value,
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
									<div key={"jenis_cuti"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.jenis_cuti}
											invalidFeedback={formik.errors.jenis_cuti}
											validFeedback='Good'>
												<>
													<Label htmlFor={"jenis_cuti"}>Jenis Cuti</Label>
													<SelectReact
														options={jenisCutiOptions}
														id='jenis_cuti'
														name='jenis_cuti'
														value={formik.values.jenis_cuti}
														onChange={(value) =>
															formik.setFieldValue('jenis_cuti', value)
														}
													/>
												</>
										</Validation>
									</div>
									<div key={"lama_cuti"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.lama_cuti}
											invalidFeedback={formik.errors.lama_cuti}
											validFeedback='Good'>
												<>
													<Label htmlFor={"lama_cuti"}>Lama Cuti</Label>
													<Input
														id={"lama_cuti"}
														name={"lama_cuti"}
														onChange={formik.handleChange}
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
											isTouched={formik.touched.tujuan_cuti}
											invalidFeedback={formik.errors.tujuan_cuti}
											validFeedback='Good'>
												<>
													<Label htmlFor={"tujuan_cuti"}>Tujuan</Label>
													<Textarea
														id='tujuan_cuti'
														name='tujuan_cuti'
														onChange={formik.handleChange}
														value={formik.values.tujuan_cuti}
														placeholder='masukkan tujuan cuti...'
														rows={8}/>
												</>
										</Validation>
									</div>
									<div key={"dokumen"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.dokumen}
											invalidFeedback={formik.errors.dokumen}
											validFeedback='Good'>
												<>
													<Label htmlFor={"dokumen"}>Dokumen</Label>
													<Input
														id={"dokumen"}
														name={"dokumen"}
														onChange={formik.handleChange}
														// @ts-ignore
														// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
														value={formik.values["dokumen"]}
														type={"file" as TInputTypes}
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

export default EditCutiPage;