import React from "react";
import { Table } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import "./AdminProfilePage.css";
import Image from "react-bootstrap/Image";

const AdminProfilePage = () => {
  // Static user data, as no backend logic is used
  const user = {
    firstName: "John", // Example static data
    lastName: "Doe",   // Example static data
    username: "johndoe123",
    phoneNumber: "+1234567890",
    roles: [{ roleName: "Admin" }],
    active: true,
  };

  return (
    <div className="adminProfilePage__container">
      <div className="adminProfilePage__sidebar">
        <Sidebar />
      </div>
      <div className="adminProfilePage__content">
       

        <Table bordered className="adminProfilePage__content--table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{user.username}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{user.phoneNumber}</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>{user.roles[0].roleName}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{`${user.active}`}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProfilePage;