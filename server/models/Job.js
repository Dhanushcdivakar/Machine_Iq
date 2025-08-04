const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobId: String,
  partName: String,
  machineName: String,
  startTime: Date,
  endTime: Date,
  duration: String
});

module.exports = mongoose.model('Job', JobSchema);
