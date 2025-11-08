const Faculty = {
  name: { type: String, required: true },
  institutionId: { type: String, required: true }, // Reference to Institution
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

module.exports = Faculty;
