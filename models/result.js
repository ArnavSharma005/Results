import mongoose from "mongoose";
const { Schema } = mongoose;

const resultSchema = new mongoose.Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },

  // Marks Distribution for Theory
  theoryMarks: {
    midSem1: { type: Number, default: 0, max: 15 },
    midSem2: { type: Number, default: 0, max: 15 },
    endSem: { type: Number, default: 0, max: 50 },
    teacherAssessment: { type: Number, default: 0, max: 10 },
    attendance: { type: Number, default: 0, max: 10 },
    totalTheoryMarks: { type: Number, default: 0 },
  },

  // Marks Distribution for Practical (if applicable)
  practicalMarks: {
    viva1: { type: Number, default: 0, max: 15 },
    viva2: { type: Number, default: 0, max: 15 },
    endSemPractical: { type: Number, default: 0, max: 40 },
    attendance: { type: Number, default: 0, max: 10 },
    totalPracticalMarks: { type: Number, default: 0 },
  },

  totalMarks: { type: Number, default: 0 },
  grade: { type: String },
});

// Calculate total marks before saving
resultSchema.pre('save', async function (next) {
  const result = this;

  // Calculate total theory marks
  result.theoryMarks.totalTheoryMarks =
    result.theoryMarks.midSem1 +
    result.theoryMarks.midSem2 +
    result.theoryMarks.endSem +
    result.theoryMarks.teacherAssessment +
    result.theoryMarks.attendance;

  // Calculate total practical marks if applicable
  result.practicalMarks.totalPracticalMarks =
    result.practicalMarks.viva1 +
    result.practicalMarks.viva2 +
    result.practicalMarks.endSemPractical +
    result.practicalMarks.attendance;

  // Fetch the subject to calculate weighted total marks
  const Subject = mongoose.model('Subject');
  const subject = await Subject.findById(result.subject);

  const theoryFactor = subject.theoryCredits / subject.credits;
  const practicalFactor = subject.hasPractical
    ? subject.practicalCredits / subject.credits
    : 0;

  result.totalMarks =
    result.theoryMarks.totalTheoryMarks * theoryFactor +
    (subject.hasPractical
      ? result.practicalMarks.totalPracticalMarks * practicalFactor
      : 0);

  // Assign grade based on total marks
  if (result.totalMarks >= 90) result.grade = 'A+';
  else if (result.totalMarks >= 80) result.grade = 'A';
  else if (result.totalMarks >= 70) result.grade = 'B';
  else if (result.totalMarks >= 60) result.grade = 'C';
  else result.grade = 'D';

  next();
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
