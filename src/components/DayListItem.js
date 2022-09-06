import React from 'react';
import classNames from 'classnames';
import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const dayClass = classNames('day-list__item ', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots,
  });

  // this can be implemented, however I was able to solve this with && conditionals
  // const formatSpots = function (spotsRemaining) {
  //   if (spotsRemaining > 1) {
  //     return `${spotsRemaining} spots remaining`;
  //   }
  //   if (spotsRemaining === 1) {
  //     return `1 spot remaining`;
  //   }
  //   if (!spotsRemaining) {
  //     return `no spots remaining`;
  //   }
  // };

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">
        {/* {formatSpots(props.spots)} */}
        {props.spots > 1 && <>{props.spots} spots remaining</>}
        {props.spots === 1 && <>1 spot remaining</>}
        {!props.spots && <>no spots remaining</>}
      </h3>
    </li>
  );
}
