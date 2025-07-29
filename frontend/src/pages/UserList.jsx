import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFileCsv } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';
import UserTable from '../components/UserTable';

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      // If pagination is needed later, update page & limit accordingly
      const res = await API.get(`/users?page=1&limit=100`);
      setUsers(res.data.users); // backend returns { users, totalPages, currentPage }
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers(); // Refresh user list
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleExport = async () => {
    try {
      const res = await API.get('/users/export/csv', {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'users.csv';
      link.click();
    } catch (err) {
      toast.error('CSV export failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>User Management Dashboard</h2>
      <div className="actions">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchUsers}>Search</button>
        <button onClick={() => navigate('/add')}>
          <FaPlus /> Add User
        </button>
        <button onClick={handleExport}>
          <FaFileCsv /> Export to CSV
        </button>
      </div>

      <UserTable users={users} onDelete={handleDelete} />
      <ToastContainer />
    </div>
  );
}

export default UserList;
