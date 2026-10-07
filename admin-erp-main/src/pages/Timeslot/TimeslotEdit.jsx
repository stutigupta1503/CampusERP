
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function TimeslotEdit() {
  let navigate = useNavigate();
  let params = useParams();

  let [timeslot, setTimeslot] = useState({});
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

  function doEditTimeslot(id) {
    axios({
      url: "http://localhost:3000/edit/timeslot/" + id,
      method: "put",
      data: {
        session: {
          startTime: timeslot.startTime,
          endTime: timeslot.endTime,
        },
        lecture: timeslot.lecture,
        faculty: timeslot.faculty,
        subject: timeslot.subject,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios({
      url: "http://localhost:3000/timeslot/" + params.id,
      method: "get",
    })
      .then((result) => {
        let data = result.data.data;

        setTimeslot({
          startTime: data.session.startTime,
          endTime: data.session.endTime,
          lecture: data.lecture,
          faculty: data.faculty,
          subject: data.subject,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }, [params]);

  return (
    <Container>
      <Form>

        <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">
          UPDATE Timeslot
        </h3>

        {/* Start Time & End Time */}
        <Row className="mb-3">

          <Form.Group as={Col}>
            <Form.Label>Start Time</Form.Label>

            <Form.Control
              type="time"
              value={timeslot.startTime || ""}
              onChange={handleChange}
              name="startTime"
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>End Time</Form.Label>

            <Form.Control
              type="time"
              value={timeslot.endTime || ""}
              onChange={handleChange}
              name="endTime"
            />
          </Form.Group>

        </Row>


        {/* Lecture & Faculty */}
        <Row className="mb-3">

          <Form.Group as={Col}>
            <Form.Label>Lecture</Form.Label>

            <Form.Control
              type="text"
              value={timeslot.lecture || ""}
              onChange={handleChange}
              name="lecture"
            />
          </Form.Group>


          <Form.Group as={Col}>
            <Form.Label>Faculty</Form.Label>

            <Form.Control
              type="text"
              value={timeslot.faculty || ""}
              onChange={handleChange}
              name="faculty"
            />
          </Form.Group>

        </Row>


        {/* Subject */}
        <Row className="mb-3">

          <Form.Group as={Col}>
            <Form.Label>Subject</Form.Label>

            <Form.Control
              type="text"
              value={timeslot.subject || ""}
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

          <Button
            onClick={() => doEditTimeslot(timeslot._id)}
            variant="primary"
          >
            Update
          </Button>

        </div>

      </Form>


      {/* Success Modal */}
      <Modal show={show} onHide={handleClose}>

        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Timeslot Updated successfully👍
        </Modal.Body>

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

