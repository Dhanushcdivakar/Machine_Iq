const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Your backend is successfully deployed.');
});

app.use('/api', jobRoutes);

mongoose.connect('mongodb+srv://dhanushcdivaker8984:HmeCFpPuvMyWaqoF@cluster0.qvw2jqi.mongodb.net/jobtracker?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
