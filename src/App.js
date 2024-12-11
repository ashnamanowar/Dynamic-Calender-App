import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventModal from './EventModal';

// Function to generate a calendar.
const generateCalendar = (month, year) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const calendar = [];
  let day = 1;

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        week.push(null);
      } else if (day <= daysInMonth) {
        week.push(day);
        day++;
      } else {
        week.push(null);
      }
    }
    calendar.push(week);
  }
  return calendar;
};

const CalendarApp = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState({}); 
  const [currentEvent, setCurrentEvent] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
    category: ''
  });


  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
    setEvents(storedEvents);
  }, []);

  //saving
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const calendar = generateCalendar(currentMonth, currentYear);

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
      setShowModal(true);
      const selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;
      const event = events[selectedDate] || [];
      setCurrentEvent(event[0] || { name: '', startTime: '', endTime: '', description: '', category: '' });
    }
  };

  const handleAddEvent = () => {
    const newEvent = {
      name: currentEvent.name,
      startTime: currentEvent.startTime,
      endTime: currentEvent.endTime,
      description: currentEvent.description,
      category: currentEvent.category
    };

    const newEvents = { ...events };
    const eventDate = `${selectedDay}/${currentMonth + 1}/${currentYear}`;
    if (!newEvents[eventDate]) {
      newEvents[eventDate] = [];
    }
    newEvents[eventDate].push(newEvent);
    setEvents(newEvents);
    setShowModal(false);
  };

  const handleDeleteEvent = (index) => {
    const eventDate = `${selectedDay}/${currentMonth + 1}/${currentYear}`;
    const newEvents = { ...events };
    newEvents[eventDate].splice(index, 1); 
    setEvents(newEvents);
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const isCurrentDay = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const getBulletColor = (category) => {
    switch (category) {
      case 'work':
        return 'pink';
      case 'personal':
        return 'green';
      case 'others':
        return 'yellow';
      default:
        return 'black';
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Dynamic Event Calendar</h2>
      <div className="text-center">
        <Button variant="dark my-4" onClick={handlePrevMonth}>Previous</Button>
        <span className="mx-3">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </span>
        <Button variant="dark my-4" onClick={handleNextMonth}>Next</Button>
      </div>


      <div className="row text-center mb-2 mx-2" style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Mon</div>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Tue</div>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Wed</div>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Thu</div>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Fri</div>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Sat</div>
        <div className="col mx-2" style={{ padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>Sun</div>
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid mt-4">
        {calendar.map((week, index) => (
          <div className="row" key={index}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`col text-center p-3 ${isCurrentDay(day) ? 'bg-info text-white' : ''}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  color: day ? 'black' : '#ccc'
                }}
                onClick={() => handleDayClick(day)}
              >
                {day}
                {/* event display bullet wise */}
                {day && events[`${day}/${currentMonth + 1}/${currentYear}`] && events[`${day}/${currentMonth + 1}/${currentYear}`].map((event, index) => (
                  <div key={index} style={{ marginTop: '5px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: getBulletColor(event.category),
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '5px',
                    }} />
                    <span style={{ fontSize: '12px' }}>{event.name}</span>
                    <div style={{ fontSize: '10px', color: '#555' }}>
                      {event.startTime} - {event.endTime}
                    </div>
                    <div style={{ fontSize: '10px', color: '#777' }}>
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>


      <EventModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedDay={selectedDay}
        events={events}
        setEvents={setEvents}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        handleEventChange={handleEventChange}
        handleAddEvent={handleAddEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarApp;
