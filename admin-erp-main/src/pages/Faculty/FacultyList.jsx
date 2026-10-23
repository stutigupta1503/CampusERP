import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import {
  Form,
  InputGroup,
  Button,
  Modal,
  Pagination,
  Spinner,
} from "react-bootstrap";

function FacultyList() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  const [pageNo, setPageNo] = useState(1);
  const [totalFaculties, setTotalFaculties] = useState(0);
  const [faculties, setFaculties] = useState([]);
  const [searchByFacultyName, setSearchByFacultyName] = useState("");

  const facultyPerPage = 5;
  const totalPages = Math.ceil(totalFaculties / facultyPerPage);

  async function fetchFaculties(page = pageNo) {
    try {
      const result = await axios.get("http://localhost:3000/faculties", {
        params: {
          firstName: searchByFacultyName,
          pageNo: page,
          limit: facultyPerPage,
        },
      });

      if (result.data.success) {
        setFaculties(result.data.data);
        setTotalFaculties(result.data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      alert(
        error.response?.data?.message || "Failed to load faculty list."
      );
    }
  }

  useEffect(() => {
    fetchFaculties(pageNo);
  }, [searchByFacultyName, pageNo]);

  function handleSearch(value) {
    setSearchByFacultyName(value);
    setPageNo(1);
  }

  function confirmDelete(faculty) {
    setFacultyToDelete(faculty);
  }

  async function doDeleteFaculty() {
    if (!facultyToDelete) return;

    const id = facultyToDelete._id;
    setDeletingId(id);

    try {
      const result = await axios.delete(
        `http://localhost:3000/delete/faculty/${id}`
      );

      if (result.data.success) {
        setFacultyToDelete(null);

        const remainingCount = totalFaculties - 1;
        const nextPage =
          faculties.length === 1 && pageNo > 1 ? pageNo - 1 : pageNo;

        setPageNo(nextPage);
        setTotalFaculties(remainingCount);
        await fetchFaculties(nextPage);

        alert("Faculty deleted successfully.");
      }
    } catch (error) {
      console.error("Delete faculty error:", error.response?.data || error);
      alert(
        error.response?.data?.message || "Failed to delete faculty."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleClose() {
    setShow(false);
  }

  function goToAddFacultyPage() {
    navigate("/add/faculty");
  }

  function goToEdit(id) {
    navigate("/edit/faculty/" + id);
  }

  return (
    <>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        List Of Faculty
      </h3>

      <InputGroup className="mb-3">
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>

        <Form.Control
          type="text"
          placeholder="Type Faculty Name to search"
          value={searchByFacultyName}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </InputGroup>

      <div className="d-flex justify-content-end mt-2">
        <Button variant="success" size="sm" onClick={goToAddFacultyPage}>
          Add Faculty +
        </Button>
      </div>

      <table className="table text-center table-hover mt-5">
        <thead>
          <tr>
            <th>Faculty Image</th>
            <th>Faculty Name</th>
            <th>Designation</th>
            <th>Highest Qualification</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
              <tr key={faculty._id}>
                <td>
                  <img
                    src={
                      faculty.facultyImage ||
                      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    }
                    height="50"
                    width="50"
                    alt="Faculty"
                  />
                </td>

                <td>
                  {faculty.firstName} {faculty.lastName}
                </td>

                <td>{faculty.designation}</td>
                <td>{faculty.highestQualification}</td>

                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    title="Edit faculty"
                    onClick={() => goToEdit(faculty._id)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Delete faculty"
                    disabled={deletingId !== null}
                    onClick={() => confirmDelete(faculty)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No faculty found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              disabled={pageNo === 1}
              onClick={() => setPageNo((prev) => prev - 1)}
            />

            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={pageNo === index + 1}
                onClick={() => setPageNo(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              disabled={pageNo === totalPages}
              onClick={() => setPageNo((prev) => prev + 1)}
            />
          </Pagination>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Faculty added successfully.</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={Boolean(facultyToDelete)}
        onHide={() => {
          if (deletingId === null) setFacultyToDelete(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {facultyToDelete?.firstName} {facultyToDelete?.lastName}
          </strong>
          ? This action cannot be undone.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={deletingId !== null}
            onClick={() => setFacultyToDelete(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            disabled={deletingId !== null}
            onClick={doDeleteFaculty}
          >
            {deletingId !== null ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FacultyList;
