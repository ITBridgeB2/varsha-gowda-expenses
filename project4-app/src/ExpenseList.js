import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/expenses');
      setExpenses(res.data);

      const newTotal = res.data.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      setTotal(newTotal);
    } catch (err) {
      setError('Error fetching expenses. Please try again later.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this expense?")) {
        await axios.delete(`http://localhost:5000/expenses/${id}`);
        fetchExpenses();
      }
    } catch (err) {
      setError('Error deleting expense. Please try again later.');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>All Expenses</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
        <strong>Total Spent:</strong> ${total.toFixed(2)}
      </p>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link to="/add" style={{ textDecoration: 'none', color: '#fff', backgroundColor: '#4CAF50', padding: '10px 20px', borderRadius: '5px' }}>Add New Expense</Link>
      </div>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {expenses.map(exp => {
          const amount = parseFloat(exp.amount);
          return (
            <li key={exp.id} style={{ backgroundColor: '#f9f9f9', margin: '10px 0', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: '5px 0', fontSize: '16px' }}>
                <strong>{exp.date}</strong> - {exp.category}: ${amount.toFixed(2)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to={`/expenses/${exp.id}`} style={{ color: '#007BFF', textDecoration: 'none' }}>View</Link>
                <button 
                  onClick={() => deleteExpense(exp.id)} 
                  style={{ 
                    backgroundColor: '#F44336', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ExpenseList;