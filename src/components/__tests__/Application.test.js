import React from 'react';
import axios from 'axios';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  // prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  // mockRejected,
} from '@testing-library/react';
import Application from 'components/Application';

afterEach(cleanup);

describe('Application', () => {
  // TEST 01:
  it('defaults to Monday and changes the schedule when a new day is selected', () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText('Monday'));
  });

  // keeping this as a reminder of how this worked pre async
  //TEST 02:
  // it("defaults to Monday and changes the schedule when a new day is selected", () => {
  //   const { getByText } = render(<Application />);

  //   return waitForElement(() => getByText("Monday")).then(() => {
  //     fireEvent.click(getByText("Tuesday"));
  //     expect(getByText("Leopold Silvers")).toBeInTheDocument();
  //   });
  // });

  // TEST 02: async/await refactor
  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText('Monday'));
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  // TEST 03
  it('loads data, books an interview and reduces the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);
    
    // get info after app loads
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointments = getAllByTestId(container, 'appointment');

    const appointment = appointments[0];
    // 4 x events needed to trigger appointment save
    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    // while site saves, expect saving to be on screen
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // wait for Lydia to be on screen
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // confirm that no spots remaining shows when monday is full
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  // TEST 04
  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // render the Application.
    const { container } = render(<Application />);

    // wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    // check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you want to delete?')
    ).toBeInTheDocument();

    // click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    // wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  // TEST 05
  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // render the application
    const { container } = render(<Application />);
    // wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    // click on the edit button
    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));
    // change the name value and maybe interviewer)
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Swabby McDouglas' },
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    // click save
    fireEvent.click(getByText(appointment, 'Save'));
    // confirm Save is on screen
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
    // check to see if new name is on screen
    await waitForElement(() => getByText(appointment, 'Swabby McDouglas'));
    // check that day still has one spot available
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });


  // TEST 06
  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce(new Error('Error'));

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    // 4 x events needed to trigger appointment save
    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Could not save changes.')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });


  // TEST 07
  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce(new Error('error'));

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );
    
    fireEvent.click(getByAltText(appointment, 'Delete'));
    fireEvent.click(getByText(appointment, 'Confirm'));

    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Could not cancel appointment.')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });
});
