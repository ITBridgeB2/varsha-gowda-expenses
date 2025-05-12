import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import ExpenseDetails from './ExpenseDetails';

function App() {
  const appContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#2e3a59',
    marginBottom: '30px'
  };

  return (
    <Router>
      <div style={appContainerStyle}>
        <h1 style={headingStyle}>💰 Expense Tracker</h1>
        <Routes>
          <Route path="/" element={<ExpenseList />} />
          <Route path="/add" element={<ExpenseForm />} />
          <Route path="/expenses/:id" element={<ExpenseDetails />} />
          <Route path="/expenses/:id/edit" element={<ExpenseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
