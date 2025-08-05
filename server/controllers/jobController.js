const Job = require('../models/Job');
const jobCards = require('../data/jobCards.json');

exports.getJobCards = (req, res) => {
  res.json(jobCards);
};

exports.startJob = async (req, res) => {
  const { jobId, partName, machineName } = req.body;
  const newJob = new Job({ jobId, partName, machineName, startTime: new Date() });
  await newJob.save();
  res.status(201).json({ message: "Job started", job: newJob });
};

exports.stopJob = async (req, res) => {
  const { jobId } = req.body;
  const job = await Job.findOne({ jobId, endTime: null });
  if (!job) return res.status(404).json({ message: "Job not found or already stopped" });

  job.endTime = new Date();
  const durationMs = job.endTime - job.startTime;
  job.duration = new Date(durationMs).toISOString().substr(11, 8);
  await job.save();
  res.json({ message: "Job stopped", job });
};

exports.getCompletedJobs = async (req, res) => {
  const jobs = await Job.find({ endTime: { $ne: null } });
  res.json(jobs);
};

exports.getActiveJob = async (req, res) => {
  try {
    const activeJob = await Job.findOne({ endTime: null });
    if (!activeJob) {
      return res.json(null); // No active job
    }
    res.json(activeJob); // Return active job
  } catch (error) {
    console.error("Error fetching active job:", error);
    res.status(500).json({ message: "Failed to fetch active job" });
  }
};

