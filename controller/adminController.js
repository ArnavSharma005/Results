import Teacher from "../models/teacher.js"
import Subject from "../models/subject.js"
import Student from "../models/student.js"
import Result from "../models/result.js"
export const addSubject = async (req, res) => {
  const {
    name,
    code,
    credits,
    theoryCredits,
    practicalCredits,
    hasPractical,
    department,
    year,
    semester,
    isCore,
  } = req.body

  try {
    const subject = await Subject.create({
      name,
      code,
      credits,
      theoryCredits,
      practicalCredits,
      hasPractical,
      department,
      year,
      semester,
      isCore,
    })

    res.status(201).json({
      message: "Subject Added successfully",
      data: subject,
      error: false,
    })
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: true })
  }
}
export const addStudent = async (req, res) => {
  const {
    rollNumber,
    name,
    email,
    password,
    department,
    academicYear,
    semester,
    branch,
    subsection,
    coreSubjects,
    optionalSubjects,
  } = req.body
  try {
    const newStudent = new Student({
      rollNumber,
      name,
      email,
      password,
      department,
      academicYear,
      semester,
      subsection,
      branch,
      subjects: [
        {
          semester: semester,
          coreSubjects,
          optionalSubjects,
        },
      ],
    })
    const student = await newStudent.save()

    res.status(201).json({
      message: "Student Added successfully",
      data: student,
      error: false,
    })
  } catch (error) {
    console.error("Error in addStudent:") // Log the error
    res.status(500).json({ message: "Server Error", error: error })
  }
}

export const addTeacher = async (req, res) => {
  const { name, email, password, department, subjectsAndClasses } = req.body

  try {
    console.log("subjectsAndClasses:", subjectsAndClasses) // Log the result for debugging
    const teacher = await Teacher.create({
      name,
      email,
      password,
      department,
      subjectsAndClasses,
    })
    res.status(201).json({
      error: false,
      message: "Teacher added successfully",
      data: teacher,
    })
  } catch (error) {
    //console.error("Error in addTeacher:", error) // Log the error
    res.status(500).json({ error: true, message: "Server Error" })
  }
}

export const getSubjectsByTeachers = async (req, res) => {
  const { teacherId } = req.body
  try {
    const teacher = await Teacher.findById(teacherId)
      .select("-password -email")
      .populate({
        path: "subjectsAndClasses.subject", // Populating the 'subject' field
        select: "name code", // Optionally select specific fields from Subject (e.g., 'name', 'code')
      })
      .exec()
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }
    // const subjectByTecher = teacher.subjectsAndClasses.map(({ subjects }) => {
    //   const obj = {
    //     subjectCode: subjects.subject.code,
    //     subjectName: subjects.subject.name,
    //     subjectId: subjects.subject._id,
    //   }
    //   return obj
    // })
    //const subjects = await Subject.find({ code: { $in: subjectCodes } })
    res.status(200).json({
      error: false,
      data: teacher,
      message: "Teacher fetcched successfully",
    })
  } catch (error) {
    console.error("Error in getSubjectsByTeachers:", error) // Log the error
    res.status(500).json({ message: "Server Error" })
  }
}

export const getClassesBySubject = async (req, res) => {
  const { teacherId, subjectCode } = req.body;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the subject based on subjectCode within the teacher's subjectsAndClasses array
    const subject = teacher.subjectsAndClasses.find(({ subject }) => subject._id == subjectCode);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Return the classesTaught for the found subject
    res.status(200).json({ classes: subject.classesTaught });
  } catch (error) {
    console.error("Error in getClassesBySubject:", error); // Log the error
    res.status(500).json({ message: "Server Error" });
  }
};


export const getStudentsBySubsection = async (req, res) => {
  const { branch, subsection, semester, academicYear } = req.body
  try {
    const students = await Student.find({
      branch,
      semester,
      academicYear,
      subsection,
    })
      .select("name rollNumber")
      .sort("rollNumber")
    res.status(200).json({
      error: false,
      data: {
        branch,
        semester,
        academicYear,
        subsection,

        students,
      },
      message: "Students fetched successfully",
    })
  } catch (error) {
    console.error("Error in getStudentsByBranch:", error) // Log the error
    res.status(500).json({ message: "Server Error" })
  }
}
export const getStudentsByClass = async (req, res) => {
  const { branch, semester, academicYear } = req.body
  try {
    const students = await Student.find({
      branch,
      semester,
      academicYear,
    })
      .select("name rollNumber")
      .sort("rollNumber")
    res.status(200).json({
      error: false,
      data: {
        branch,
        semester,
        academicYear,

        students,
      },
      message: "Students fetched successfully",
    })
  } catch (error) {
    console.error("Error in getStudentsByBranch:", error) // Log the error
    res.status(500).json({ message: "Server Error" })
  }
}

