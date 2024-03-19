import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';

interface Event {
    eventName: string;
    tahun_akademik: string;
    eventLocation: string;
    calendar: string;
    color: string;
    color_dot: string;
    startdate: string;
    enddate: string;
    author: number;
    description: string;
  }
  
  interface CalendarProps {
    events: Event[];
  }

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [current, setCurrent] = useState<Moment>(moment().date(1));
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);

  useEffect(() => {
    const currentElem = document.querySelector('.today');
    if (currentElem instanceof HTMLElement) {
      const day = currentElem.textContent;
      if (day) {
        const timeout = window.setTimeout(() => {
          openDay(day);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  useEffect(() => {
    setCalendarEvents(
      events.map(ev => ({
        ...ev,
        date: current.clone().date(Math.random() * (29 - 1) + 1)
      }))
    );
  }, [events, current]);

//   const openDay = (day: Element) => {
//     console.log('Opening day:', day);
//   };
   const openDay = (date: string) => {
    const clickedEvent = events.find(ev => ev.startdate === date);
    if (clickedEvent) {
      console.log('Clicked event:', clickedEvent);
    } else {
      console.log('No event found for the clicked date');
    }
  };

  const drawHeader = () => {
    return (
      <div className="header">
        <h1>{current.format('MMMM YYYY')}</h1>
        <div className="right" onClick={nextMonth}>&gt;</div>
        <div className="left" onClick={prevMonth}>&lt;</div>
      </div>
    );
  };

  const drawMonth = () => {
    const daysInMonth = current.daysInMonth();
    const currentMonth = current.month();
    const firstDay = moment(current).startOf('month').format('d'); // Day of the week of the first day of the month
    const blanks = Array.from({ length: Number(firstDay) }, (_, i) => (
      <td key={`empty-${i}`} className="empty">{''}</td>
    ));

    const month = Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      const dayEvents = calendarEvents.filter(
        ev => ev.date.date() === d && ev.date.month() === currentMonth
      );

      let className =
        dayEvents.length > 0 ? 'day event' : 'day';
      if (
        d === moment().date() &&
        currentMonth === moment().month()
      ) {
        className = 'day today';
      }

      return (
        <td
          key={`day-${d}`}
          className={className}
          onClick={() => openDay(document.createElement('div'))}
        >
          <span>{d}</span>
          {dayEvents.map((event, index) => (
            <div
              key={`event-${d}-${index}`}
              className={`event-category ${event.color}`}
            ></div>
          ))}
        </td>
      );
    });

    const remainingDays = (7 - ((Number(firstDay) + daysInMonth) % 7)) % 7;
    const blanksAfter = Array.from({ length: remainingDays }, (_, i) => (
      <td key={`empty-${Number(firstDay) + daysInMonth + i}`} className="empty">{''}</td>
    ));

    const totalSlots = [...blanks, ...month, ...blanksAfter];

    const rows = totalSlots.reduce((acc, day, i) => {
      if (i % 7 === 0) {
        acc.push(totalSlots.slice(i, i + 7));
      }
      return acc;
    }, []);

    return (
      <table className="body">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day, index) => (
                <th key={`header-${index}`}>{day}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>{rows.map((row, i) => <tr key={`row-${i}`}>{row}</tr>)}</tbody>
      </table>
    );
  };

  const drawLegend = () => {
    const calendars = calendarEvents.reduce((memo, e) => {
      if (!memo.find(cal => cal.name === e.calendar)) {
        memo.push({ name: e.calendar, color: e.color });
      }
      return memo;
    }, []);

    return (
      <div className="legend">
        {calendars.map((cal, index) => (
          <span key={index} className={`entry ${cal.color}`}>
            {cal.name}
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
    <div id="calendar">
      {drawHeader()}
      {drawMonth()}
      {drawLegend()}
    </div>
  );
};

export function App() {
  const data: Event[] = [
    { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange' }
  ];

  return <Calendar events={data} />;
}