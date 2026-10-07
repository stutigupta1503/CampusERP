import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Form, InputGroup } from "react-bootstrap";

function TimeslotList() {

  const navigate = useNavigate();

  const [timeslots, setTimeslots] = useState([]);
  const [searchByLecture, setSearchByLecture] = useState("");

  useEffect(() => {

    axios
      .get("http://localhost:3000/timeslots")
      .then((result) => {

        console.log("Timeslots:", result.data);

        if (result.data.success) {
          setTimeslots(result.data.data);
        }

      })
      .catch((error) => {
        console.log("Error fetching timeslots:", error);
      });

  }, []);


  function goToAddTimeslotPage() {
    navigate("/add/timeslot");
  }


  function goToEdit(id) {
    navigate("/timeslot/edit/" + id);
  }


  const filteredTimeslots = timeslots.filter((timeslot) =>
    timeslot.lecture
      ?.toLowerCase()
      .includes(searchByLecture.toLowerCase())
  );


  return (
    <>

      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        List Of Timeslot
      </h3>


      {/* Search */}
      <InputGroup className="mb-3">

        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>

        <Form.Control
          type="text"
          placeholder="Type Lecture to search"
          value={searchByLecture}
          onChange={(e) => setSearchByLecture(e.target.value)}
        />

      </InputGroup>


      {/* Add Button */}
      <div className="d-flex justify-content-end me-3 mt-2">

        <button
          className="btn btn-sm btn-success"
          onClick={goToAddTimeslotPage}
        >
          Add Timeslot +
        </button>

      </div>


      {/* Table */}
      <table className="table text-center table-hover mt-5">

        <thead>

          <tr>
            <th>Session</th>
            <th>Lecture</th>
            <th>Faculty</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>

        </thead>


        <tbody>

          {filteredTimeslots.length > 0 ? (

            filteredTimeslots.map((timeslot) => (

              <tr key={timeslot._id}>

                <td>
                  {timeslot.startTime} - {timeslot.endTime}
                </td>

                <td>
                  {timeslot.lecture}
                </td>

                <td>
                  {timeslot.facultyName}
                </td>

                <td>
                  {timeslot.subject}
                </td>

                <td>

                  <i
                    className="bi bi-pencil me-3"
                    onClick={() => goToEdit(timeslot._id)}
                    style={{ cursor: "pointer" }}
                  ></i>

                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="5">
                No timeslots found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </>

  );
}

export default TimeslotList;