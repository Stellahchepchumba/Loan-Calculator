import React, { useState } from "react";
import LoanForm from "./components/LoanForm";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [schedule, setSchedule] = useState([]);
  const [payment, setPayment] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleCalculate = async (loanDetails, frequency) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/loans/calculate`,
        loanDetails,
        { params: { frequency } }
       
      );
      const scheduleData = response.data.amortizationSchedule;
      const headers = scheduleData[0].split(",");
      const rows = scheduleData.slice(1).map((row) => row.split(","));
      setPayment(response.data.monthlyPayment || 0);
      setSchedule({ headers, rows });
    } catch (error) {
      console.error("Error calculating loan:", error);
      alert("Failed to calculate the loan. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (loanDetails, frequency) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/loans/export`,
        loanDetails,
        { params: { frequency }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Amortization_Schedule.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-fluid" style={{marginTop:"120px"}}>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div style={{ borderRadius: "8px", backgroundColor: "transparent" }}>
              <div className="row">
                <div className="col-sm-12 col-lg-6 mt-2">
                  <div style={{ fontSize: "50px", fontWeight: "bold" }}>Loan Calculator</div>
                  <div style={{ fontSize: "medium", color: "gray" }}>Your digital tool for loan calculation</div>
                  <div className="d-flex align-start justify-content-start mud-width-full">
                    <img src="loginpage.png" style={{}} className="img-fluid" alt="Logo" />
                  </div>
                </div>
                <div className="col-sm-12 col-lg-6 mt-2">
                  <div style={{marginTop:"80px"}}>
                    <div style={{ padding: "8px" }}>
                      <div style={{ color: "black", fontSize: "xx-large" }}>Hi,</div>
                      <div style={{ color: "black", fontSize: "xx-large" }}>Welcome back.</div>
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label style={{ color: "gray" }} htmlFor="usr">Name:</label>
                      <input type="text" className="form-control" id="usr" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label style={{ color: "gray" }} htmlFor="pwd">Password:</label>
                      <input type="password" className="form-control" id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <br />
                    <button style={{ width: "100%" }} type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div class="container-fluid" className="App">
      
<div class="container-fluid">
<div class="row">
<div  class="col-sm-3"></div>

</div>
  <div class="row">
  <div className="col-sm-9">
  <div style={{marginTop:"24px"}}>
      <h1 >Loan Amortization Calculator</h1>
      <div style={{color:"gray"}}>A Loan Amortization Calculator is a tool designed to help individuals and businesses 
        calculate the breakdown of loan repayments over time.</div>
      </div>
      <div style={{marginTop:"24px"}}></div>
  {loading ? (
    <p aria-live="polite">Loading, please wait...</p>
  ) : (
    <>
      {schedule.rows && schedule.rows.length > 0 ? (
        <div>
          <h3>Amortization Schedule</h3>
          <h5>Payment Amount: KES {payment.toFixed(2)}</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                {schedule.headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
       <table class="table">
        <thead>
          <tr>
            <td>
            Year
              </td> 
              
            <td>Payment
              </td> 
              
            <td>Principal
              </td> 
              
            <td>Interest
              </td> 
              
            <td>Remaining Balance
              </td> 
          </tr>
        </thead>
        <tbody>
        <tr>
            <td colspan="5">
            <div class="alert alert-warning">
  <strong>Whoops!!!</strong> No Data found. 
</div>
              </td> 
              
           
          </tr>
        </tbody>
       </table>
      )}
    </>
  )}
</div>

    
    <div class="col-sm-3">
    <div style={{marginTop:"24px"}}></div>
    <LoanForm onCalculate={handleCalculate} onExport={handleExport} />
    </div>
  </div>
</div>

      
    
    </div>
  );
}

export default App;
