import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList';

import React, { useState } from 'react';

export default function Form(props) {
  // console.log(props);
  const [student, setStudent] = useState(props.student || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const reset = () => {
    setStudent('');
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    props.onCancel();
  };

  // const save = () => {
  //   return console.log([student, interviewer]);
  // }

  /*
  As part of our Edit story, the <Form> component should take
  the following props:

  student:String
  interviewer:Number
  interviewers:Array
  onSave:Function
  onCancel:Function

  As part of our Create story, the <Form> component should take
  the following props:

  interviewers:Array
  onSave:Function
  onCancel:Function
  */
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={() => props.onSave(student, interviewer)}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}