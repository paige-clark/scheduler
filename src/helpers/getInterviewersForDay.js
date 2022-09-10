export function getInterviewersForDay(state, day) {
  // console.log(state.days);
  if (!state.days.length) {
    return [];
  }

  const dayObj = state.days.find((dayItem) => {
    return dayItem.name === day;
  });

  if (!dayObj) {
    return [];
  }

  const dayAppointments = dayObj.interviewers.map((interviewer) => {
    return state.interviewers[interviewer];
  });

  return dayAppointments;
}
