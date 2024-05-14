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
import { useAppDispatch, useAppSelector } from '@/module/redux/hooks';
import { toast } from 'react-toastify';
import { CreateSPPD } from '@/module/repo/CreateSPPD';
import { editSppd, loadListJenisSPPD, sppdselector } from '@/module/redux/sppdSlice';
import { JenisSPPDModel } from '@/module/model/JenisSPPDModel';
import { SelectOptionsAdapter } from '../IO/SelectOptionsAdapter';
import SelectReact from '@/components/form/SelectReact';
import { GetListJenisSPPD } from '../repo/GetListJenisSPPD';
import useLevelMode from '@/hooks/useLevelMode';
import { GetSPPD } from '../repo/GetSPPD';
import { SPPDModel } from '../model/SPPDModel';
import { UpdateSPPD } from '../repo/UpdateSPPD';

const EditSPPDPage = () => {
	const { id } = useParams();
	const { levelMode } = useLevelMode();
	const navigate = useNavigate();
	const maxRef = useRef<any>(null);
	const [disableButton, setDisableButton] = useState<boolean>(false);
	const [sppd, setSPPD] = useState<SPPDModel|null>(null);
	// const toastId = useRef<any>(null);
	const selectorSPPD = useAppSelector(sppdselector);
	const dispatch = useAppDispatch();

	const handler1 = new HandlerObserver();
	handler1.addObserver(new ConsoleObserver());

	const handler2 = new HandlerObserver();
	handler2.addObserver(new AlertObserver());

	const loadJenisSPPD = async () => {
		try {
			const response: any = await GetListJenisSPPD();
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, list, log } = response;

				if (status == 200) {
					const listJenisSPPD = list.map((item: any) =>
						new JenisSPPDModel(
							item.id,
							item.nama,
						)
					)

					await dispatch(loadListJenisSPPD(listJenisSPPD));
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

	const loadSPPD = async (id:any) => {
		try {
			const response: any = await GetSPPD(id);
			if (response.status !== 200) {
				throw new Error(response.message ?? "Terjadi masalah pada saat request ke server");
			}

			if (response.status === 200 || response.status === 500) {
				const { status, message, data, log } = response;

				if (status == 200) {
					const sppdParse = new SPPDModel(
                        data.id,
                        data?.nidn,
                        data?.nip,
                        data?.tujuan,
                        new JenisSPPDModel(
                            data?.jenisSppd?.id,
                            data?.jenisSppd?.nama
                        ),
                        data?.tanggal_berangkat,
                        data?.tanggal_kembali,
                        data?.keterangan
                    );
					setSPPD(sppdParse)
					await dispatch(editSppd(sppdParse));
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

	useEffect(()=>{
		loadJenisSPPD()
		loadSPPD(id)
	},[])

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			jenis_sppd: "",
			tanggal_berangkat: "",
			tanggal_kembali: "",
			keterangan: ""
		},
		validationSchema: Yup.object({
			jenis_sppd: Yup.string().required("this is required"),
			tanggal_berangkat: Yup.string().required("this is required"),
			tanggal_kembali: Yup.string().required("this is required"),
			keterangan: Yup.string().required("this is required"),
		}),
		onSubmit: async (value: any) => {
			try {
				// toastId.current = toast("Loading...", { autoClose: false });
				setDisableButton(true);

				const response: any = await UpdateSPPD({
					id: id,
					nidn: levelMode == "dosen" ? localStorage.getItem('userRef') : null,
					nip: levelMode == "pegawai" ? localStorage.getItem('userRef') : null,
					jenis_sppd: value.jenis_sppd,
					tanggal_berangkat: value.tanggal_berangkat,
					tanggal_kembali: value.tanggal_kembali,
					keterangan: value.keterangan,
				});
				handler1.notifyObservers(response);
				if (response.status === 200 || response.status === 500) {
					const { status, message, log } = response;

					if (status == 200) {
						toast(message, { type: "success", autoClose: 2000 });
						navigate(`/sppd`)
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

	useEffect(()=>{
		formik.setFieldValue("jenis_sppd", sppd?.jenis_sppd?.id??"")
		formik.setFieldValue("tanggal_berangkat", sppd?.tanggal_berangkat??"")
		formik.setFieldValue("tanggal_kembali", sppd?.tanggal_kembali??"")
		formik.setFieldValue("keterangan", sppd?.keterangan??"")
	},[sppd])

	return (
		<PageWrapper name='SPPD'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb currentPage='Edit SPPD' />
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
									<div key={"jenis_sppd"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.jenis_sppd as boolean}
											invalidFeedback={formik.errors.jenis_sppd as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"jenis_sppd"}>Jenis SPPD</Label>
												<SelectReact
													options={SelectOptionsAdapter.adaptFromJenisSPPD(selectorSPPD.list_jenis_sppd)}
													id='jenis_sppd'
													name='jenis_sppd'
													value={SelectOptionsAdapter.adaptFromJenisSPPD(selectorSPPD.list_jenis_sppd).filter((option:any) => option.value === formik.values.jenis_sppd )}
													onChange={(selected: any) => {
														const jenisSppd: JenisSPPDModel = selectorSPPD.list_jenis_sppd.filter(jenisSppd => jenisSppd.id == selected.value)[0];
														formik.setFieldValue('jenis_sppd', selected.value)
													}}
												/>
											</>
										</Validation>
									</div>
									<div key={"tanggal_berangkat"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tanggal_berangkat as boolean}
											invalidFeedback={formik.errors.tanggal_berangkat as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tanggal_berangkat"}>Tanggal Berangkat</Label>
												<Input
													id={"tanggal_berangkat"}
													name={"tanggal_berangkat"}
													onChange={formik.handleChange}
													value={formik.values["tanggal_berangkat"]}
													type={"date" as TInputTypes}
												/>
											</>
										</Validation>
									</div>
									<div key={"tanggal_kembali"} className='col-span-12 lg:col-span-4'>
										<Validation
											isValid={formik.isValid}
											isTouched={formik.touched.tanggal_kembali as boolean}
											invalidFeedback={formik.errors.tanggal_kembali as any}
											validFeedback='Good'>
											<>
												<Label htmlFor={"tanggal_kembali"}>Tanggal Kembali</Label>
												<Input
													id={"tanggal_kembali"}
													name={"tanggal_kembali"}
													onChange={formik.handleChange}
													value={formik.values["tanggal_kembali"]}
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
												<Label htmlFor={"keterangan"}>Keterangan</Label>
												<Input
													id={"keterangan"}
													name={"keterangan"}
													onChange={formik.handleChange}
													value={formik.values["keterangan"]}
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

export default EditSPPDPage;
