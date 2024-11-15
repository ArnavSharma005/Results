import mongoose from "mongoose"
import bcrypt from "bcrypt"

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true }, // e.g., "Computer Science"
  year: { type: Number, required: true }, // e.g., 1, 2, 3, 4
  semester: { type: Number, required: true }, // e.g., 1 or 2
  branch: { type: String, required: true },
  subsection: { type: String, required: true },

  subjects: [
    {
      year: { type: Number, required: true },
      semester: { type: Number, required: true },
      coreSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
      optionalSubjects: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
      ],
    },
  ],

  // Date of registration
  registeredAt: { type: Date, default: Date.now },
})

// Hash the password before saving the student
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare entered password with hashed password
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Student = mongoose.model("Student", studentSchema)

export default Student
