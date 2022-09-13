import { useState, useEffect } from 'react';
import axios from 'axios';
// import { getAppointmentsForDay } from 'helpers/selectors';

export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => {
    setState({ ...state, day });
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: [...all[0].data],
        appointments: { ...all[1].data },
        interviewers: { ...all[2].data },
      }));
    });
  }, []);

  function calculateSpots(id, appointments) {
    // find the current day's index within the days array
    const dayIndex = state.days.findIndex((day) => state.day === day.name);

    // get the current day from the days array
    const currentDay = state.days[dayIndex];

    // find how many spots are left for a day
    const spots = currentDay.appointments.filter(
      (appointmentId) => !appointments[appointmentId].interview
    ).length;
    
    // build a new day with the updated spots
    const day = {
      ...state.days[dayIndex],
      spots,
    };

    // update the days array with the new day object
    const days = [...state.days];
    days[dayIndex] = day;
    return days;
  }

  // book an interview
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      console.log('DID IT');
      setState((prev) => ({
        ...prev,
        appointments,
      }));
      let days = calculateSpots(id, appointments);
      setState((prev) => ({ ...prev, days }));
    });
  }

  // cancel an interview
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
        let days = calculateSpots(id, appointments);
        setState((prev) => ({ ...prev, days }));
      });
  }

  return { state, setDay, cancelInterview, bookInterview };
}

/*
days:
[
{
"id": 1,
"name": "Monday",
"appointments": [1,2,3,4,5],
"interviewers": [1,2,5,6,10],
"spots": 3
},


interviewers:
{
"1": {
"id": 1,
"name": "Sylvia Palmer",
"avatar": "https://i.imgur.com/LpaY82x.png"
},
"2": {
"id": 2,
"name": "Tori Malcolm",
"avatar": "https://i.imgur.com/Nmx0Qxo.png"
},
"3": {
"id": 3,
"name": "Mildred Nazir",
"avatar": "https://i.imgur.com/T2WwVfS.png"
}

appointments:
{
"1": {
"id": 1,
"time": "12pm",
"interview": {
"student": "Archie Cohen",
"interviewer": 1
}
},
"2": {
"id": 2,
"time": "1pm",
"interview": null
},
"3": {
"id": 3,
"time": "2pm",
"interview": null
}
*/
