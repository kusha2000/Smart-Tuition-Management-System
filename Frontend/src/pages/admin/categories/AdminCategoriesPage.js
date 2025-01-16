import React, { useState, useEffect } from "react";
import "./AdminCategoriesPage.css";
import { useNavigate } from "react-router-dom";
import { Button, ListGroup } from "react-bootstrap";
import swal from "sweetalert";
import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../config/firebase"; // Import Firebase configuration
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const AdminCategoriesPage = () => {
  const navigate = useNavigate();

  // State to manage categories
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesCollection = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryClickHandler = (catId) => {
    navigate(`/adminQuizzes/?catId=${catId}`);
  };

  const addNewCategoryHandler = () => {
    navigate("/adminAddCategory");
  };

  const updateCategoryHandler = (event, category) => {
    event.stopPropagation();
    navigate(`/adminUpdateCategory/${category.id}`);
  };

  const deleteCategoryHandler = async (event, category) => {
    event.stopPropagation();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          // Delete the category from Firestore
          await deleteDoc(doc(db, "categories", category.id));
          setCategories(categories.filter((cat) => cat.id !== category.id));
          swal(
            "Category Deleted!",
            `${category.title} successfully deleted`,
            "success"
          );
        } catch (error) {
          console.error("Error deleting category: ", error);
          swal("Error", "Failed to delete category. Please try again.", "error");
        }
      } else {
        swal(`${category.title} is safe`);
      }
    });
  };

  return (
    <div className="adminCategoriesPage__container">
      <div className="adminCategoriesPage__sidebar">
        <Sidebar />
      </div>
      <div className="adminCategoriesPage__content">
        <h2>Categories</h2>
        {loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <Message>No categories are present. Try adding some categories.</Message>
        ) : (
          categories.map((cat, index) => (
            <ListGroup
              className="adminCategoriesPage__content--categoriesList"
              key={index}
            >
              <ListGroup.Item
                style={{ borderWidth: "0px" }}
                className="d-flex"
                onClick={() => categoryClickHandler(cat.id)}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{cat.title}</div>
                  {cat.description}
                </div>

                <div
                  style={{
                    display: "flex",
                    height: "90%",
                    margin: "auto 2px",
                  }}
                >
                  <div
                    onClick={(event) => updateCategoryHandler(event, cat)}
                    style={{
                      margin: "2px 8px",
                      textAlign: "center",
                      color: "rgb(68 177 49)",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Update
                  </div>

                  <div
                    onClick={(event) => deleteCategoryHandler(event, cat)}
                    style={{
                      margin: "2px 8px",
                      textAlign: "center",
                      color: "red",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </div>
                </div>
              </ListGroup.Item>
            </ListGroup>
          ))
        )}
        <Button
          variant=""
          className="adminCategoriesPage__content--button"
          onClick={addNewCategoryHandler}
        >
          Add Category
        </Button>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
