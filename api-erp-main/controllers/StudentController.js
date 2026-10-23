const Branch = require('../models/Branch');
const Course = require('../models/Course');
const Student = require('../models/Student');
const User = require('../models/User');

const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const xlsx = require('xlsx');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_USER_IMAGE =
    'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';

function uploadToCloudinary(file, folder = 'students') {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error('Uploaded file buffer is missing'));
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result || !result.secure_url) {
                    return reject(new Error('Cloudinary did not return an image URL'));
                }

                resolve(result);
            }
        );

        stream.end(file.buffer);
    });
}

// Get courses for student dropdown
async function getCourseForStudent(req, res) {
    try {
        const searchTerm = req.query.courseFullName || '';

        const courses = await Course.find(
            {
                courseFullName: {
                    $regex: searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                    $options: 'i',
                },
            },
            {
                _id: 1,
                courseFullName: 1,
            }
        );

        res.status(200).send({
            success: true,
            data: courses.map(course => ({
                value: course._id,
                label: course.courseFullName,
            })),
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to load courses',
        });
    }
}

// Get branches for student dropdown
async function getBranchForStudent(req, res) {
    try {
        const searchTerm = req.query.branchFullName || '';

        const branches = await Branch.find(
            {
                branchFullName: {
                    $regex: searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                    $options: 'i',
                },
            },
            {
                _id: 1,
                branchFullName: 1,
            }
        );

        res.status(200).send({
            success: true,
            data: branches.map(branch => ({
                value: branch._id,
                label: branch.branchFullName,
            })),
        });
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to load branches',
        });
    }
}

// Add student
async function addStudent(req, res) {
    let savedStudent;

    try {
        const student = new Student(req.body);

        // Upload the image only when a file is provided.
        if (req.file) {
            const upload = await uploadToCloudinary(req.file);
            student.image = upload.secure_url;
        }

        await student.save();
        savedStudent = student;

        // Create the corresponding student user account.
        const encryptedPassword = await bcrypt.hash('123456', 10);

        const user = new User({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.collegeEmailId,
            password: encryptedPassword,
            mobNo: student.mobileNumber || student.mobileNo || '',
            userRole: 'student',
            userImage: student.image || DEFAULT_USER_IMAGE,
        });

        await user.save();

        return res.status(200).send({
            success: true,
            message: 'Student added successfully',
            data: student,
        });
    } catch (error) {
        console.error('ERROR IN ADD STUDENT:', error);

        if (savedStudent && savedStudent._id) {
            try {
                await Student.deleteOne({ _id: savedStudent._id });
            } catch (cleanupError) {
                console.error('Student cleanup error:', cleanupError);
            }
        }

        return res.status(500).send({
            success: false,
            message: error.message || 'Something went wrong while adding the student',
        });
    }
}

// Get all students with search
async function getStudents(req, res) {
    try {
        const searchTerm = req.query.courseFullName || '';
        const safeSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeSearchTerm, 'i');

        const students = await Student.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
                { enrollmentNumber: regex },
                { fileNumber: regex },
                { rollNumber: regex },
            ],
        });

        return res.status(200).send({
            success: true,
            data: students,
        });
    } catch (error) {
        console.error('Get students error:', error);
        return res.status(500).send({
            success: false,
            message: 'Failed to fetch students',
        });
    }
}

// Delete student
async function deleteStudent(req, res) {
    try {
        const result = await Student.deleteOne({ _id: req.params.id });

        if (result.deletedCount > 0) {
            return res.status(200).send({
                success: true,
                message: 'Student deleted successfully!',
            });
        }

        return res.status(404).send({
            success: false,
            message: 'Student not found!',
        });
    } catch (error) {
        console.error('Delete student error:', error);
        return res.status(500).send({
            success: false,
            message: 'Failed to delete student',
        });
    }
}

// Get student by ID
async function getStudent(req, res) {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send({
                success: false,
                message: 'Student not found!',
            });
        }

        return res.status(200).send({
            success: true,
            data: student,
        });
    } catch (error) {
        console.error('Get student error:', error);
        return res.status(500).send({
            success: false,
            message: 'Failed to fetch student',
        });
    }
}

// Edit student
async function editStudent(req, res) {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send({
                success: false,
                message: 'Student not found!',
            });
        }

        const updates = { ...req.body };
        delete updates._id;
        delete updates.image;

        Object.assign(student, updates);
       if (req.file) {
            const upload = await uploadToCloudinary(req.file);
            student.image = upload.secure_url;
        }

        await student.save();

        await User.updateOne(
            { email: student.collegeEmailId },
            { $set: { userImage: student.image || DEFAULT_USER_IMAGE } }
        );

        return res.status(200).send({
            success: true,
            message: 'Student updated successfully!',
            data: student,
        });
    } catch (error) {
        console.error('Edit student error:', error);
        return res.status(500).send({
            success: false,
            message: error.message || 'Failed to update student',
        });
    }
}
// Bulk upload students from Excel
async function bulkUploadStudents(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const {
            course,
            branch,
            section,
            year,
            semester,
            admissionYear,
        } = req.body;

        // Excel file is read from Multer memory storage.
        const workbook = xlsx.read(req.file.buffer, {
            type: 'buffer',
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        if (!firstSheet) {
            return res.status(400).json({
                success: false,
                message: 'The uploaded Excel file contains no worksheet',
            });
        }

        const rows = xlsx.utils.sheet_to_json(firstSheet);

        const sectionMap = {
            A: 'Section A',
            B: 'Section B',
            C: 'Section C',
        };

        const validStudents = rows
            .filter(student =>
                student.firstName &&
                student.lastName &&
                student.fatherName &&
                student.motherName &&
                student.personalEmailId &&
                student.collegeEmailId
            )
            .map((student, index) => ({
                ...student,
                course,
                branch,
                section: sectionMap[section] || section,
                year,
                semester,
                admissionYear,
                image: '',
                enrollmentNumber: `ENR${Date.now()}${index}`,
            }));

        if (validStudents.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid student records found in the Excel file.',
            });
        }

        await Student.insertMany(validStudents);

        return res.status(200).json({
            success: true,
            message: 'Students uploaded successfully!',
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error uploading file',
        });
    }
}

module.exports = {
    getCourseForStudent,
    getBranchForStudent,
    addStudent,
    getStudents,
    deleteStudent,
    getStudent,
    editStudent,
    bulkUploadStudents,
};
