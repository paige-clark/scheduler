import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  // iterate through the array of days passed in
  const days = props.days.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={() => props.setDay(day.name)}
      />
    );
  });

  return <ul>{days}</ul>;
}
