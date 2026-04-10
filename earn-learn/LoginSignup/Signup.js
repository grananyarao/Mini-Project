import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = e => setForm({ ...form, role: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <select name="role" value={form.role} onChange={handleRoleChange}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Signup</button>
      {error && <div style={{color: "red"}}>{error}</div>}
    </form>
  );
};
export default Signup;
