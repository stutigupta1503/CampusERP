const Timeslot = require("../models/Timeslot");

// CREATE TIMESLOT
const createTimeslot = async (req, res) => {
  try {
    const { session, lecture, facultyName, subject } = req.body;

    const timeslot = new Timeslot({
      session,
      lecture,
      facultyName,
      subject,
    });

    const savedTimeslot = await timeslot.save();

    res.status(201).json({
      message: "Timeslot created successfully",
      timeslot: savedTimeslot,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating timeslot",
      error: error.message,
    });
  }
};


// GET ALL TIMESLOTS
const getTimeslots = async (req, res) => {
  try {
    const timeslots = await Timeslot.find();

    res.status(200).json(timeslots);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching timeslots",
      error: error.message,
    });
  }
};


// GET SINGLE TIMESLOT
const getTimeslotById = async (req, res) => {
  try {
    const timeslot = await Timeslot.findById(req.params.id);

    if (!timeslot) {
      return res.status(404).json({
        message: "Timeslot not found",
      });
    }

    res.status(200).json(timeslot);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching timeslot",
      error: error.message,
    });
  }
};


// UPDATE TIMESLOT
const updateTimeslot = async (req, res) => {
  try {
    const { session, lecture, facultyName, subject } = req.body;

    const updatedTimeslot = await Timeslot.findByIdAndUpdate(
      req.params.id,
      {
        session,
        lecture,
        facultyName,
        subject,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTimeslot) {
      return res.status(404).json({
        message: "Timeslot not found",
      });
    }

    res.status(200).json({
      message: "Timeslot updated successfully",
      timeslot: updatedTimeslot,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating timeslot",
      error: error.message,
    });
  }
};


// DELETE TIMESLOT
const deleteTimeslot = async (req, res) => {
  try {
    const deletedTimeslot = await Timeslot.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTimeslot) {
      return res.status(404).json({
        message: "Timeslot not found",
      });
    }

    res.status(200).json({
      message: "Timeslot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting timeslot",
      error: error.message,
    });
  }
};


module.exports = {
  createTimeslot,
  getTimeslots,
  getTimeslotById,
  updateTimeslot,
  deleteTimeslot,
};