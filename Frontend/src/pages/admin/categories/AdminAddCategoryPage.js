import React, { useState } from "react";
import "./AdminAddCategoryPage.css";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import FormContainer from "../../../components/FormContainer";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const AdminAddCategoryPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const newCategory = { title, description, createdAt: new Date() };

    try {
      // Add the new category to Firestore
      const docRef = await addDoc(collection(db, "categories"), newCategory);

      // Show success message
      swal("Category Added!", `${title} successfully added`, "success");

      // Clear form fields
      setTitle("");
      setDescription("");

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding category: ", error);
      swal("Error", "Failed to add category. Please try again.", "error");
    }
  };

  return (
    <div className="adminAddCategoryPage__container">
      <div className="adminAddCategoryPage__sidebar">
        <Sidebar />
      </div>
      <div className="adminAddCategoryPage__content">
        <FormContainer>
          <h2>Add Category</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                style={{ textAlign: "top" }}
                as="textarea"
                rows="5"
                placeholder="Enter Category Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              className="my-3 adminAddCategoryPage__content--button"
              type="submit"
              variant=""
            >
              Add
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
};

export default AdminAddCategoryPage;
