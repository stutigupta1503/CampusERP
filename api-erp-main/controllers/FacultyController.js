const Faculty = require("../models/Faculty");
const cloudinary = require("cloudinary").v2;
const csv = require("csvtojson");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const DEFAULT_IMAGE =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDob(value) {
  if (!value) return null;

  const parts = value.split("-");

  if (parts.length === 3) {
    const [day, month, year] = parts;

    if (day.length <= 2 && month.length <= 2 && year.length === 4) {
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      if (
        date.getFullYear() === Number(year) &&
        date.getMonth() === Number(month) - 1 &&
        date.getDate() === Number(day)
      ) {
        return date;
      }
    }
  }

  return null;
}

async function addFaculty(req, res) {
  let savedFacultyId;

  try {
    let upload;

    if (req.file) {
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res.status(500).send({
          success: false,
          message: "Cloudinary configuration is missing.",
        });
      }

      upload = await cloudinary.uploader.upload(req.file.path);
    }

    const faculty = new Faculty(req.body);

    if (upload) {
      faculty.facultyImage = upload.secure_url;
    }

    await faculty.save();
    savedFacultyId = faculty._id;

    const existingUser = await User.findOne({
      email: faculty.collegeEmail,
    });

    if (existingUser) {
      await Faculty.findByIdAndDelete(savedFacultyId);
      savedFacultyId = null;

      return res.status(409).send({
        success: false,
        message: "A user with this college email already exists.",
      });
    }

    const encryptedPassword = await bcrypt.hash("123456", 10);

    const user = new User({
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      email: faculty.collegeEmail,
      password: encryptedPassword,
      mobNo: faculty.mobileNo,
      userRole: "faculty",
      userImage: faculty.facultyImage || DEFAULT_IMAGE,
    });

    await user.save();

    return res.status(201).send({
      success: true,
      message: "Faculty added successfully.",
      data: faculty,
    });
  } catch (error) {
    console.error("Error in addFaculty:", error);

    if (savedFacultyId) {
      try {
        await Faculty.findByIdAndDelete(savedFacultyId);
      } catch (cleanupError) {
        console.error("Faculty cleanup failed:", cleanupError);
      }
    }

    if (error.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "Duplicate college ID or another unique field.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).send({
      success: false,
      message: error.message || "Something went wrong while adding faculty.",
    });
  }
}

async function addFaculties(req, res) {
  let insertedFacultyIds = [];

  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No CSV file uploaded.",
      });
    }

    const jsonArray = await csv().fromFile(req.file.path);

    if (!jsonArray.length) {
      return res.status(400).send({
        success: false,
        message: "The CSV file is empty.",
      });
    }

    const FacultyList = jsonArray.map((item) => ({
      collegeId: item.collegeId,
      thumbId: item.thumbId,
      firstName: item.firstName,
      lastName: item.lastName,
      collegeEmail: item.collegeEmail,
      personalEmail: item.personalEmail,
      mobileNo: item.mobileNo,
      emergencyMobileNo: item.emergencyMobileNo,
      fatherName: item.fatherName,
      motherName: item.motherName,
      gender: item.gender || "male",
      dob: parseDob(item.dob),
      highestQualification: item.highestQualification,
      designation: item.designation,
      marriedStatus: item.marriedStatus || "not married",
      totalExperience: item.totalExperience || "0",
      teachingExperience: Number(item.teachingExperience),
      industryExperience: Number(item.industryExperience),
      researchExperience: Number(item.researchExperience),
      facultyImage: item.facultyImage || DEFAULT_IMAGE,
      status: item.status || "active",
    }));

    const emails = FacultyList.map((item) =>
      String(item.collegeEmail || "").trim().toLowerCase()
    );

    if (emails.some((email) => !email) || new Set(emails).size !== emails.length) {
      return res.status(400).send({
        success: false,
        message: "Every faculty member must have a unique college email.",
      });
    }

    const existingUsers = await User.find({
      email: { $in: FacultyList.map((item) => item.collegeEmail) },
    }).select("email");

    if (existingUsers.length) {
      return res.status(409).send({
        success: false,
        message: "One or more college emails already exist as users.",
        emails: existingUsers.map((user) => user.email),
      });
    }

    const insertedFaculty = await Faculty.insertMany(FacultyList);
    insertedFacultyIds = insertedFaculty.map((faculty) => faculty._id);

    const encryptedPassword = await bcrypt.hash("123456", 10);

    const userList = insertedFaculty.map((faculty) => ({
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      email: faculty.collegeEmail,
      password: encryptedPassword,
      mobNo: faculty.mobileNo,
      userRole: "faculty",
      userImage: faculty.facultyImage || DEFAULT_IMAGE,
    }));

    await User.insertMany(userList);

    return res.status(201).send({
      success: true,
      message: "Faculty data added successfully.",
      count: insertedFaculty.length,
    });
  } catch (error) {
    console.error("Error in addFaculties:", error);

    if (insertedFacultyIds.length) {
      try {
        await Faculty.deleteMany({
          _id: { $in: insertedFacultyIds },
        });
      } catch (cleanupError) {
        console.error("Faculty cleanup failed:", cleanupError);
      }
    }

    if (error.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "Duplicate college ID, email, or another unique field.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).send({
      success: false,
      message: error.message || "Something went wrong while importing faculty.",
    });
  }
}

