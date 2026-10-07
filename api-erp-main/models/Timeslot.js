const mongoose = require("mongoose");
const timeslotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    lecture: {
      type: String,
      required: true
    },
    facultyName: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Timeslot", timeslotSchema);