//assign-marks-by-class

export const assignMarksByClass = async (req, res) => {
  const { subjectId, semester, examType, studentMarks } = req.body

  // Validation checks
  if (!subjectId || !semester || !examType || !Array.isArray(studentMarks)) {
    return res
      .status(400)
      .json({ message: "Missing or invalid required fields" })
  }

  try {
    //checking if the subject has practical or not?
    const subject = await Subject.findById(subjectId)
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" })
    }
    const hasPractical = subject.hasPractical
    //give error if subject doesnot have practical but given exam type like viva1,viva2,endsemPractical,attendancePractical,projectFile
    if (
      (!hasPractical && examType.includes("Practical")) ||
      (!hasPractical &&
        (examType.includes("viva1") ||
          examType.includes("viva2") ||
          examType.includes("projectFile")))
    ) {
      return res
        .status(400)
        .json({ message: "Subject does not have practical" })
    }
    for (const studentMark of studentMarks) {
      const { rollNumber, marks } = studentMark

      // Step 1: Find the student by roll number
      const student = await Student.findOne({ rollNumber })
      if (!student) {
        console.warn(`Student with roll number ${rollNumber} not found`)
        continue // Skip this student if not found
      }

      // Step 2: Check if a result entry already exists
      let result = await Result.findOne({
        student: student._id,
        subject: subjectId,
        semester,
      })

      // If no result entry exists, create a new one
      if (!result) {
        result = new Result({
          student: student._id,
          subject: subjectId,
          semester,
        })
      }

      // Step 3: Assign marks based on the exam type
      switch (examType) {
        case "midSem1":
          result.theoryMarks.midSem1 = marks
          break
        case "midSem2":
          result.theoryMarks.midSem2 = marks
          break
        case "endSem":
          result.theoryMarks.endSem = marks
          break
        case "teacherAssessment":
          result.theoryMarks.teacherAssessment = marks
          break
        case "attendanceTheory":
          result.theoryMarks.attendance = marks
          break
        case "viva1":
          result.practicalMarks.viva1 = marks
          break
        case "viva2":
          result.practicalMarks.viva2 = marks
          break
        case "endSemPractical":
          result.practicalMarks.endSemPractical = marks
          break
        case "attendancePractical":
          result.practicalMarks.attendance = marks
          break
        case "projectFile":
          result.practicalMarks.projectFile = marks
          break
        default:
          return res.status(400).json({ message: "Invalid exam type" })
      }

      // Step 4: Save or update the result
      await result.save()
    }

    return res.status(200).json({ message: "Marks assigned successfully" })
  } catch (error) {
    console.error("Error assigning marks:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

//get marks by class and subject
export const getMarksByClassAndSemester = async (req, res) => {
  const { branch, subsection, semester, subjectId } = req.body

  try {
    // Step 1: Fetch all students of the specified class and semester
    //if subsection is not provided return all students
    let students
    if (!subsection) {
      students = await Student.find({
        branch,
        semester,
      })
        .select("_id rollNumber name")
        .sort("rollNumber") // Only fetch necessary fields
    } else {
      students = await Student.find({
        branch,
        subsection,
        semester,
      })
        .select("_id rollNumber name")
        .sort("rollNumber") // Only fetch necessary fields
    }

    // Step 2: Fetch marks for each student for the given subject
    const results = await Result.find({
      student: { $in: students.map((student) => student._id) },
      subject: subjectId,
    })
      .populate("student", "rollNumber")
      .lean()

    // Step 3: Map results to the desired format
    const marksData = students.map((student) => {
      const result = results.find(
        (res) => res.student._id.toString() === student._id.toString()
      )

      return {
        rollNumber: student.rollNumber,
        name: student.name,
        theoryMarks: result?.theoryMarks || {},
        practicalMarks: result?.practicalMarks || {},
        totalMarks: result?.totalMarks || "NA",
        grade: result?.grade || "NA",
      }
    })

    // Respond with the formatted marks data
    return res
      .status(200)
      .json({
        error: false,
        data: marksData,
        message: "marks fetched successfully",
      })
  } catch (error) {
    console.error("Error fetching marks:", error)
    return res.status(500).json({ error: "Failed to fetch marks" })
  }
}


export const getTeachers=async(req,res)=>{
  try{
    const teachers = await Teacher.find({})
    res.status(201).send(teachers)
  }
  catch(err)
  {
    res.status(402).send(err)
  }
}




export const getStudents=async(req,res)=>{
  try{
    const students = await Student.find({})
    res.status(201).send(students)
  }
  catch(err)
  {
    res.status(402).send(err)
  }
}



export const getSubjects=async(req,res)=>{
  try{
    const subjects = await Subject.find({})
    res.status(201).send(subjects)
  }
  catch(err)
  {
    res.status(402).send(err)
  }
}


