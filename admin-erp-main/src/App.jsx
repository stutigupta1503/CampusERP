import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import WelcomePage from './pages/WelcomePage/WelcomePage'

// Login
import AdminLogin from './pages/LoginSignupPages/AdminLogin'

// Branch
import AddBranch from './pages/Branch/AddBranch'
import BranchList from './pages/Branch/BranchList'
import BranchEdit from './pages/Branch/BranchEdit'

// Course
import AddCourse from './pages/Course/AddCourse'
import CourseList from './pages/Course/CourseList'
import CourseEdit from './pages/Course/CourseEdit'

// Subject
import AddSubject from './pages/Subject/AddSubject'
import SubjectList from './pages/Subject/SubjectList'
import SubjectEdit from './pages/Subject/SubjectEdit'

// Subject Mapping
import AddSubjectMapping from './pages/SubjectMapping/AddSubjectMapping'
import SubjectMappingList from './pages/SubjectMapping/SubjectMappingList'

// Faculty
import AddFaculty from './pages/Faculty/AddFaculty'
import FacultyList from './pages/Faculty/FacultyList'
import FacultyEdit from './pages/Faculty/FacultyEdit'

// Student
import AddStudent from './pages/Student/AddStudent'
import StudentList from './pages/Student/StudentList'
import StudentEdit from './pages/Student/StudentEdit'
import StudentProfile from './pages/Student/StudentProfile'

// Timeslot
import AddTimeslot from './pages/Timeslot/AddTimeslot'
import TimeslotList from './pages/Timeslot/TimeslotList'
import TimeslotEdit from './pages/Timeslot/TimeslotEdit'



function App() {
  return (
    <BrowserRouter>

      {/* Login */}
      <Routes>
        <Route path="/" element={<AdminLogin />} />
      </Routes>

      <div className="d-flex">
        <Sidebar />

        <main style={{ flexGrow: 1, padding: '20px' }}>

          <Routes>

            {/* Dashboard */}
            <Route
              path="/admin/dashboard"
              element={<WelcomePage />}
            />

            {/* Courses */}
            <Route
              path="/courses"
              element={<CourseList />}
            />

            <Route
              path="/add/course"
              element={<AddCourse />}
            />

            <Route
              path="/edit/course/:id"
              element={<CourseEdit />}
            />


            {/* Branches */}
            <Route
              path="/branches"
              element={<BranchList />}
            />

            <Route
              path="/add/branch"
              element={<AddBranch />}
            />

            <Route
              path="/edit/branch/:id"
              element={<BranchEdit />}
            />


            {/* Subjects */}
            <Route
              path="/subjects"
              element={<SubjectList />}
            />

            <Route
              path="/add/subject"
              element={<AddSubject />}
            />

            <Route
              path="/edit/subject/:id"
              element={<SubjectEdit />}
            />


            {/* Subject Mapping */}
            <Route
              path="/subjectsmap"
              element={<SubjectMappingList />}
            />

            <Route
              path="/add/subjectmapping"
              element={<AddSubjectMapping />}
            />


            {/* Faculty */}
            <Route
              path="/faculties"
              element={<FacultyList />}
            />

            <Route
              path="/add/faculty"
              element={<AddFaculty />}
            />

            <Route
              path="/edit/faculty/:id"
              element={<FacultyEdit />}
            />


            {/* Students */}
            <Route
              path="/students"
              element={<StudentList />}
            />

            <Route
              path="/add/student"
              element={<AddStudent />}
            />

            <Route
              path="/edit/student/:id"
              element={<StudentEdit />}
            />

            <Route
              path="/student/profile/:id"
              element={<StudentProfile />}
            />


            {/* Timeslot */}
            <Route
              path="/timeslot"
              element={<TimeslotList />}
            />

            <Route
              path="/add/timeslot"
              element={<AddTimeslot />}
            />

            <Route path="/timeslot/edit/:id" element={<TimeslotEdit />}></Route>
            
          </Routes>

        </main>
      </div>

    </BrowserRouter>
  )
}

export default App