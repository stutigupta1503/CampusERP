import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function BranchEdit() {
    let navigate = useNavigate();
    let params = useParams();

    // FIXED: Renamed singular 'course' to 'courses' to match what your JSX requires
    let [courses, setCourses] = useState([]);
    let [branch, setBranch] = useState({
        course: '',
        branchCode: '',
        branchShortName: '',
        branchFullName: '',
        branchIntake: 60
    });
    let [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        navigate('/branches');
    };

    // FIXED: Combined duplicate handleChange logic safely into one clean handler
    function handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        setBranch((prev) => {
            return {
                ...prev, 
                [name]: value
            };
        });
    }

    // FIXED: Extracted form submit event control to process inputs cleanly
    const doEditBranch = (e) => {
        e.preventDefault(); // Prevents native browser white page reloads
        
        axios({
            url: 'http://localhost:3000/edit/branch/' + params.id, // Better to pull directly from route params
            method: 'put',
            data: {
                ...branch,
                branchIntake: Number(branch.branchIntake) // Formats payload values correctly
            }
        }).then((result) => {
            if (result.data.success) {
                setShow(true);
            } else {
                alert("Failed to update branch records.");
            }
        }).catch((err) => {
            console.error("Update request error:", err);
            alert("Error trying to submit updates.");
        });
    };

    // Fetches individual branch settings
    useEffect(() => {
        if (params.id) {
            axios({
                url: 'http://localhost:3000/branch/' + params.id,
                method: 'get'
            }).then((result) => {
                if (result.data.success && result.data.data) {
                    setBranch(result.data.data);
                }
            }).catch((err) => {
                console.error("Error loading specific branch:", err);
            });
        }
    }, [params.id]);

    // Fetches options list for dropdown select configurations
    useEffect(() => {
        axios.get("http://localhost:3000/courses/for/branch")
          .then((res) => {
            if (res.data.success) {
              setCourses(res.data.data);
            } else {
              alert("Failed to load Course configurations.");
            }
          })
          .catch((err) => {
            console.error("Error fetching course data rows:", err);
          });
    }, []);

    return (
        <Container className="mt-4">
            {/* Added standard form element routing interception */}
            <Form onSubmit={doEditBranch}>
                <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">EDIT BRANCH</h3>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Select Course</Form.Label>
                        <Form.Select
                            value={branch.course || ''}
                            onChange={handleChange}
                            name='course'
                            required
                        >
                            <option value="" disabled>-- Select a Course --</option>
                            {
                                courses && courses.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCode">
                        <Form.Label>Branch Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={branch.branchCode || ''}
                            onChange={handleChange}
                            name='branchCode'
                            placeholder="eg: CSE101"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridShortName">
                        <Form.Label>Branch Short Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={branch.branchShortName || ''}
                            onChange={handleChange}
                            name='branchShortName'
                            placeholder="eg: CSE"
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFullName">
                        <Form.Label>Branch Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={branch.branchFullName || ''}
                            onChange={handleChange}
                            name='branchFullName'
                            placeholder="eg: Computer Science and Engineering"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridIntake">
                        <Form.Label>Total Intake</Form.Label>
                        <Form.Control
                            type="number"
                            value={branch.branchIntake || ''}
                            onChange={handleChange}
                            name='branchIntake'
                            placeholder="eg: 60"
                            required
                        />
                    </Form.Group>
                </Row>

                <div className="d-flex justify-content-center gap-2 mt-4">
                    <Button onClick={() => navigate('/branches')} variant="secondary" type="button">
                        Cancel
                    </Button>
                    {/* FIXED: Changed to type="submit" and removed direct execution script wrapper */}
                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </div>
            </Form>

            {/* ---------Modal code ------------- */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Branch updated successfully 👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default BranchEdit;
