import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserTable({ users, onDelete }) {
  const navigate = useNavigate();

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>#</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Status</th>
          <th>Location</th>
          <th>Profile</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr><td colSpan="8">No users found</td></tr>
        ) : (
          users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>
                <select defaultValue={user.status}>
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </select>
              </td>
              <td>{user.location}</td>
              <td>
                {user.profile ? (
                  <img
                    src={`http://localhost:5000/${user.profile}`}
                    alt="profile"
                    width={40}
                    height={40}
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <button onClick={() => navigate(`/view/${user._id}`)}>View</button>{' '}
                <button onClick={() => navigate(`/edit/${user._id}`)}>Edit</button>{' '}
                <button onClick={() => onDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;
