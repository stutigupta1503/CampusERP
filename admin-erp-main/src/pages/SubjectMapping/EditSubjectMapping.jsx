import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";

function EditSubjectMapping() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branchs, setBranchs] = useState([]);

  const [show, setShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [session, setSession] = useState("");
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("1");
  const [semester, setSemester] = useState("1");

  useEffect(() => {
    async function loadData() {
      try {
        const [subjectRes, courseRes, branchRes, mappingRes] =
          await Promise.all([
            axios.get("http://localhost:3000/subjects/for/mapping"),
            axios.get("http://localhost:3000/courses/for/mapping"),
            axios.get("http://localhost:3000/branchs/for/mapping"),
            axios.get(`http://localhost:3000/subjectMapping/${id}`),
          ]);

        if (
          !subjectRes.data.success ||
          !courseRes.data.success ||
          !branchRes.data.success ||
          !mappingRes.data.success
        ) {
          throw new Error("Failed to load Subject Mapping");
        }

        setSubjects(subjectRes.data.data);
        setCourses(courseRes.data.data);
        setBranchs(branchRes.data.data);

        const mapping = mappingRes.data.data;

        setSession(mapping.session);
        setSubject(mapping.subject);
        setCourse(mapping.course);
        setBranch(mapping.branch);
        setYear(mapping.year);
        setSemester(mapping.semester);
      } catch (error) {
        console.log(error);
        alert(
          error.response?.data?.message ||
          error.message ||
          "Failed to load Subject Mapping"
        );
        navigate("/subjectsmap");
      } finally {
        setShowSpinner(false);
      }
    }

    loadData();
  }, [id, navigate]);

  async function handleUpdate(e) {
    e.preventDefault();
    setButtonDisabled(true);

    try {
      const result = await axios.put(
        `http://localhost:3000/edit/subjectMapping/${id}`,
        { session, subject, course, branch, year, semester }
      );

      if (result.data.success) {
        setShow(true);
      }
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        "Failed to update Subject Mapping"
      );
    } finally {
      setButtonDisabled(false);
    }
  }

  function handleClose() {
    setShow(false);
    navigate("/subjectsmap");
  }

  if (showSpinner) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Container className="mt-5">
        <h3 className="text-center mb-4 py-2 text-primary fw-bold">
          EDIT SUBJECT MAPPING
        </h3>
        <hr />

        <Form onSubmit={handleUpdate}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session</Form.Label>
                <Form.Select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  required
                >
                  <option value="">-- Select Session --</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subjects</Form.Label>
                <Form.Select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((s) => (
                    <option key={s.value} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Courses</Form.Label>
                <Form.Select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c.value} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Branch</Form.Label>
                <Form.Select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                >
                  <option value="">-- Select Branch --</option>
                  {branchs.map((b) => (
                    <option key={b.value} value={b.label}>
                      {b.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Semester</Form.Label>
                <Form.Select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-4">
            <Button
              onClick={() => navigate("/subjectsmap")}
              variant="secondary"
              type="button"
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={buttonDisabled}
            >
              Update Mapping
            </Button>
          </div>
        </Form>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Subject Mapping updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditSubjectMapping;
