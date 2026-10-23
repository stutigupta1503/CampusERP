
const express = require("express");
const multer = require("multer");
const router = express.Router();
const FacultyController = require("../controllers/FacultyController");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const uploader = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

function handleUpload(uploadMiddleware) {
    return (req, res, next) => {
        uploadMiddleware(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                const message =
                    error.code === "LIMIT_FILE_SIZE"
                        ? "File size must not exceed 10 MB."
                        : error.message;

                return res.status(400).send({
                    success: false,
                    message,
                });
            }

            if (error) {
                return res.status(400).send({
                    success: false,
                    message: error.message || "File upload failed.",
                });
            }

            next();
        });
    };
}

router.post(
    "/add/faculty",
    handleUpload(uploader.single("file")),
    FacultyController.addFaculty
);

router.post(
    "/add/faculties",
    handleUpload(uploader.single("facultyData")),
    FacultyController.addFaculties
);

router.get("/faculties", FacultyController.getFaculties);

router.get("/faculty/:id", FacultyController.getFaculty);

router.put("/edit/faculty/:id", FacultyController.editFaculty);

router.delete("/delete/faculty/:id", FacultyController.deleteFaculty);

module.exports = router;

// const express =require('express')
// const multer =require('multer')
// const bodyParser=require('body-parser')
// const router=express.Router()
// const FacultyController =require('../controllers/FacultyController')
// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({
//     extended:false
// }))
// const uploader=multer({
//     storage:multer.diskStorage({}),
//     limits:{fileSize:10*1024*1024},
// })
// router.post('/add/faculty',uploader.single('file'),(req,res)=>{
//     FacultyController.addFaculty(req,res)
// })
// router.post('/add/faculties',uploader.single('facultyData'),(req,res)=>{
//     FacultyController.addFaculties(req,res)
// })
// router.get('/faculties', (req, res) => {
//     FacultyController.getFaculties(req, res);
// })
// router.get('/faculty/:id', (req, res) => {
//     FacultyController.getFaculty(req, res);
// })

// router.put('/edit/faculty/:id', (req, res) => {
//     FacultyController.editFaculty(req, res);
// })

// module.exports=router