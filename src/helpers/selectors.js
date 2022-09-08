export function getAppointmentsForDay(state, day) {
  if (!state.days.length) {
    return [];
  }

  const dayObj = state.days.find((dayItem) => {
    return dayItem.name === day;
  });

  if (!dayObj) {
    return [];
  }

  const dayAppointments = dayObj.appointments.map((appointment) => {
    return state.appointments[appointment];
  });

  return dayAppointments;
}
