const express = require("express");
const router = express.Router();
const Timeslot = require("../models/Timeslot");

// ADD TIMESLOT
router.post("/add/timeslot", async (req, res) => {
  try {
    const { startTime, endTime, lecture, facultyName, subject } = req.body;
    const timeslot = new Timeslot({ startTime, endTime, lecture, facultyName, subject });
    await timeslot.save();
    
    res.status(201).json({ success: true, message: "Timeslot added successfully", data: timeslot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL TIMESLOTS
router.get("/timeslots", async (req, res) => {
  try {
    const timeslots = await Timeslot.find();
    res.status(200).json({ success: true, data: timeslots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET SINGLE TIMESLOT BY ID
// router.get("/timeslot/:id", async (req, res) => {
//   try {
//     const timeslot = await Timeslot.findById(req.params.id);
//     if (!timeslot) return res.status(404).json({ success: false, message: "Timeslot not found" });
//     res.status(200).json({ success: true, data: timeslot });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// UPDATE TIMESLOT
router.put("/edit/timeslot/:id", async (req, res) => {
  try {
    const { startTime, endTime, lecture, facultyName, subject } = req.body;
    const updatedTimeslot = await Timeslot.findByIdAndUpdate(
      req.params.id,
      { startTime, endTime, lecture, facultyName, subject },
      { new: true, runValidators: true }
    );
    
    if (!updatedTimeslot) return res.status(404).json({ success: false, message: "Timeslot not found" });
    res.status(200).json({ success: true, message: "Timeslot updated successfully", data: updatedTimeslot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE TIMESLOT
router.delete("/delete/timeslot/:id", async (req, res) => {
  try {
    const deletedTimeslot = await Timeslot.findByIdAndDelete(req.params.id);
    if (!deletedTimeslot) return res.status(404).json({ success: false, message: "Timeslot not found" });
    res.status(200).json({ success: true, message: "Timeslot deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
