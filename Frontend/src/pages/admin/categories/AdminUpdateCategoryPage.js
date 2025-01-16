import React, { useState, useEffect } from "react";
import "./AdminUpdateCategoryPage.css";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import { useParams, useNavigate } from "react-router-dom";
import FormContainer from "../../../components/FormContainer";
import Sidebar from "../../../components/Sidebar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { updateDoc } from "firebase/firestore"; 

const AdminUpdateCategoryPage = () => {
  const navigate = useNavigate();
  const { catId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching category with ID:", catId); // Log the correct catId
    const fetchCategory = async () => {
      try {
        const categoryRef = doc(db, "categories", catId);
        const categorySnap = await getDoc(categoryRef);
  
        if (categorySnap.exists()) {
          const categoryData = categorySnap.data();
          setTitle(categoryData.title);
          setDescription(categoryData.description);
        } else {
          swal("Category Not Found", "This category does not exist.", "error");
          navigate("/adminCategories");
        }
      } catch (error) {
        console.error("Error fetching category: ", error);
        swal("Error", "Failed to fetch category. Please try again.", "error");
        navigate("/adminCategories");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategory();
  }, [catId, navigate]);
  
  

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const categoryRef = doc(db, "categories", catId); // Reference to the document
      await updateDoc(categoryRef, { title, description }); // Use updateDoc to update the fields
  
      swal("Category Updated!", `${title} successfully updated`, "success");
      navigate("/adminCategories"); // Navigate back after success
    } catch (error) {
      console.error("Error updating category: ", error);
      swal("Error", "Failed to update category. Please try again.", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="adminUpdateCategoryPage__container">
      <div className="adminUpdateCategoryPage__sidebar">
        <Sidebar />
      </div>
      <div className="adminUpdateCategoryPage__content">
        <FormContainer>
          <h2>Update Category</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="Enter Category Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button
              className="my-3 adminUpdateCategoryPage__content--button"
              type="submit"
            >
              Update
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
};

export default AdminUpdateCategoryPage;
