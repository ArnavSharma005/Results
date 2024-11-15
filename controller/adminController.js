import Teacher from "../models/teacher.js"
import Subject from "../models/subject.js"
import Student from "../models/student.js"
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
    name,
    email,
    password,
    department,
    year,
    semester,
    branch,
    subsection,
    coreSubjects,
    optionalSubjects,
  } = req.body
  try {
    const newStudent = new Student({
      name,
      email,
      password,
      department,
      year,
      semester,
      subsection,
      branch,
      subjects: [
        {
          year: year,
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
  const { name, email, password, department, subjectCodes, classes } = req.body

  try {
    // Check if classes are provided as expected
    if (!subjectCodes || !classes || subjectCodes.length !== classes.length) {
      return res.status(400).json({
        message: "Subject codes and classes do not match or are missing.",
      })
    }

    // Map `subjectCodes` and `classes` into the `subjectsAndClasses` array format
    const subjectsAndClasses = subjectCodes.map((code, index) => ({
      subjectCode: code,
      classesTaught: classes[index] || [], // Assign classes to each subjectCode
    }))

    console.log("subjectsAndClasses:", subjectsAndClasses) // Log the result for debugging

    const teacher = await Teacher.create({
      name,
      email,
      password,
      department,
      subjectsAndClasses,
    })

    res.status(201).json({ teacher })
  } catch (error) {
    console.error("Error in addTeacher:", error) // Log the error
    res.status(500).json({ message: "Server Error" })
  }
}

export const getSubjectsByTeachers = async (req, res) => {
  const { teacherId } = req.body
  try {
    const teacher = await Teacher.findById(teacherId)
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }
    const subjectCodes = teacher.subjectsAndClasses.map(
      ({ subjectCode }) => subjectCode
    )
    const subjects = await Subject.find({ code: { $in: subjectCodes } })
    res.status(200).json({ subjects })
  } catch (error) {
    console.error("Error in getSubjectsByTeachers:", error) // Log the error
    res.status(500).json({ message: "Server Error" })
  }
}

export const getClassesBySubject = async (req, res) => {
  const { teacherId, subjectCode } = req.body
  try {
    const teacher = await Teacher.findById(teacherId)
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }
    const subject = teacher.subjectsAndClasses.find(
      ({ subjectCode: code }) => code === subjectCode
    )
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" })
    }
    res.status(200).json({ classes: subject.classesTaught })
  } catch (error) {
    console.error("Error in getClassesBySubject:", error) // Log the error
    res.status(500).json({ message: "Server Error" })
  }
}
