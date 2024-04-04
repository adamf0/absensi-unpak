import React, { Suspense } from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import AsideRouter from '../components/router/AsideRouter';
import Wrapper from '../components/layouts/Wrapper/Wrapper';
import HeaderRouter from '../components/router/HeaderRouter';
import ContentRouter from '../components/router/ContentRouter';
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
import MessagesPartial from '../templates/layouts/Headers/_partial/Messages.partial';
import NotificationPartial from '../templates/layouts/Headers/_partial/Notification.partial';
import SearchPartial from '../templates/layouts/Headers/_partial/Search.partial';
import SettingsPartial from '../templates/layouts/Headers/_partial/Settings.partial';
import CutiPage from '../module/Cuti/CutiPage';
import NewCutiPage from '../module/Cuti/NewCutiPage';
import EditCutiPage from '../module/Cuti/EditCutiPage';
import IzinPage from '../module/Izin/IzinPage';
import EditIzinPage from '../module/Izin/EditIzinPage';
import NewIzinPage from '../module/Izin/NewIzinPage';

const App = () => {
	const navigate = useNavigate();
	getOS();

	const { fontSize } = useFontSize();
	dayjs.extend(localizedFormat);

	return (
		<>
			<style>{`:root {font-size: ${fontSize}px}`}</style>
			<div data-component-name='App' className='flex grow flex-col'>
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
						</Nav>
					</AsideBody>
				</Aside>
				<Wrapper>
					<Header>
						<HeaderLeft>
							<SearchPartial />
						</HeaderLeft>
						<HeaderRight>
							<MessagesPartial />
							<NotificationPartial />
							<SettingsPartial />
						</HeaderRight>
					</Header>
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
							<Route path="/cuti" element={<CutiPage/>} />
							<Route path="/cuti/tambah" element={<NewCutiPage/>} />
							<Route path="/cuti/edit/:id" element={<EditCutiPage/>} />
							<Route path="/izin" element={<IzinPage />} />
							<Route path="/izin/tambah" element={<NewIzinPage />} />
							<Route path="/izin/edit/:id" element={<EditIzinPage />} />
							<Route path="/login" element={<InputPage />} />
							<Route path="/logout" element={<InputPage />} />
							{/* Tambahkan route berikut sebagai route terakhir */}
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</Suspense>
					<FooterRouter />
				</Wrapper>
			</div>
		</>
	);
};

export default App;
