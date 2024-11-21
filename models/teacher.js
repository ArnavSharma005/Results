import mongoose from "mongoose"

// Define a sub-schema for subject-class mapping
const subjectClassMappingSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  classesTaught: [
    {
      branch: {
        type: String,
        required: true, //like IT2
      },
      section: {
        type: String,
        required: true, //like A
      },
      academicYear: {
        type: String, //like 2023-27
        required: true,
      },
      semester: {
        type: Number, //1 or 2
        required: true,
      },
    },
  ],
  // Optional: You can add more fields like academic year, semester etc.
})

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  // Replace separate arrays with the mapping
  subjectsAndClasses: [subjectClassMappingSchema],
})

const Teacher = mongoose.model("Teacher", teacherSchema)
export default Teacher
