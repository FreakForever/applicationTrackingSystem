const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  jobId: String,
  resumeId: String,
  matchPercentage: Number,
  highlightedResume: String,
  suggestions: {
    summarySection: { suggestions: [String] },
    experienceSection: { suggestions: [String] },
    skillsSection: { suggestions: [String] },
    educationSection: { suggestions: [String] },
    generalTips: {
      formatting: [String],
      clarity: [String],
      conciseness: [String]
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
