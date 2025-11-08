const Application = {
  courseId: { type: String, required: true }, // Reference to Course
  studentId: { type: String, required: true }, // Reference to User
  institutionId: { type: String, required: true }, // Reference to Institution
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'waitlisted'],
    default: 'pending' 
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  feedback: String,
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

module.exports = Application;
