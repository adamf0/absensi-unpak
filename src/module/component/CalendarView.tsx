import React, { createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import dayjs from 'dayjs';
import colors from 'tailwindcss/colors';
import { DateSelectArg, EventApi, EventClickArg, EventContentArg, EventSourceInput } from '@fullcalendar/core';
import Calendar, { TViewMode, useCalendarView } from '@/components/Calendar';
import Avatar from '@/components/Avatar';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardHeaderChild, CardBody } from '@/components/ui/Card';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import usersDb, { TUser } from '@/mocks/db/users.db';
import { TIcons } from '@/types/icons.type';

const CalendarView = (source:any) => {
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

	const INITIAL_EVENTS = [ //work as initialize
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
	// console.log(source, INITIAL_EVENTS)

	const CALENDAR_VIEW: {
		[key in TViewMode]: { key: TViewMode; text: string; icon: TIcons };
	} = {
		timeGridDay: { key: 'timeGridDay', text: 'Day', icon: 'HeroCalendar' },
		timeGridWeek: { key: 'timeGridWeek', text: 'Week', icon: 'HeroTableCells' },
		dayGridMonth: { key: 'dayGridMonth', text: 'Month', icon: 'HeroCalendarDays' },
		listWeek: { key: 'listWeek', text: 'List', icon: 'HeroClipboardDocumentCheck' },
	};

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		// eslint-disable-next-line no-alert
		// const title = prompt('Please enter a new title for your event');
		// const calendarApi = selectInfo.view.calendar;

		// calendarApi.unselect(); // clear date selection

		// if (title) {
		// 	calendarApi.addEvent({
		// 		id: title,
		// 		title,
		// 		start: selectInfo.startStr,
		// 		end: selectInfo.endStr,
		// 		allDay: selectInfo.allDay,
		// 	});
		// }
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		// eslint-disable-next-line no-restricted-globals,no-alert
		// if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
		// 	clickInfo.event.remove();
		// }
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
					initialEvents={INITIAL_EVENTS as EventSourceInput}
					editable
					selectable
					selectMirror
					dayMaxEvents={3}
					select={handleDateSelect}
					eventContent={renderEventContent}
					eventClick={handleEventClick}
					eventsSet={handleEvents}
					eventClassNames='truncate'
				/>
			</CardBody>
		</Card>
	);
};

export default CalendarView;
