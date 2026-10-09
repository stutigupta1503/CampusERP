import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function TimeslotEdit() {
  let navigate = useNavigate();
  let params = useParams();

  let [timeslot, setTimeslot] = useState({
    startTime: "",
    endTime: "",
    lecture: "",
    facultyName: "", 
  });
  let [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate("/timeslots");
  };

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    setTimeslot((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function doEditTimeslot(e) {
    e.preventDefault();

    axios({
      url: "http://localhost:3000/edit/timeslot/" + params.id,
      method: "put",
      data: {
        session: {
          startTime: timeslot.startTime,
          endTime: timeslot.endTime,
        },
        lecture: timeslot.lecture,
        facultyName: timeslot.facultyName, 
        subject: timeslot.subject,
      },
    })
      .then((result) => {
        
        if (result.data.timeslot || result.status === 200) {
          setShow(true);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server Error: " + (err.response?.data?.error || err.message));
      });
  }

  useEffect(() => {
    axios({
      url: "http://localhost:3000/timeslot/" + params.id,
      method: "get",
    })
      .then((result) => {
        
        let data = result.data; 

        if (data) {
          setTimeslot({
            startTime: data.session?.startTime || "",
            endTime: data.session?.endTime || "",
            lecture: data.lecture || "",
            facultyName: data.facultyName || "", 
            subject: data.subject || "",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching data: " + err.message);
      });
  }, [params.id]);

  return (
    <Container>
      <Form onSubmit={doEditTimeslot}>
        <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">
          UPDATE Timeslot
        </h3>

        {/* Start Time & End Time */}
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={timeslot.startTime}
              onChange={handleChange}
              name="startTime"
              required
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={timeslot.endTime}
              onChange={handleChange}
              name="endTime"
              required
            />
          </Form.Group>
        </Row>

        {/* Lecture & Faculty */}
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Lecture</Form.Label>
            <Form.Control
              type="text"
              value={timeslot.lecture}
              onChange={handleChange}
              name="lecture"
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Faculty Name</Form.Label>
            <Form.Control
              type="text"
              value={timeslot.facultyName}
              onChange={handleChange}
              name="facultyName" 
            />
          </Form.Group>
        </Row>

        {/* Subject */}
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              value={timeslot.subject}
              onChange={handleChange}
              name="subject"
            />
          </Form.Group>
          <Col></Col>
        </Row>

        {/* Buttons */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button
            onClick={() => navigate("/timeslots")}
            variant="secondary"
            type="button"
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </div>
      </Form>

      {/* Success Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Timeslot Updated successfully👍</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default TimeslotEdit;
