const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models;
const Bootcamp = require('./models/Bootcamp');

// Connect to DB;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import to DB;
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data from DB;
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany(); // delete all bootcamps
    console.log('Data deleted...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
