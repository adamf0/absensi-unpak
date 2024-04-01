import moment, { Moment } from "moment";
import { useState, useEffect } from "react";
import CalendarProps from '../model/CalendarProps';

const CalendarComponent: React.FC<CalendarProps> = ({ events, click }) => {
    const [current, setCurrent] = useState<Moment>(moment().date(1));
    const [calendarEvents, setCalendarEvents] = useState<EventData[]>([]);

    useEffect(() => {
        setCalendarEvents(
            events.map((ev: any) => ({
                ...ev,
                date: current.clone().date(Math.random() * (29 - 1) + 1)
            }))
        );
    }, [events, current]);

    const drawHeader = () => {
        return (
            <div className="calendar-header row-container spaceAroundRow">
                <a href="#" className="" onClick={prevMonth}>&lt;</a>
                <span className="">{current.format('MMMM YYYY')}</span>
                <a href="#" className="" onClick={nextMonth}>&gt;</a>
            </div>
        );
    };

    const drawMonth = () => {
        const daysInMonth = current.daysInMonth();
        const currentMonth = current.month();
        const firstDay = moment(current).startOf('month').format('d'); // Day of the week of the first day of the month
        const blanks = Array.from({ length: Number(firstDay) }, (_, i) => (
            <li key={`empty-${i}`} className="disabled">{' '}</li>
        ));

        const month = Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const dayEvents = calendarEvents.filter(
                ev => moment(ev.tanggal).date() === d && moment(ev.tanggal).month() === currentMonth
            );

            let className = dayEvents.length > 0 ? `active ${dayEvents[0]['type']}` : 'active';
            if (d === moment().date() && currentMonth === moment().month()) {
                className = className + ' now';
            }

            return (
                <li
                    key={`day-${d}`}
                    className={className}
                    onClick={() => click(dayEvents)}
                >
                    {d}
                    {dayEvents.map((event, index) => ( //buat bullet indicator
                        <div
                            key={`event-${d}-${index}`}
                            className={`event-category ${event.type}`}
                        ></div>
                    ))}
                </li>
            );
        });

        const remainingDays = (7 - ((Number(firstDay) + daysInMonth) % 7)) % 7;
        const blanksAfter = Array.from({ length: remainingDays }, (_, i) => (
            <li key={`empty-${Number(firstDay) + daysInMonth + i}`} className="empty">{' '}</li>
        ));

        const totalSlots = [...blanks, ...month, ...blanksAfter];

        const rows:JSX.Element[][] = totalSlots.reduce((acc:JSX.Element[][], _day, i) => {
            if (i % 7 === 0) {
                acc.push(totalSlots.slice(i, i + 7));
            }
            return acc;
        }, []);

        return (
            <>
                <div className="calendar-sub-header grid">
                    <span>min</span>
                    <span>sen</span>
                    <span>sel</span>
                    <span>rab</span>
                    <span>kam</span>
                    <span>jum</span>
                    <span>sab</span>
                </div>
                <ol className="calendar-content grid">
                    {
                        rows.map((row, _i) => row)
                    }
                </ol>
            </>
        );
        
    };

    const drawLegend = () => {
        const calendars: LegendData[] = events.reduce((memo, e: EventData) => {
            if (!memo.find(item => item.name === e.type)) {
                memo.push({ name: e.type ?? "", color: e.type ?? "" });
            }
            return memo;
        }, [] as LegendData[]);

        return (
            <div className="legend">
                {calendars.map((cal, index) => (
                    <span key={index} className={`entry ${cal['color']}`}>
                        {cal['name']}
                    </span>
                ))}
            </div>
        );
    };

    const nextMonth = () => {
        setCurrent(current.clone().add(1, 'months'));
    };

    const prevMonth = () => {
        setCurrent(current.clone().subtract(1, 'months'));
    };

    return (
        <div className="calendar">
            {drawHeader()}
            {drawMonth()}
            {drawLegend()}
        </div>
    );
};

export default CalendarComponent;