import React from 'react';
import classNames from 'classnames';
import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const dayClass = classNames('day-list__item ', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots,
  });

  // just saving this in case they wanted this rather than short circuiting
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
    <li className={dayClass} onClick={props.setDay}>
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
