import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import LogoTemplate from '@/templates/layouts/Logo/Logo.template';
import FieldWrap from '@/components/form/FieldWrap';
import Icon from '@/components/icon/Icon';
import Validation from '@/components/form/Validation';
import { DoLogin } from '@/module/repo/DoLogin';
import useLevelMode from '@/hooks/useLevelMode';
import useUserRef from '@/hooks/useUserRef';

type TValues = {
	username: string;
	password: string;
};

const LoginPage = () => {
	const navigate = useNavigate();
	const { levelMode, setLevelMode } = useLevelMode();
	const { userRef, setUserRef } = useUserRef();
	// const { onLogin } = useAuth();
	
	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validate: (values: TValues) => {
			const errors: Partial<TValues> = {};

			if (!values.username) {
				errors.username = 'Required';
			}

			if (!values.password) {
				errors.password = 'Required';
			}

			return errors;
		},
		onSubmit: async (values: TValues) => {
			try {
				const response:any = await DoLogin({
					"username":values.username,
					"password":values.password,
				});
				console.log(response);
				if (response.status === 200 || response.status === 500) {
					const { status,message,data } = response;
	
					if (status == 200){
						localStorage.setItem('level', JSON.stringify(data.level));
						localStorage.setItem('infoUser', JSON.stringify(data));
						if(data.level.length>0){
							const level = data.level[0]
							//bug tidak set useref dan level mode setelah logout
							// setLevelMode(level)
							localStorage.setItem('levelMode', level);

							// console.log(level=="pegawai",level=="dosen",["sdm","admin","warek"].includes(level),data?.NIDN)
							if(level=="pegawai"){
								// setUserRef(data?.nip??"")
								localStorage.setItem('userRef', data?.nip??"");
							} else if(level=="dosen"){
								// setUserRef(data?.NIDN??"")
								localStorage.setItem('userRef', data?.NIDN??"");
							} else if(["sdm","admin","warek"].includes(level)){
								// setUserRef(data?.id??"")
								localStorage.setItem('userRef', data?.id??"");
							}
						}
						// const info = localStorage.getItem('infoUser')??"{}";
						// console.log(JSON.parse(info))
						navigate('/')
					} else if (status == 500) {
						alert(message ?? "terjadi masalah pada saat request ke server")
					} else {
						alert(message ?? "terjadi masalah pada saat request ke server")
					}
				} else {
					alert("terjadi masalah pada saat request ke server")
				}
			} catch (error:any) {
				alert(error.message ?? "terjadi masalah pada saat request ke server")
				throw error;
			} finally {
	
			}
		},
	});

	useEffect(() => {
		if (localStorage.getItem('userInfo')) {
		  navigate('/home');
		}
	  }, [navigate]);

	return (
		<PageWrapper isProtectedRoute={false} className='bg-white dark:bg-inherit' name='Sign In'>
			<div className='container mx-auto flex h-full items-center justify-center'>
				<div className='flex max-w-sm flex-col gap-8'>
					<div>
						<LogoTemplate className='h-12' />
					</div>
					<div>
						<span className='text-4xl font-semibold'>Sign in</span>
					</div>
					{/* <div>
						<span>Sign up with Open account</span>
					</div> */}
					{/* <div className='grid grid-cols-12 gap-4'>
						<div className='col-span-6'>
							<Button
								icon='CustomGoogle'
								variant='outline'
								color='zinc'
								size='lg'
								className='w-full'>
								Google
							</Button>
						</div>
						<div className='col-span-6'>
							<Button
								icon='CustomApple'
								variant='outline'
								color='zinc'
								size='lg'
								className='w-full'>
								Apple
							</Button>
						</div>
					</div> */}
					<div className='border border-zinc-500/25 dark:border-zinc-500/50' />
					{/* <div>
						<span>Or continue with email address</span>
					</div> */}
					<form className='flex flex-col gap-4' noValidate>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.username}
								invalidFeedback={formik.errors.username}
								validFeedback='Good'>
								<FieldWrap
									firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
									<Input
										dimension='lg'
										id='username'
										autoComplete='username'
										name='username'
										placeholder='Email or username'
										value={formik.values.username}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.password}
								invalidFeedback={formik.errors.password}
								validFeedback='Good'>
								<FieldWrap
									firstSuffix={<Icon icon='HeroKey' className='mx-2' />}
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
										placeholder='Password'
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
						<div>
							<Button
								size='lg'
								variant='solid'
								className='w-full font-semibold'
								onClick={() => formik.handleSubmit()}>
								Sign in
							</Button>
						</div>
					</form>
					<div>
						<span className='text-zinc-500'>
							Uji coba sudah berakhir. <b>coming soon</b>
						</span>
					</div>
					{/* <div>
						<span className='flex gap-2 text-sm'>
							<span className='text-zinc-400 dark:text-zinc-600'>
								Don’t have an account?
							</span>
							<Link to='/' className='hover:text-inherit'>
								Sign up
							</Link>
						</span>
					</div> */}
				</div>
			</div>
		</PageWrapper>
	);
};

export default LoginPage;
