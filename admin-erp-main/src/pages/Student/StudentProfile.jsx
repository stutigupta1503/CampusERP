
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Image,
} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DEFAULT_IMAGE =
  'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';

function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchStudent() {
      try {
        setLoading(true);
        setError('');

        const result = await axios.get(
          `http://localhost:3000/student/${id}`
        );

        const studentData = result.data.data;

        if (!studentData) {
          throw new Error('Student not found');
        }

        if (!cancelled) {
          setStudent(studentData);
          setImageSrc(studentData.image || DEFAULT_IMAGE);
        }
      } catch (err) {
        console.error('Error fetching student:', err);

        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Unable to load student details.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchStudent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function formatDate(dateValue) {
    if (!dateValue) return 'N/A';

    // Handle date-only values without timezone-related date shifts.
    const dateString = String(dateValue);

    const dateOnlyMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (dateOnlyMatch) {
      return `${dateOnlyMatch[3]}/${dateOnlyMatch[2]}/${dateOnlyMatch[1]}`;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-GB');
  }

  function goToStudentList() {
    navigate('/students');
  }

  function goToEdit() {
    navigate('/edit/student/' + student._id);
  }

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !student) {
    return (
      <Container className="text-center my-5">
        <h4 className="text-danger">
          {error || 'Student not found.'}
        </h4>
        <Button variant="primary" onClick={goToStudentList}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <>
      <h2 className="text-center mb-4 text-primary fw-bold pb-2">
        Student Details
      </h2>

      <Container className="my-5 p-4 bg-light rounded-4">
        <Row className="align-items-center mb-4">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <Card className="shadow border-1 rounded-4 overflow-hidden">
              <Image
                src={imageSrc}
                alt="Student picture"
                className="p-2 img-fluid"
                thumbnail
                onError={() => setImageSrc(DEFAULT_IMAGE)}
                style={{
                  objectFit: 'cover',
                  height: '400px',
                  width: '100%',
                }}
              />
            </Card>
          </Col>

          <Col md={8}>
            <h2 className="fw-bold mb-3 border-bottom pb-2">
              {student.firstName} {student.lastName}
            </h2>

            <Row>
              <Col sm={6} className="mb-2">
                <strong>Enrollment No:</strong>{' '}
                {student.enrollmentNumber || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Date of Birth:</strong>{' '}
                {formatDate(student.dob)}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Gender:</strong> {student.gender || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Personal Email:</strong>{' '}
                {student.personalEmailId || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>College Email:</strong>{' '}
                {student.collegeEmailId || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Father's Name:</strong>{' '}
                {student.fatherName || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Mother's Name:</strong>{' '}
                {student.motherName || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Admission Year:</strong>{' '}
                {student.admissionYear || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Year:</strong> {student.year || 'N/A'}
              </Col>

              <Col sm={6} className="mb-2">
                <strong>Semester:</strong> {student.semester || 'N/A'}
              </Col>

              <Col sm={12} className="mb-2">
                <strong>Address:</strong>{' '}
                {[student.localAddressLine1, student.localAddressLine2]
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </Col>

              <Col sm={3} className="mb-2">
                <strong>City:</strong> {student.localCity || 'N/A'}
              </Col>

              <Col sm={3} className="mb-2">
                <strong>State:</strong> {student.localState || 'N/A'}
              </Col>

              <Col sm={3} className="mb-2">
                <strong>Pincode:</strong> {student.localPincode || 'N/A'}
              </Col>
            </Row>

            <div className="mt-4">
              <Button
                variant="primary"
                onClick={goToStudentList}
                className="me-2"
              >
                Back to List
              </Button>

              <Button
                variant="outline-secondary"
                onClick={goToEdit}
              >
                Edit Profile
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default StudentProfile;
