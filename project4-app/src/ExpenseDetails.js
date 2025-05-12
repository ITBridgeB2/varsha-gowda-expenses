import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ExpenseDetails() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/expenses/${id}`)
      .then(res => setExpense(res.data))
      .catch(() => {
        setError('Expense not found.');
      });
  }, [id]);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>;
  }

  if (!expense) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Expense Details</h2>
      <p><strong>Amount:</strong> ${parseFloat(expense.amount).toFixed(2)}</p>
      <p><strong>Category:</strong> {expense.category}</p>
      <p><strong>Date:</strong> {expense.date}</p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to={`/expenses/${id}/edit`} style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
        }}>
          Edit
        </Link>
      </div>
    </div>
  );
}

export default ExpenseDetails;
