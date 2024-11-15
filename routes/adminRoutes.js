import express from "express"
const router = express.Router()

import {
  addSubject,
  addTeacher,
  getSubjectsByTeachers,
  getClassesBySubject,
  addStudent,
  getStudentsByClass,
  getStudentsBySubsection,
  assignMarksByClass,
  getMarksByClassAndSemester,
} from "../controller/adminController.js"

router.post("/addSubject", addSubject) //name, code, credits, theoryCredits, practicalCredits, hasPractical, department, year, semester, isCore
router.post("/addTeacher", addTeacher) //name, email, department, subjectCodes ,classes
router.post("/addStudent", addStudent)
router.get("/getSubjectsByTeachers", getSubjectsByTeachers) //teacherId
router.get("/getClassesBySubject", getClassesBySubject) //subjectCode
router.get("/getStudentByClass", getStudentsByClass)
router.get("/get-students-by-subsection", getStudentsBySubsection)

//assign marks
router.post("/assign-marks", assignMarksByClass)
//get marks

router.get("/get-class-marks", getMarksByClassAndSemester) //classId, semester

export default router