async function getFaculties(req, res) {
  try {
    const pageNo = Math.max(parseInt(req.query.pageNo, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 5, 1),
      100
    );

    const firstName = String(req.query.firstName || "").trim();

    const filter = firstName
      ? { firstName: { $regex: escapeRegex(firstName), $options: "i" } }
      : {};

    const [faculties, totalFaculty] = await Promise.all([
      Faculty.find(filter)
        .sort({ firstName: 1 })
        .skip((pageNo - 1) * limit)
        .limit(limit),
      Faculty.countDocuments(filter),
    ]);

    return res.status(200).send({
      success: true,
      data: faculties,
      totalCount: totalFaculty,
      pageNo,
      limit,
      totalPages: Math.ceil(totalFaculty / limit),
    });
  } catch (error) {
    console.error("Error in getFaculties:", error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching faculty.",
    });
  }
}

async function getFaculty(req, res) {
  try {
    const facultyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid faculty ID.",
      });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).send({
        success: false,
        message: "Faculty not found.",
      });
    }

    return res.status(200).send({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("Error in getFaculty:", error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching faculty.",
    });
  }
}

async function editFaculty(req, res) {
  try {
    const facultyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid faculty ID.",
      });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).send({
        success: false,
        message: "Faculty not found.",
      });
    }

    const allowedFields = [
      "collegeId",
      "thumbId",
      "firstName",
      "lastName",
      "collegeEmail",
      "personalEmail",
      "mobileNo",
      "emergencyMobileNo",
      "fatherName",
      "motherName",
      "gender",
      "dob",
      "highestQualification",
      "designation",
      "marriedStatus",
      "totalExperience",
      "teachingExperience",
      "industryExperience",
      "researchExperience",
      "facultyImage",
      "status",
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        faculty.set(field, req.body[field]);
      }
    }

    await faculty.save();

    return res.status(200).send({
      success: true,
      message: "Faculty has been updated successfully.",
      data: faculty,
    });
  } catch (error) {
    console.error("Error in editFaculty:", error);

    if (error.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "College ID already exists.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating faculty.",
    });
  }
}

async function deleteFaculty(req, res) {
  try {
    const facultyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid faculty ID.",
      });
    }

    const faculty = await Faculty.findByIdAndDelete(facultyId);

    if (!faculty) {
      return res.status(404).send({
        success: false,
        message: "Faculty not found.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Faculty deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteFaculty:", error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleting faculty.",
    });
  }
}

module.exports = {
  addFaculty,
  addFaculties,
  getFaculties,
  getFaculty,
  editFaculty,
  deleteFaculty
};