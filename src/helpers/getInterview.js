export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const returnObj = {};
  if(interview.interviewer) {
    returnObj["student"] = interview.student;
    returnObj["interviewer"] = {...state.interviewers[interview.interviewer]};
  }
  return returnObj;
}

/*
INTAKE: a state object, an interview object
- check if there is an interview.interviewer
  - if there is, we want to look through state.interviewers for an
    interviews whose ID matches interview.interviewer(ie. 2)
  - also we want to start sculpting a return obj, starting with interview.student
OUTPUT: if an appointment is found, return the oject with the interview data

The function should return a new object containing the interview data when we pass it
an object that contains the interviewer. Otherwise, the function should return null.
The object it returns should look like this:

{  
  "student": "Lydia Miller-Jones",
  "interviewer": {  
    "id": 1,
    "name": "Sylvia Palmer",
    "avatar": "https://i.imgur.com/LpaY82x.png"
  }
} 

// interview:
  { student: 'Archie Cohen', interviewer: 2 }

// state.interviewers:
  {
    '1': {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png'
    },
    '2': {
      id: 2,
      name: 'Tori Malcolm',
      avatar: 'https://i.imgur.com/Nmx0Qxo.png'
    }
  }
 */