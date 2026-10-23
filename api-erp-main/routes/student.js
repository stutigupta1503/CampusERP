const express = require('express');
const router = express.Router();
const multer = require('multer');
const StudentController = require('../controllers/StudentController');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

// Get courses for student dropdown
router.get(
    '/courses/for/student',
    StudentController.getCourseForStudent
);

// Get branches for student dropdown
router.get(
    '/branches/for/student',
    StudentController.getBranchForStudent
);

// Add student with optional image
// Frontend FormData field name: file
router.post(
    '/add/student',
    upload.single('file'),
    StudentController.addStudent
);

// Bulk upload students from Excel
// Frontend FormData field name: bulkFile
router.post(
    '/students/upload',
    upload.single('bulkFile'),
    StudentController.bulkUploadStudents
);

// Get all students
router.get(
    '/students',
    StudentController.getStudents
);

// Delete student
router.delete(
    '/delete/student/:id',
    StudentController.deleteStudent
);

// Get one student by ID
router.get(
    '/student/:id',
    StudentController.getStudent
);

// Edit student, optionally including a new image
router.put(
    '/edit/student/:id',
    upload.single('file'),
    StudentController.editStudent
);

// Handle Multer upload errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }

    next(error);
});

module.exports = router;
