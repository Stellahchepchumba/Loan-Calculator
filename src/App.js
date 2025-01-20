import React, { useState } from "react";
import LoanForm from "./components/LoanForm";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [schedule, setSchedule] = useState({ headers: [], rows: [] });
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
      <div className="container-fluid" style={{ marginTop: "120px" }}>
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div style={{ borderRadius: "8px", backgroundColor: "transparent" }}>
              <div style={{ fontSize: "50px", fontWeight: "bold" }}>Loan Calculator</div>
              <p style={{ color: "gray", fontSize: "medium" }}>
                Your digital tool for loan calculation
              </p>
              <img src="loginpage.png" className="img-fluid mb-4" alt="Logo" />
              <div>
                <div className="form-group">
                  <label style={{ color: "gray" }} htmlFor="username">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "gray" }} htmlFor="password">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render application after authentication
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-lg-9">
          <div className="mt-4">
            <h1>Loan Amortization Calculator</h1>
            <p style={{ color: "gray" }}>
              A Loan Amortization Calculator is a tool designed to help
              individuals and businesses calculate the breakdown of loan
              repayments over time.
            </p>
          </div>

          {loading ? (
            <p aria-live="polite">Loading, please wait...</p>
          ) : (
            <>
              {schedule.rows.length > 0 ? (
                <div className="mt-4">
                  <h3>Amortization Schedule</h3>
                  <h5>Payment Amount: KES {payment.toFixed(2)}</h5>
                  <table className="table table-striped mt-3">
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
                <div className="alert alert-warning mt-4">
                  <strong>Whoops!</strong> No data found.
                </div>
              )}
            </>
          )}
        </div>

        <div className="col-lg-3">
          <LoanForm onCalculate={handleCalculate} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}

export default App;
