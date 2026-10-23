
import { useState } from "react";
import React from "react";
import { Container, Row, Col, Button, Modal, Spinner, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddFaculty() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const [collegeId, setCollegeId] = useState("");
  const [thumbId, setThumbId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emergencyMobileNo, setEmergencyMobileNo] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [marriedStatus, setMarriedStatus] = useState("not married");
  const [totalExperience, setTotalExperience] = useState("");
  const [teachingExperience, setTeachingExperience] = useState("");
  const [industryExperience, setIndustryExperience] = useState("");
  const [researchExperience, setResearchExperience] = useState("");
  const [file, setFile] = useState(null);

  async function doAddFaculty(e) {
    e.preventDefault();

    if (buttonDisabled) return;

    setButtonDisabled(true);
    setShowSpinner(true);
    setShowForm(false);

    const formData = new FormData();

    formData.append("collegeId", collegeId.trim());
    formData.append("thumbId", thumbId.trim());
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("collegeEmail", collegeEmail.trim());
    formData.append("personalEmail", personalEmail.trim());
    formData.append("mobileNo", mobileNo);
    formData.append("emergencyMobileNo", emergencyMobileNo);
    formData.append("fatherName", fatherName.trim());
    formData.append("motherName", motherName.trim());
    formData.append("gender", gender);
    formData.append("dob", dob);
    formData.append("highestQualification", highestQualification.trim());
    formData.append("designation", designation.trim());
    formData.append("marriedStatus", marriedStatus);
    formData.append("totalExperience", totalExperience);
    formData.append("teachingExperience", teachingExperience);
    formData.append("industryExperience", industryExperience);
    formData.append("researchExperience", researchExperience);

    if (file) {
      formData.append("file", file);
    }

    try {
      const result = await axios.post(
        "http://localhost:3000/add/faculty",
        formData
      );

      if (result.data.success) {
        setShow(true);
      } else {
        alert(result.data.message || "Failed to add faculty.");
        setShowForm(true);
      }
    } catch (error) {
      console.error(
        "Add faculty error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add faculty. Check the backend terminal for the exact error."
      );

      setShowForm(true);
    } finally {
      setShowSpinner(false);
      setButtonDisabled(false);
    }
  }

  function handleClose() {
    setShow(false);
    navigate("/faculties");
  }

  return (
    <>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        ADD Faculty
      </h3>
      <hr />

      {showForm && (
        <Container fluid>
          <Form onSubmit={doAddFaculty}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter Faculty First Name"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter Faculty Last Name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Personal Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    placeholder="Enter Personal Email"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>College ID</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="Enter College ID"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile No</Form.Label>
                  <Form.Control
                    required
                    type="tel"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="Enter Mobile Number"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Mobile No</Form.Label>
                  <Form.Control
                    required
                    type="tel"
                    value={emergencyMobileNo}
                    onChange={(e) => setEmergencyMobileNo(e.target.value)}
                    placeholder="Enter Emergency Mobile Number"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mother's Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Enter Mother's Name"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Father's Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Enter Father's Name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Col>

              <Col>
                <Form.Label>Married Status</Form.Label>
                <Form.Select
                  value={marriedStatus}
                  onChange={(e) => setMarriedStatus(e.target.value)}
                >
                  <option value="not married">Not Married</option>
                  <option value="married">Married</option>
                </Form.Select>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Date Of Birth</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Thumb ID</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={thumbId}
                    onChange={(e) => setThumbId(e.target.value)}
                    placeholder="Enter Thumb ID"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>College Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    placeholder="Enter College Email"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter Designation"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Highest Qualification</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={highestQualification}
                    onChange={(e) =>
                      setHighestQualification(e.target.value)
                    }
                    placeholder="Enter Highest Qualification"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Total Experience</Form.Label>
                  <Form.Control
                    required
                    min="0"
                    type="number"
                    value={totalExperience}
                    onChange={(e) => setTotalExperience(e.target.value)}
                    placeholder="Enter Total Experience"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Teaching Experience</Form.Label>
                  <Form.Control
                    required
                    min="0"
                    type="number"
                    value={teachingExperience}
                    onChange={(e) =>
                      setTeachingExperience(e.target.value)
                    }
                    placeholder="Enter Teaching Experience"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Industry Experience</Form.Label>
                  <Form.Control
                    required
                    min="0"
                    type="number"
                    value={industryExperience}
                    onChange={(e) =>
                      setIndustryExperience(e.target.value)
                    }
                    placeholder="Enter Industry Experience"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Research Experience</Form.Label>
                  <Form.Control
                    required
                    min="0"
                    type="number"
                    value={researchExperience}
                    onChange={(e) =>
                      setResearchExperience(e.target.value)
                    }
                    placeholder="Enter Research Experience"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Faculty Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] || null)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              className="me-2"
              variant="danger"
              type="button"
              onClick={() => navigate("/faculties")}
            >
              Cancel
            </Button>

            <Button
              variant="success"
              type="submit"
              disabled={buttonDisabled}
            >
              Add Faculty
            </Button>
          </Form>
        </Container>
      )}

      {showSpinner && (
        <div className="d-flex justify-content-center align-items-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Faculty added successfully.</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddFaculty;

// import { useState } from "react";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import React from "react";
// import { Container, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function AddFaculty() {
//   let navigate = useNavigate();

//   const [show, setShow] = useState(false);
//   // const [showModal, setShowModal] = useState(false);
//   let [showSpinner, setShowSpinner] = useState(false);
//   let [buttonDisabled, setButtonDisabled] = useState(false);
//   let [showForm, SetShowForm] = useState(true);

//   let [collegeId, setCollegeId] = useState("");
//   let [thumbId, setThumbId] = useState("");
//   let [firstName, setFirstName] = useState("");
//   let [lastName, setLastName] = useState("");
//   let [collegeEmail, setCollegeEmail] = useState("");
//   let [personalEmail, setPersonalEmail] = useState("");
//   let [mobileNo, setMobileNo] = useState(0);
//   let [emergencyMobileNo, setEmergencyMobileNo] = useState(0);
//   let [fatherName, setFatherName] = useState("");
//   let [motherName, setMotherName] = useState("");
//   let [gender, setGender] = useState("male");
//   let [dob, setDob] = useState("");
//   let [highestQualification, setHighestQualification] = useState("");
//   let [designation, setDesignation] = useState("");
//   let [marriedStatus, setMarriedStatus] = useState("not married");
//   let [totalExperience, setTotalExperience] = useState(0);
//   let [teachingExperience, setTeachingExperience] = useState(0);
//   let [industryExperience, setIndustryExperience] = useState(0);
//   let [researchExperience, setResearchExperience] = useState(0);
//   let [file, setFile] = useState(null);

//   let doAddFaculty = (e) => {
//     if(e) e.preventDefault();
//     setButtonDisabled(true);
//     SetShowForm(false);
//     setShowSpinner(true);
//     let formData = new FormData();
//     formData.append("collegeId", collegeId);
//     formData.append("thumbId", thumbId);
//     formData.append("firstName", firstName);
//     formData.append("lastName", lastName);
//     formData.append("collegeEmail", collegeEmail);
//     formData.append("personalEmail", personalEmail);
//     formData.append("mobileNo", mobileNo);
//     formData.append("emergencyMobileNo", emergencyMobileNo);
//     formData.append("fatherName", fatherName);
//     formData.append("motherName", motherName);
//     formData.append("gender", gender);
//     formData.append("dob", dob);
//     formData.append("highestQualification", highestQualification);
//     formData.append("designation", designation);
//     formData.append("marriedStatus", marriedStatus);
//     formData.append("totalExperience", totalExperience);
//     formData.append("teachingExperience", teachingExperience);
//     formData.append("industryExperience", industryExperience);
//     formData.append("researchExperience", researchExperience);
//     if (file) {
//       formData.append("file", file);
//       formData.append("fileName", file.name);
//     }

//     axios({
//       url: "http://localhost:3000/add/faculty",
//       method: "post",
//       data: formData,
//       headers: {
//         "content-type": "multipart/form-data",
//       },
//     })
//       .then((result) => {
//         if (result.data.success) setButtonDisabled(false);
//         setShow(true);
//         setShowSpinner(false);
//         SetShowForm(true);
//       })
//       .catch((err) => {
//         setShowSpinner(false);
//         setButtonDisabled(false);
//         SetShowForm(true);
//         alert(err);
//       });
//   };
  
//   // function doAddFaculties() {
//   //   setButtonDisabled(true);
//   //   let formData = new FormData();
//   //   formData.append("facultyData", file);
//   //   formData.append("fileName", file.name);
//   //   axios({
//   //     url: "http://localhost:3000/add/faculties",
//   //     method: "post",
//   //     data: formData,
//   //     headers: {
//   //       "content-type": "multipart/form-data",
//   //     },
//   //   })
//   //     .then((result) => {
//   //       if (result.data.success) setButtonDisabled(false);
//   //       setShow(true);
//   //       setShowSpinner(false);
//   //       SetShowForm(true);
//   //     })
//   //     .catch((err) => {
//   //       setShowSpinner(false);
//   //       setButtonDisabled(false);
//   //       SetShowForm(true);
//   //       alert(err);
//   //     });
//   // }

//   const handleClose = () => {
//     setShow(false);
//     navigate("/faculties");
//   };

//   return (
//     <>
//         <h3 className="text-center mb-4 py-2 text-primary fw-bold ">ADD Faculty</h3>
//         <hr />
   
//         {showForm && (
//           <Container fluid>
//             <Form> 
//               <Row>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>First Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setFirstName(e.target.value)}
//                       placeholder="Enter Faculty First Name"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Last Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setLastName(e.target.value)}
//                       placeholder="Enter Faculty Last Name"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Personal Email</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setPersonalEmail(e.target.value)}
//                       placeholder="Enter Personal email"
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>College Id</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setCollegeId(e.target.value)}
//                       placeholder="Enter College Id"
//                     />
//                   </Form.Group>
//                 </Col>
//                 </Row>
//                 <Row>
                  
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Mobile No</Form.Label>
//                     <Form.Control
//                       type="number"
//                       onChange={(e) => setMobileNo(e.target.value)}
//                       placeholder="Enter Mobile"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Emergency Mobile No</Form.Label>
//                     <Form.Control
//                       type="number"
//                       onChange={(e) => setEmergencyMobileNo(e.target.value)}
//                       placeholder="Enter Emergency Mobile"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Mother's Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setMotherName(e.target.value)}
//                       placeholder="Enter Faculty mother's Name"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Father's Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setFatherName(e.target.value)}
//                       placeholder="Enter Faculty Father's Name"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Form.Label>Gender</Form.Label>
//                   <Form.Select
//                     aria-label="Gender"
//                     onChange={(e) => setGender(e.target.value)}
//                   >
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </Form.Select>
//                 </Col>
//                 <Col>
//                   <Form.Label>Married Status</Form.Label>
//                   <Form.Select
//                     aria-label="marriedstatus"
//                     onChange={(e) => setMarriedStatus(e.target.value)}
//                   >
//                     <option value="not married">Not Married</option>
//                     <option value="married">Married</option>
//                   </Form.Select>
//                 </Col>
              
//               </Row>
//                 <Row>
//                   <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Date Of Birth</Form.Label>
//                     <Form.Control
//                       type="date"
//                       onChange={(e) => setDob(e.target.value)}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Thumb Id</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setThumbId(e.target.value)}
//                       placeholder="Enter Thumb Id"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                  <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>College Email</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setCollegeEmail(e.target.value)}
//                       placeholder="Enter College email"
//                     />
//                   </Form.Group>
//                 </Col>
//                  <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Designation</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setDesignation(e.target.value)}
//                       placeholder="Enter Designation"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//                <Row>
//                 <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Upload Highest Qualification</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={(e) => setHighestQualification(e.target.value)}
//                       placeholder="Upload Highest Qualification"
//                     />
//                   </Form.Group>
//                 </Col>
//                  <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Total Experience</Form.Label>
//                     <Form.Control
//                       type="number"
//                       onChange={(e) => setTotalExperience(e.target.value)}
//                       placeholder="Enter Total Experience"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                  <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Teaching Experience</Form.Label>
//                     <Form.Control
//                       type="number"
//                       onChange={(e) => setTeachingExperience(e.target.value)}
//                       placeholder="Enter Teaching Experience"
//                     />
//                   </Form.Group>
//                 </Col>
//                  <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Industry Experience</Form.Label>
//                     <Form.Control
//                       type="number"
//                       onChange={(e) => setIndustryExperience(e.target.value)}
//                       placeholder="Enter Industry Experience"
//                     />
//                   </Form.Group>
//                 </Col>
//                  <Col>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Research  Experience</Form.Label>
//                     <Form.Control
//                       type="number"
//                       onChange={(e) => setResearchExperience(e.target.value)}
//                       placeholder="Enter Research Experience"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                  <Col>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Upload Faculty Image</Form.Label>
//                   <Form.Control
//                     type="file"
//                     onChange={(e) => setFile(e.target.files[0])}
//                     placeholder="Upload Faculty Image"
//                   />
//                 </Form.Group>
//               </Col>
//               </Row>

//               <Button
//                 className="me-2"
//                 variant="danger"
//                 onClick={() => navigate("/faculties")}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="success"
//                 disabled={buttonDisabled}
//                 onClick={doAddFaculty}
//               >
//                 Add Faculty
//               </Button>
//               <span className="mx-4 text-secondary ">Or upload via csv</span>
//               {/* <Button
//                 variant="success"
//                 disabled={buttonDisabled}
//                 onClick={doUploadCsv}
//               >
//                 upload Csv
//               </Button> */}
//             </Form>
//           </Container>
//         )}
//         {showSpinner && (
//           <div className="d-flex justify-content-center align-items-center vh-100">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         )}
//         <Modal show={show} onHide={handleClose}>
//           <Modal.Header closeButton>
//             <Modal.Title>Success</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>Faculty added successfully</Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//         {/* <Modal show={showModal} onHide={handleClose}>
//           <Modal.Header closeButton>
//             <Modal.Title>Success</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//   <input
//     type="file"
//     name="facultyData"
//     accept=".csv"
//     onChange={(e) => {
//       if (e.target.files.length > 0) {
//         setFile(e.target.files[0]);
//       }
//     }}
//   />
//   <Button variant="success" disabled={buttonDisabled} onClick={doAddFaculties}>
//     Upload CSV
//   </Button>
// </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal> */}

//     </>
//   );
// }

// export default AddFaculty;
