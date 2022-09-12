import React from 'react';
import 'components/Appointment/styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';
import Confirm from './Confirm';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  // console.log('PROPS:');
  // console.log(props);

  function onSave() {
    transition(SAVING);
  }

  function onComplete() {
    transition(SHOW);
  }

  function onDelete() {
    transition(DELETING);
  }

  function onConfirm() {
    transition(CONFIRM);
  }

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    onSave();
    props.bookInterview(props.id, interview).then(() => {
      onComplete();
    });
  }

  function cancelInterview(id) {
    onDelete();
    props.cancelInterview(id).then(() => {
      transition(EMPTY);
    });
  }

  function confirm() {
    onConfirm();
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirm}
        />
      )}
      {mode === CREATE && (
        <Form
          student=""
          interviewer={null}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={() => cancelInterview(props.id)}
          onCancel={back}
          message={'Are you sure you want to delete?'}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
    </article>
  );
}
