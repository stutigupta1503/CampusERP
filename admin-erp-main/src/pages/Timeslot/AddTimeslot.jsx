import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddTimeslot() {

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lecture, setLecture] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const timeslotData = {
      startTime,
      endTime,
      lecture,
      facultyName,
      subject
    };

    console.log("Sending data:", timeslotData);

    axios
      .post("http://localhost:3000/add/timeslot", timeslotData)
      .then((result) => {
        console.log("Server response:", result.data);

        if (result.data.success) {
          alert("Timeslot added successfully");

          // Clear form
          setStartTime("");
          setEndTime("");
          setLecture("");
          setFacultyName("");
          setSubject("");
        } else {
          alert(result.data.message || "Failed to add timeslot");
        }
      })
      .catch((error) => {
        console.log("Axios error:", error);
        console.log("Backend error:", error.response?.data);

        alert(
          error.response?.data?.message ||
          "Something went wrong while adding timeslot"
        );
      });
  };

  return (
    <div className="container mt-4">

      <h2>Add Timeslot</h2>

      <form onSubmit={handleSubmit}>

        {/* Start Time */}
        <div className="mb-3">
          <label className="form-label">Start Time</label>

          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        {/* End Time */}
        <div className="mb-3">
          <label className="form-label">End Time</label>

          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {/* Lecture */}
        <div className="mb-3">
          <label className="form-label">Lecture</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter lecture"
            value={lecture}
            onChange={(e) => setLecture(e.target.value)}
            required
          />
        </div>

        {/* Faculty Name */}
        <div className="mb-3">
          <label className="form-label">Faculty Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter faculty name"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            required
          />
        </div>

        {/* Subject */}
        <div className="mb-3">
          <label className="form-label">Subject</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Timeslot
        </button>

      </form>

    </div>
  );
}

export default AddTimeslot;