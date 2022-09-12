import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'components/Application.scss';
import DayList from './DayList';
import Appointment from './Appointment';
import { getAppointmentsForDay } from 'helpers/selectors';
import { getInterview } from 'helpers/getInterview';
import { getInterviewersForDay } from 'helpers/getInterviewersForDay';

export default function Application(props) {
  // how we change state before state refactor
  // const [selectedDay, setDay] = useState('Monday');
  // const [days, setDays] = useState([]);
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  // console.log(dailyInterviewers);

  const setDay = (day) => {
    setState({ ...state, day });
  };

  // how we setDays before Promise.all:
  // const setDays = (days) => {
  //   setState((prev) => ({ ...prev, days }));
  // };

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers'),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: [...all[0].data],
        appointments: { ...all[1].data },
        interviewers: { ...all[2].data },
      }));
    });
    // how we made the axios call before the Promise.all:
    // axios.get('/api/days').then((response) => {
    //   // setDays([...response.data]);
    // });
  }, []);

  function bookInterview(id, interview) {
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    // console.log(interview);
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        console.log('DID IT');
        setState((prev) => ({
          ...prev,
          appointments,
        }));
      });
  }

  function cancelInterview(id) {
    console.log('Cancelling interview: ' + id);
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .delete(`/api/appointments/${id}`, { interview: null })
      .then(() => {
        console.log('DID IT');
        setState((prev) => ({
          ...prev,
          appointments,
        }));
      });
  }

  // console.log(state);

  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    // const interviewer = getInterviewersForDay(state, appointment.interview);
    // console.log('INTERVIEWER')
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
