const Timeslot = require("../models/Timeslot");

// CREATE TIMESLOT
const createTimeslot = async (req, res) => {
  try {
   
    const { startTime, endTime, lecture, facultyName, subject } = req.body;

    const timeslot = new Timeslot({
      startTime,
      endTime,
      lecture,
      facultyName,
      subject,
    });

    const savedTimeslot = await timeslot.save();

    
    res.status(201).json({
      success: true,
      message: "Timeslot created successfully",
      data: savedTimeslot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating timeslot",
      error: error.message,
    });
  }
};


// GET ALL TIMESLOTS
const getTimeslots = async (req, res) => {
  try {
    const timeslots = await Timeslot.find();

    
    res.status(200).json({
      success: true,
      data: timeslots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
        success: false,
        message: "Timeslot not found",
      });
    }

    res.status(200).json({
      success: true,
      data: timeslot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching timeslot",
      error: error.message,
    });
  }
};


// UPDATE TIMESLOT
const updateTimeslot = async (req, res) => {
  try {
   
    const { startTime, endTime, lecture, facultyName, subject } = req.body;

    const updatedTimeslot = await Timeslot.findByIdAndUpdate(
      req.params.id,
      {
        startTime,
        endTime,
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
        success: false,
        message: "Timeslot not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timeslot updated successfully",
      data: updatedTimeslot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating timeslot",
      error: error.message,
    });
  }
};


// DELETE TIMESLOT
const deleteTimeslot = async (req, res) => {
  try {
    const deletedTimeslot = await Timeslot.findByIdAndDelete(req.params.id);

    if (!deletedTimeslot) {
      return res.status(404).json({
        success: false,
        message: "Timeslot not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timeslot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
