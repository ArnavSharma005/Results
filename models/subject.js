import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  credits: { type: Number, required: true },
  theoryCredits: { type: Number, default: 0 },
  practicalCredits: { type: Number, default: 0 },
  hasPractical: { type: Boolean, default: false },

  // To categorize subjects based on department, year, semester
  department: { type: String, required: true }, // e.g., "Computer Science"
  year: { type: Number, required: true }, // e.g., 1, 2, 3, 4
  semester: { type: Number, required: true }, // e.g., 1 or 2
  isCore: { type: Boolean, default: true }, // True for core, false for optional
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject
