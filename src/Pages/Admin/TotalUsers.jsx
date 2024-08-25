import React from 'react';
import { useSelector } from 'react-redux';
import './Admin.css';

const TotalUsers = () => {

const users = useSelector(state => state.users.data);




  return (
    <section className="totaluser-container">
    <h5>All User</h5>
    <table>
      <thead>
        <tr>
          <th>S.No.</th>
          <th>Name</th>
          <th>Email</th>
          <th>uid</th>
          <th>Role</th>
          <th>Register Date</th>
        </tr>
      </thead>
      <tbody>
        {users.slice().sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)).map((items, index) => (
          <tr key={items.id}>
          <td>{index+1}</td>
          <td>{items.name}</td>
          <td>{items.email}</td>
          <td>{items.uid}</td>
          <td>{items.role}</td>
          <td>{items.registrationDate}</td>
        </tr>
        ))
        }
      </tbody>
    </table>
  </section>
  )
}

export default TotalUsers;
