import React, { createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import { EventApi, EventContentArg, EventSourceInput } from '@fullcalendar/core';
import Calendar, { TViewMode, useCalendarView } from '@/components/Calendar';
import Avatar from '@/components/Avatar';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardHeaderChild, CardBody } from '@/components/ui/Card';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import { TUser } from '@/mocks/db/users.db';
import { TIcons } from '@/types/icons.type';

const CalendarView: React.FC<{source:any}> = ({ source }) => {
	const { t } = useTranslation();

	const ref = createRef<FullCalendar>();
	const {
		viewMode,
		changeViewMode,
		next,
		prev,
		today,
		title: currentDate,
	} = useCalendarView(ref);

	const INITIAL_EVENTS = [
		{
			id: 100,
			title: 'sakit',
			start: '2024-04-25', 
			end: '2024-04-25'
		},
		{
			id: 100,
			title: 'sakit',
			start: '2024-04-27', 
			end: '2024-04-27'
		},
	];
	console.log(source, INITIAL_EVENTS)

	const CALENDAR_VIEW: {
		[key in TViewMode]: { key: TViewMode; text: string; icon: TIcons };
	} = {
		timeGridDay: { key: 'timeGridDay', text: 'Day', icon: 'HeroCalendar' },
		timeGridWeek: { key: 'timeGridWeek', text: 'Week', icon: 'HeroTableCells' },
		dayGridMonth: { key: 'dayGridMonth', text: 'Month', icon: 'HeroCalendarDays' },
		listWeek: { key: 'listWeek', text: 'List', icon: 'HeroClipboardDocumentCheck' },
	};

	const renderEventContent = (eventContent: EventContentArg) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { user, ...rest }: { user?: TUser } = eventContent.event.extendedProps;

		return (
			<>
				{user && <Avatar src={user.image?.thumb} className='me-2 w-6' />}
				<i className='pe-2'>{eventContent.event.title}</i>
				{eventContent.timeText && <b>{eventContent.timeText}</b>}
			</>
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

	const handleEvents = (events: EventApi[]) => {
		setCurrentEvents(events);
	};

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardHeaderChild>{currentDate}</CardHeaderChild>
				<CardHeaderChild>
					<Button onClick={() => prev(true)} icon='HeroChevronDoubleLeft' />
					<Button onClick={() => prev()} icon='HeroChevronLeft' />
					<Button onClick={() => today()} icon='HeroCalendar' />
					<Button onClick={() => next()} icon='HeroChevronRight' />
					<Button onClick={() => next(true)} icon='HeroChevronDoubleRight' />
					<Dropdown>
						<DropdownToggle>
							<Button color='zinc' icon={CALENDAR_VIEW[viewMode].icon}>
								{t(CALENDAR_VIEW[viewMode].text)}
							</Button>
						</DropdownToggle>
						<DropdownMenu placement='bottom-end'>
							{Object.values(CALENDAR_VIEW).map((item) => (
								<DropdownItem
									key={item.key}
									isActive={viewMode === item.key}
									onClick={() => changeViewMode(item.key)}
									icon={item.icon}>
									{item.text}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<Calendar
					ref={ref}
					height={700}
					viewMode={viewMode}
					initialEvents={source as EventSourceInput}
					editable
					selectable
					selectMirror
					dayMaxEvents={3}
					select={()=>{}}
					eventContent={renderEventContent}
					eventClick={()=>{}}
					eventsSet={()=>{}}
					eventClassNames='truncate'
				/>
				<div className='flex flex-wrap gap-2'>
					<div className='flex gap-1 justify-center items-center'>
						<div className="w-3 h-3 bg-purple-600 rounded-full"></div> 
						SPPD
					</div>
					<div className='flex gap-1 justify-center items-center'>
						<div className="w-3 h-3 bg-[#1d4ed8] rounded-full"></div> 
						Cuti
					</div>
					<div className='flex gap-1 justify-center items-center'>
						<div className="w-3 h-3 bg-[#c2410c] rounded-full"></div> 
						Izin
					</div>
					<div className='flex gap-1 justify-center items-center'>
						<div className="w-3 h-3 bg-[#b91c1c] rounded-full"></div> 
						Tidak Masuk
					</div>
					<div className='flex gap-1 justify-center items-center'>
						<div className="w-3 h-3 bg-[#15803d] rounded-full"></div> 
						Masuk
					</div>
					<div className='flex gap-1 justify-center items-center'>
						<div className="w-3 h-3 bg-black rounded-full"></div> 
						Telat Masuk
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default CalendarView;
