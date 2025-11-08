const Job = {
  title: { type: String, required: true },
  companyId: { type: String, required: true }, // Reference to Company
  description: String,
  requirements: {
    education: {
      qualification: String,
      minGrade: String
    },
    skills: [String],
    experience: {
      years: Number,
      field: String
    }
  },
  location: String,
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  salaryRange: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

module.exports = Job;
