import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SubjectList() {
    let navigate = useNavigate();
    let [subjects, setSubjects] = useState([]);
    const [show, setShow] = useState(false);
    let [isDelete, setIsDelete] = useState(false);
    let [searchBySubjectName, setSearchBySubjectName] = useState('');

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/subjects',
            method: 'get',
            params: {
                subjectFullName: searchBySubjectName
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setSubjects(result.data.data);
            }
        }).catch((error) => {
            console.error("Error fetching subjects:", error);
        });
    }, [isDelete, searchBySubjectName]);

    function searchSubject(subjectFullName) {
        setSearchBySubjectName(subjectFullName);
    }

    const handleClose = () => {
        setShow(false);
        setIsDelete(prev => !prev); 
    };

    function goToEdit(id) {
        console.log("Navigating to edit subject with ID:", id);
        navigate('/edit/subject/' + id);
    }

    function goToAddSubjectPage() {
        navigate('/add/subject');
    }

    function goToDelete(subjectCode) {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            axios({
                url: 'http://localhost:3000/delete/subject/' + subjectCode,
                method: 'delete'
            }).then((result) => {
                if (result.data.success) {
                    setShow(true);
                } else {
                    alert("Backend failed to process deletion request.");
                }
            }).catch((err) => {
                console.error("Delete operation failed:", err.message);
                alert("Error attempting deletion.");
            });
        }
    }

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF SUBJECTS</h3>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <InputGroup style={{ maxWidth: '400px' }}>
                    <InputGroup.Text>
                        <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control 
                        type="text" 
                        placeholder="Type Subject Name to search..." 
                        value={searchBySubjectName}
                        onChange={(e) => searchSubject(e.target.value)} 
                    />
                </InputGroup>
                <button className="btn btn-success" onClick={goToAddSubjectPage}>
                    Add Subject +
                </button>
            </div>

            <table className="table text-center table-hover mt-4">
                <thead className="table-light">
                    <tr>
                        <th>Subject Code</th>
                        <th>Subject Full Name</th>
                        <th>Subject Short Name</th>
                        <th>Subject Category</th>
                        <th>Subject Type</th>
                        <th>Credit Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <tr key={subject._id || subject.subjectCode}>
                                <td>{subject.subjectCode}</td>
                                <td>{subject.subjectFullName}</td>
                                <td>{subject.subjectNickName}</td>
                                <td>{subject.subjectCategory}</td>
                                <td>{subject.subjectType}</td>
                                <td>{subject.creditScore}</td>
                                <td>
                                    <i 
                                        className="bi bi-pencil text-primary me-3" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => goToEdit(subject._id || subject.id)} 
                                    ></i>
                                    {/* FIXED: The element now successfully forwards subject.subjectCode */}
                                    <i 
                                        className="bi bi-trash text-danger" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => goToDelete(subject.subjectCode)}
                                    ></i>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-muted py-4">No subjects found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Subject has been Deleted successfully 👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SubjectList;
