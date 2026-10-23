import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function FacultyEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [faculty, setFaculty] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchFaculty() {
      try {
        setLoading(true);
        setError("");

        const result = await axios.get(
          `http://localhost:3000/faculty/${id}`
        );

        if (!result.data.success || !result.data.data) {
          throw new Error("Faculty record not found.");
        }

        if (!cancelled) {
          const data = result.data.data;

          setFaculty({
            ...data,
            dob: data.dob
              ? new Date(data.dob).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load faculty details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchFaculty();
    } else {
      setError("Faculty ID is missing.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFaculty((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function doEditFaculty(e) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const updatedFaculty = {
        ...faculty,
        mobileNo: Number(faculty.mobileNo),
        emergencyMobileNo: Number(faculty.emergencyMobileNo),
        teachingExperience: Number(faculty.teachingExperience),
        industryExperience: Number(faculty.industryExperience),
        researchExperience: Number(faculty.researchExperience),
      };

      const result = await axios.put(
        `http://localhost:3000/edit/faculty/${id}`,
        updatedFaculty
      );

      if (result.data.success) {
        setShow(true);
      } else {
        setError(result.data.message || "Failed to update faculty.");
      }
    } catch (err) {
      console.error("Faculty update error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Failed to update faculty. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setShow(false);
    navigate("/faculties", { replace: true });
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading faculty details...</p>
      </Container>
    );
  }

  if (error && !faculty._id) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/faculties")}>
          Back to Faculty List
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate("/faculties")}
        >
          ← Back to Faculty List
        </Button>

        <Button
          variant="outline-danger"
          type="button"
          onClick={() => navigate("/faculties")}
        >
          Cancel
        </Button>
      </div>

      <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">
        UPDATE FACULTY
      </h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={doEditFaculty}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              required
              name="firstName"
              value={faculty.firstName || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="lastName"
              value={faculty.lastName || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="personalEmail">
            <Form.Label>Personal Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="personalEmail"
              value={faculty.personalEmail || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="collegeId">
            <Form.Label>College ID</Form.Label>
            <Form.Control
              required
              name="collegeId"
              value={faculty.collegeId || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="mobileNo">
            <Form.Label>Mobile No.</Form.Label>
            <Form.Control
              required
              type="tel"
              name="mobileNo"
              value={faculty.mobileNo ?? ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="emergencyMobileNo">
            <Form.Label>Emergency Mobile No.</Form.Label>
            <Form.Control
              required
              type="tel"
              name="emergencyMobileNo"
              value={faculty.emergencyMobileNo ?? ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="motherName">
            <Form.Label>Mother's Name</Form.Label>
            <Form.Control
              required
              name="motherName"
              value={faculty.motherName || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="fatherName">
            <Form.Label>Father's Name</Form.Label>
            <Form.Control
              required
              name="fatherName"
              value={faculty.fatherName || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={faculty.gender || "male"}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="marriedStatus">
            <Form.Label>Married Status</Form.Label>
            <Form.Select
              name="marriedStatus"
              value={faculty.marriedStatus || "not married"}
              onChange={handleChange}
            >
              <option value="not married">Not Married</option>
              <option value="married">Married</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="dob">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              required
              type="date"
              name="dob"
              value={faculty.dob || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="thumbId">
            <Form.Label>Thumb ID</Form.Label>
            <Form.Control
              required
              name="thumbId"
              value={faculty.thumbId || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="collegeEmail">
            <Form.Label>College Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="collegeEmail"
              value={faculty.collegeEmail || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="designation">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              required
              name="designation"
              value={faculty.designation || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="highestQualification">
            <Form.Label>Highest Qualification</Form.Label>
            <Form.Control
              required
              name="highestQualification"
              value={faculty.highestQualification || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="totalExperience">
            <Form.Label>Total Experience</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="totalExperience"
              value={faculty.totalExperience ?? ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="teachingExperience">
            <Form.Label>Teaching Experience</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="teachingExperience"
              value={faculty.teachingExperience ?? ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="industryExperience">
            <Form.Label>Industry Experience</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="industryExperience"
              value={faculty.industryExperience ?? ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="researchExperience">
            <Form.Label>Research Experience</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="researchExperience"
              value={faculty.researchExperience ?? ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <div className="d-flex justify-content-center gap-2 mt-4 mb-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/faculties")}
          >
            Cancel
          </Button>

          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Faculty"}
          </Button>
        </div>
      </Form>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Faculty updated successfully.</Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Back to Faculty List
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FacultyEdit;
