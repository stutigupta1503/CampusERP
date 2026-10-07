const express = require("express");
const router = express.Router();

const Timeslot = require("../models/Timeslot");

// ADD TIMESLOT
router.post("/add/timeslot", async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const {
      startTime,
      endTime,
      lecture,
      facultyName,
      subject
    } = req.body;

    const timeslot = new Timeslot({
      startTime,
      endTime,
      lecture,
      facultyName,
      subject
    });

    await timeslot.save();

    res.status(201).json({
      success: true,
      message: "Timeslot added successfully",
      data: timeslot
    });

  } catch (error) {
    console.log("Error adding timeslot:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// GET ALL TIMESLOTS
router.get("/timeslots", async (req, res) => {
  try {
    const timeslots = await Timeslot.find();

    res.status(200).json({
      success: true,
      data: timeslots
    });

  } catch (error) {
    console.log("Error fetching timeslots:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;