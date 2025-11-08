const Course = {
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  facultyId: { type: String, required: true }, // Reference to Faculty
  institutionId: { type: String, required: true }, // Reference to Institution
  duration: Number, // in years
  requirements: {
    minGrade: String, // e.g., "C" in relevant subjects
    subjects: [String] // required subjects
  },
  capacity: Number,
  availableSlots: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

module.exports = Course;
