import mongoose from "mongoose"
const { Schema } = mongoose

const resultSchema = new mongoose.Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },

  // Marks Distribution for Theory
  theoryMarks: {
    midSem1: { type: Number, default: null, max: 15 },
    midSem2: { type: Number, default: null, max: 15 },
    endSem: { type: Number, default: null, max: 50 },
    teacherAssessment: { type: Number, default: null, max: 10 },
    attendance: { type: Number, default: null, max: 10 },
    totalTheoryMarks: { type: Number, default: null },
  },

  // Marks Distribution for Practical (if applicable)
  practicalMarks: {
    viva1: { type: Number, default: null, max: 15 },
    viva2: { type: Number, default: null, max: 15 },
    endSemPractical: { type: Number, default: null, max: 40 },
    attendance: { type: Number, default: null, max: 10 },
    projectFile: { type: Number, default: null, max: 20 },
    totalPracticalMarks: { type: Number, default: null },
  },

  totalMarks: { type: Number, default: null },
  grade: { type: String, default: null },
})

// Calculate total marks before saving
resultSchema.pre("save", async function (next) {
  const result = this

  // Calculate total theory marks if all components are assigned
  if (
    result.theoryMarks.midSem1 !== null &&
    result.theoryMarks.midSem2 !== null &&
    result.theoryMarks.endSem !== null &&
    result.theoryMarks.teacherAssessment !== null &&
    result.theoryMarks.attendance !== null
  ) {
    result.theoryMarks.totalTheoryMarks =
      result.theoryMarks.midSem1 +
      result.theoryMarks.midSem2 +
      result.theoryMarks.endSem +
      result.theoryMarks.teacherAssessment +
      result.theoryMarks.attendance
  } else {
    result.theoryMarks.totalTheoryMarks = null
  }

  // Calculate total practical marks if all components are assigned
  if (
    result.practicalMarks.viva1 !== null &&
    result.practicalMarks.viva2 !== null &&
    result.practicalMarks.endSemPractical !== null &&
    result.practicalMarks.attendance !== null
  ) {
    result.practicalMarks.totalPracticalMarks =
      result.practicalMarks.viva1 +
      result.practicalMarks.viva2 +
      result.practicalMarks.endSemPractical +
      result.practicalMarks.attendance +
      (result.practicalMarks.projectFile ?? 0)
  } else {
    result.practicalMarks.totalPracticalMarks = null
  }

  // Fetch the subject to calculate weighted total marks
  const Subject = mongoose.model("Subject")
  const subject = await Subject.findById(result.subject)

  if (subject) {
    const theoryFactor = subject.theoryCredits / subject.credits
    const practicalFactor = subject.hasPractical
      ? subject.practicalCredits / subject.credits
      : 0

    // Calculate total marks only if all necessary marks are available
    if (result.theoryMarks.totalTheoryMarks !== null) {
      result.totalMarks =
        result.theoryMarks.totalTheoryMarks * theoryFactor +
        (subject.hasPractical &&
        result.practicalMarks.totalPracticalMarks !== null
          ? result.practicalMarks.totalPracticalMarks * practicalFactor
          : 0)
    } else {
      result.totalMarks = null
    }

    // Assign grade based on total marks if total marks are calculated
    if (result.totalMarks !== null) {
      if (result.totalMarks >= 90) result.grade = "A+"
      else if (result.totalMarks >= 80) result.grade = "A"
      else if (result.totalMarks >= 70) result.grade = "B"
      else if (result.totalMarks >= 60) result.grade = "C"
      else result.grade = "D"
    } else {
      result.grade = null
    }
  }

  next()
})

const Result = mongoose.model("Result", resultSchema)

export default Result
