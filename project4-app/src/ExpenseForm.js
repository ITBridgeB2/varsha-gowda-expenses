import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ExpenseForm() {
  const [form, setForm] = useState({ amount: '', category: '', date: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/expenses/${id}`).then(res => setForm(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, category, date } = form;
    if (!amount || !category || !date) return alert("All fields required");

    try {
      if (id) {
        await axios.put(`http://localhost:5000/expenses/${id}`, form);
      } else {
        await axios.post('http://localhost:5000/expenses', form);
      }
      navigate('/');
    } catch (err) {
      alert("Error saving expense");
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>{id ? 'Edit' : 'Add'} Expense</h2>
      <input
        type="number"
        step="0.01"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        placeholder="Amount"
        required
        style={inputStyle}
      />
      <input
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        placeholder="Category"
        required
        style={inputStyle}
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>
        {id ? 'Update' : 'Add'} Expense
      </button>
    </form>
  );
}

export default ExpenseForm;