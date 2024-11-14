import express from 'express';
const router=express.Router();

import { addSubject ,addTeacher,getSubjectsByTeachers ,getClassesBySubject} from '../controller/adminController.js';

router.post('/addSubject', addSubject); //name, code, credits, theoryCredits, practicalCredits, hasPractical, department, year, semester, isCore
router.post('/addTeacher', addTeacher); //name, email, department, subjectCodes ,classes
router.get('/getSubjectsByTeachers', getSubjectsByTeachers); //teacherId
router.get('/getClassesBySubject', getClassesBySubject); //subjectCode
export default router;