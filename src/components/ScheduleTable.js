import React from 'react';

function ScheduleTable({ payment, schedule }) {
  return (
    <div>
      <h3>Amortization Schedule</h3>
      <p>Payment: ${payment.toFixed(2)}</p>
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            {schedule[0]
              .split(',')
              .map((header, index) => (
                <th key={index}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
        {schedule.map((row, index) => {
  return (
    <tr key={index}>
      <td>{row.period}</td>
      <td>{row.payment}</td>
      <td>{row.principal}</td>
      <td>{row.interest}</td>
      <td>{row.balance}</td>
    </tr>
  );
})}         
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
