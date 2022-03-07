import React from 'react';
import './ContextBarAggregator.css';

export default function ContextBarAggregator(props) {
  const { startDate, endDate } = props.value;
  return (
    <div className='ContextBarAggregator'>
      <div>
        <h4>From:</h4>
        <input type='date' disabled={false} onChange={props.handleDateChange} id='startDate' value={startDate} />
        <h4>To:</h4>
        <input type='date' onChange={props.handleDateChange} id='endDate' value={endDate} />
      </div>
      {props.children}
    </div>
  );
}
