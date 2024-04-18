import { Suspense } from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import Wrapper from '../components/layouts/Wrapper/Wrapper';
import FooterRouter from '../components/router/FooterRouter';
import useFontSize from '../hooks/useFontSize';
import getOS from '../utils/getOS.util';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Aside, { AsideHead, AsideBody } from '../components/layouts/Aside/Aside';
import Container from '../components/layouts/Container/Container';
import Header, { HeaderLeft, HeaderRight } from '../components/layouts/Header/Header';
import Nav, { NavItem } from '../components/layouts/Navigation/Nav';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../components/layouts/Subheader/Subheader';
import Card from '../components/ui/Card';
import NotFoundPage from '../pages/NotFound.page';
import InputPage from '../pages/componentsAndTemplates/form/InputPage/Input.page';
import LogoAndAsideTogglePart from '../templates/layouts/Asides/_parts/LogoAndAsideToggle.part';
import SearchPartial from '../templates/layouts/Headers/_partial/Search.partial';
import CutiPage from '../module/Cuti/CutiPage';
import NewCutiPage from '../module/Cuti/NewCutiPage';
import EditCutiPage from '../module/Cuti/EditCutiPage';
import IzinPage from '../module/Izin/IzinPage';
import EditIzinPage from '../module/Izin/EditIzinPage';
import NewIzinPage from '../module/Izin/NewIzinPage';
import LogoutPage from '../module/LogoutPage';
import ApprovalCutiPage from '../module/Cuti/ApprovalCutiPage';
import ApprovalIzinPage from '../module/Izin/ApprovalIzinPage';
import SettingsComponent from '../module/component/SettingsComponent';
import LoginPage from '../module/LoginPage';
import useLevelMode from '../hooks/useLevelMode';
import EditPenggunaPage from '../module/Pengguna/EditPenggunaPage';
import NewPenggunaPage from '../module/Pengguna/NewPenggunaPage';
import PenggunaPage from '../module/Pengguna/PenggunaPage';

const App = () => {
	const navigate = useNavigate();
	const { levelMode } = useLevelMode();

	getOS();

	const { fontSize } = useFontSize();
	dayjs.extend(localizedFormat);

	function loadSideNav(){
		if(levelMode=="sdm"){
			return <>
						<NavItem {...{
							id: 'cutiApprovalPage',
							to: '/approval/cuti',
							text: 'Cuti',
							icon: 'HeroRectangleGroup',
						}} />
						<NavItem {...{
							id: 'izinApprovalPage',
							to: '/approval/izin',
							text: 'Izin',
							icon: 'HeroRectangleGroup',
						}} />
					</>
		} else if(levelMode=="dosen"){
			return <>
					<NavItem {...{
						id: 'cutiPage',
						to: '/cuti',
						text: 'Cuti',
						icon: 'HeroRectangleGroup',
					}} />
					<NavItem {...{
						id: 'izinPage',
						to: '/izin',
						text: 'Izin',
						icon: 'HeroRectangleGroup',
					}} />
				</>
		} else if(levelMode=="admin"){
			return <>
			<NavItem {...{
				id: 'pengguna',
				to: '/pengguna',
				text: 'Pengguna',
				icon: 'HeroRectangleGroup',
			}} />
			<NavItem {...{
				id: 'Jenis Cuti',
				to: '/jenis_cuti',
				text: 'Jenis Cuti',
				icon: 'HeroRectangleGroup',
			}} />
			<NavItem {...{
				id: 'Jenis Izin',
				to: '/jenis_izin',
				text: 'Jenis Izin',
				icon: 'HeroRectangleGroup',
			}} />
		</>
		}
		return <></>
	}
	return (
		<>
			<style>{`:root {font-size: ${fontSize}px}`}</style>
			<div data-component-name='App' className='flex grow flex-col'>
				<Routes>
					<Route path="/login" element={null} />
					<Route path="*" element={
						<Aside>
							<AsideHead>
								<LogoAndAsideTogglePart />
							</AsideHead>
							<AsideBody>
								<Nav>
									<NavItem {...{
										id: 'homePage',
										to: '/home',
										text: 'Home',
										icon: 'HeroRectangleGroup',
									}} />
									{loadSideNav()}
									<NavItem {...{
										id: 'logout',
										to: '/logout',
										text: 'Logout',
										icon: 'HeroRectangleGroup',
									}} />
								</Nav>
							</AsideBody>
						</Aside>
					} />
				</Routes>

				<Wrapper>
					<Routes>
						<Route path="/login" element={null} />
						<Route path="*" element={
							<Header>
								<HeaderLeft>
									<SearchPartial />
								</HeaderLeft>
								<HeaderRight>
									{/* <MessagesPartial />
									<NotificationPartial /> */}
									<SettingsComponent />
								</HeaderRight>
							</Header>
						} />
					</Routes>

					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="*" element={
							<Suspense
								fallback={
									<>
										<Header>
											<HeaderLeft>
												<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
											</HeaderLeft>
											<HeaderRight>
												<div className='flex gap-4'>
													<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
													<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
													<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
												</div>
											</HeaderRight>
										</Header>
										<PageWrapper>
											<Subheader>
												<SubheaderLeft>
													<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
												</SubheaderLeft>
												<SubheaderRight>
													<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
												</SubheaderRight>
											</Subheader>
											<Container>
												<div className='grid grid-cols-12 gap-4'>
													<div className='col-span-3'>
														<Card className='h-[15vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>
													<div className='col-span-3 '>
														<Card className='h-[15vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>
													<div className='col-span-3'>
														<Card className='h-[15vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>
													<div className='col-span-3'>
														<Card className='h-[15vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>

													<div className='col-span-6'>
														<Card className='h-[50vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>
													<div className='col-span-6'>
														<Card className='h-[50vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>

													<div className='col-span-12'>
														<Card className='h-[15vh] animate-pulse'>
															<div className='invisible'>Loading...</div>
														</Card>
													</div>
												</div>
											</Container>
										</PageWrapper>
									</>
								}>
								<Routes>
									<Route path="/" element={<InputPage />} />
									{/* <Route path="/absensi" element={<InputPage />} /> */}
									<Route path="/cuti" element={<CutiPage />} />
									<Route path="/cuti/tambah" element={<NewCutiPage />} />
									<Route path="/cuti/edit/:id" element={<EditCutiPage />} />
									<Route path="/approval/cuti" element={<ApprovalCutiPage />} />

									<Route path="/izin" element={<IzinPage />} />
									<Route path="/izin/tambah" element={<NewIzinPage />} />
									<Route path="/izin/edit/:id" element={<EditIzinPage />} />
									<Route path="/approval/izin" element={<ApprovalIzinPage />} />

									<Route path="/pengguna" element={<PenggunaPage />} />
									<Route path="/pengguna/tambah" element={<NewPenggunaPage />} />
									<Route path="/pengguna/edit/:id" element={<EditPenggunaPage />} />

									<Route path="/logout" element={<LogoutPage />} />
									{/* Tambahkan route berikut sebagai route terakhir */}
									<Route path="*" element={<NotFoundPage />} />
								</Routes>
							</Suspense>
						} />
					</Routes>

					<Routes>
						<Route path="/login" element={null} />
						<Route path="*" element={<FooterRouter />}/>
					</Routes>
				</Wrapper>
			</div>
		</>
	);
};

export default App;
