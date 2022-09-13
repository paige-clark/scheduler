import React from 'react';
import 'components/Appointment/styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  // console.log('MODE:');
  // console.log(mode);

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

  function saveInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    onSave();
    props.bookInterview(props.id, interview).then(() => {
      onComplete();
    })
    .catch((err) => {
      transition(ERROR_SAVE, true);
    });
  }

  function cancelInterview(id) {
    onDelete();
    props
      .cancelInterview(id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        transition(ERROR_DELETE, true);
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
          onEdit={() => transition(CREATE)}
        />
      )}
      {mode === CREATE && (
        <Form
          student={props.interview ? props.interview.student : ''}
          interviewer={props.interview ? props.interview.interviewer.id : null}
          interviewers={props.interviewers}
          onSave={saveInterview}
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
      {mode === ERROR_SAVE && <Error onClose={back} message="Could not save changes." />}
      {mode === ERROR_DELETE && <Error onClose={back} message="Could not cancel appointment." />}
    </article>
  );
}
