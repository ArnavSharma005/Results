import mongoose from "mongoose"

// Define a sub-schema for subject-class mapping
const subjectClassMappingSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true
    },
    classesTaught: [{
        type: String,
        required: true
    }],
    // Optional: You can add more fields like academic year, semester etc.
});

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    // Replace separate arrays with the mapping
    subjectsAndClasses: [subjectClassMappingSchema]
});

const Teacher = mongoose.model('Teacher',teacherSchema);
export default Teacher;