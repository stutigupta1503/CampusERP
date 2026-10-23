
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