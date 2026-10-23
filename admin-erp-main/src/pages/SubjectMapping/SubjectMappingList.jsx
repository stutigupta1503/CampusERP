import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function SubjectMappingList() {

    const navigate = useNavigate()
    const [subjectsmap, setSubjectsmap] = useState([])
    const [show, setShow] = useState(false)
    const [searchByCourse, setSearchByCourse] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchSubjectsMapped()
    }, [searchByCourse])

    async function fetchSubjectsMapped() {
        try {
            const result = await axios.get(
                'http://localhost:3000/subjectsMapped',
                {
                    params: {
                        course: searchByCourse
                    }
                }
            )

            if (result.data.success) {
                setSubjectsmap(result.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function goToEdit(id) {
        navigate(`/edit/subjectMapping/${id}`)
    }

    function goToAddMappingPage() {
        navigate('/add/subjectMapping')
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this Subject Mapping?'
        )

        if (!confirmDelete) {
            return
        }

        try {
            const result = await axios.delete(
                `http://localhost:3000/delete/subjectMapping/${id}`
            )

            if (result.data.success) {
                setSubjectsmap(prev =>
                    prev.filter(subject => subject._id !== id)
                )

                setMessage('Subject Mapping deleted successfully!')
                setShow(true)
            }
        } catch (error) {
            console.log(error)
            alert(
                error.response?.data?.message ||
                'Failed to delete Subject Mapping'
            )
        }
    }

    const handleClose = () => {
        setShow(false)
    }

    return (
        <>
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">
                LIST OF SUBJECTS MAPPING
            </h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>

                <Form.Control
                    type="text"
                    placeholder="Type Course Name to search"
                    value={searchByCourse}
                    onChange={(e) => setSearchByCourse(e.target.value)}
                />
            </InputGroup>

            <button
                className="btn btn-success ms-3 mt-2 float-end"
                onClick={goToAddMappingPage}
            >
                Map Subject +
            </button>

            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Session</th>
                        <th>Subject</th>
                        <th>Course</th>
                        <th>Branch</th>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {subjectsmap.map((subject) => (
                        <tr key={subject._id}>
                            <td>{subject.session}</td>
                            <td>{subject.subject}</td>
                            <td>{subject.course}</td>
                            <td>{subject.branch}</td>
                            <td>{subject.year}</td>
                            <td>{subject.semester}</td>

                            <td>
                                
                                <i
                                    className="bi bi-pencil text-primary me-3"
                                    role="button"
                                    title="Edit"
                                    onClick={() => goToEdit(subject._id)}
                                ></i>

                                <i
                                    className="bi bi-trash text-danger"
                                    role="button"
                                    title="Delete"
                                    onClick={() => handleDelete(subject._id)}
                                ></i>
                            </td>
                        </tr>
                    ))}

                    {subjectsmap.length === 0 && (
                        <tr>
                            <td colSpan="7">No Subject Mappings Found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>

                <Modal.Body>{message}</Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SubjectMappingList

