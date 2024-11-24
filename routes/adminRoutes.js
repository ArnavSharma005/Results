import express from "express"
const router = express.Router()

import {
  addSubject,
  addTeacher,
  getSubjectsByTeachers,
  getClassesBySubject,
  getTeachers,
  addStudent,
  getStudents,
  getStudentsByClass,
  getStudentsBySubsection,
  getSubjects,
  assignMarksByClass,
  getMarksByClassAndSemester,
  getAlldept,
  getAllBranches,
  getAllCoreSubjects,
  getAllOptionalSubjects,
  getResultByStudent,
} from "../controller/adminController.js"

router.post("/addSubject", addSubject) //name, code, credits, theoryCredits, practicalCredits, hasPractical, department, year, semester, isCore
router.post("/addTeacher", addTeacher) //name, email, department, subjectCodes ,classes
router.post("/addStudent", addStudent)
router.get("/getSubjectsByTeachers", getSubjectsByTeachers) //teacherId
router.post("/getClassesBySubject", getClassesBySubject) //subjectCode
router.get("/getStudentByClass", getStudentsByClass)
router.get("/get-students-by-subsection", getStudentsBySubsection)
router.get('/getTeachers',getTeachers)
router.get('/getStudents',getStudents)
router.get('/getSubjects',getSubjects)
router.get('/getAlldept',getAlldept)
router.get('/getAllBranches',getAllBranches)
router.get('/getAllCoreSubjects',getAllCoreSubjects)
router.get('/getAllOptionalSubjects',getAllOptionalSubjects)
//assign marks
router.post("/assign-marks", assignMarksByClass)
//get marks

router.get("/get-class-marks", getMarksByClassAndSemester) //classId, semester
router.post("/getResultByStudent", getResultByStudent) //studentRollNumber

export default router
