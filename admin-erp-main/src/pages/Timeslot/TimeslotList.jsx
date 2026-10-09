import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Modal, Button, Form, InputGroup, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TimeslotList() {
    let navigate = useNavigate();
    let [timeslots, setTimeslots] = useState([]);
    const [show, setShow] = useState(false);
    let [isDelete, setIsDelete] = useState(false);
    
    // Search filter state variables
    let [searchBySubject, setSearchBySubject] = useState('');
    let [searchByFaculty, setSearchByFaculty] = useState('');
    let [searchByLecture, setSearchByLecture] = useState('');

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/timeslots',
            method: 'get',
            params: {
                subject: searchBySubject,
                facultyName: searchByFaculty,
                lecture: searchByLecture
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setTimeslots(result.data.data);
            }
        }).catch((error) => {
            console.log(error);
        });
    }, [isDelete, searchBySubject, searchByFaculty, searchByLecture]);

    const handleClose = () => {
        setShow(false);
        setIsDelete(prev => !prev); // Triggers useEffect to re-fetch remaining records
    };

    function goToAddTimeslotPage() {
        navigate('/add/timeslot');
    }

    function goToDelete(id) {
        if (window.confirm("Are you sure you want to delete this timeslot?")) {
            axios({
                url: 'http://localhost:3000/delete/timeslot/' + id,
                method: 'delete'
            }).then((result) => {
                if (result.data.success) {
                    setShow(true);
                }
            }).catch((err) => {
                console.log(err.message);
            });
        }
    }

    function goToEdit(id) {
        navigate('/edit/timeslot/' + id);
    }

    return (
        <Container className="mt-4">
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF TIMESLOTS</h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control 
                    type="text" 
                    placeholder=" Type Subject to search..." 
                    onChange={(e) => setSearchBySubject(e.target.value)} 
                />
            </InputGroup>

            <button className="btn btn-success ms-3 mt-2 float-end" onClick={goToAddTimeslotPage}>
                Add Timeslot +
            </button>

            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Lecture</th>
                        <th>Faculty Name</th>
                        <th>Subject</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        timeslots.map((slot) => (
                            <tr key={slot._id}>
                                <td>{slot.startTime}</td>
                                <td>{slot.endTime}</td>
                                <td>{slot.lecture}</td>
                                <td>{slot.facultyName}</td>
                                <td>{slot.subject}</td>
                                <td>
                                    {/* Action items: Eye icon completely removed */}
                                    <i className="bi bi-pencil text-warning me-3" style={{ cursor: 'pointer' }} onClick={() => goToEdit(slot._id)}></i>
                                    <i className="bi bi-trash text-danger" style={{ cursor: 'pointer' }} onClick={() => goToDelete(slot._id)}></i>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* --------- Action Result Modal Code ------------- */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Timeslot has been Deleted successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default TimeslotList;
