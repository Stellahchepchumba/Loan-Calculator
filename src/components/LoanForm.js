import React, { useState } from "react";

function LoanForm({ onCalculate, onExport }) {
  const [loanDetails, setLoanDetails] = useState({
    principal: "",
    interestRate: "",
    years: "",
  });
  const [frequency, setFrequency] = useState("monthly");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoanDetails({
      ...loanDetails,
      [name]: value === "" ? "" : parseFloat(value), 
    });
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  const handleCalculate = () => {
    onCalculate(loanDetails, frequency);
  };

  const handleExport = () => {
    onExport(loanDetails, frequency);
  };

  return (
    
    <div style={{width:"100%",padding:"24px"} }>
       <div style={{marginTop:"24px"}}>
      <h1 >Calculate Loan</h1>
      <div style={{color:"gray"}}>Please enter the loan information below.</div>
      </div>
      <div style={{marginTop:"24px"}}></div>
    <label style={{width:"100%"}}>
      
      <input
        className="form-control"
        type="number"
        name="principal"
        value={loanDetails.principal}
        placeholder="Principal"
        onChange={handleInputChange}
      />
    </label>
    <br />
    <br />
    <label style={{width:"100%"}}>
     
      <input
        className="form-control"
        type="number"
        name="interestRate"
        step="0.1"
        value={loanDetails.interestRate}
        placeholder="Interest Rate (%)"
        onChange={handleInputChange}
      />
    </label>
    <br />
    <br />
    <label style={{width:"100%"}}>
 
      <input
        className="form-control"
        type="number"
        name="years"
        value={loanDetails.years}
        placeholder="Period (Years)"
        onChange={handleInputChange}
      />
    </label>
    <br />
    <br />
    <label style={{width:"100%"}}>
      Payment Frequency:
      <select
        className="form-control"
        value={frequency}
        onChange={handleFrequencyChange}
      >
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </label>
    <br />
    <br />
    <button  className="btn btn-primary" onClick={handleCalculate}>
      Calculate
    </button>
    <button style={{marginLeft:"8px"}} className="btn btn-secondary" onClick={handleExport}>
      Export as CSV
    </button>
  </div>

  );
}

export default LoanForm;



