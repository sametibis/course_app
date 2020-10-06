const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env
dotenv.config({ path: './config/config.env' });

//Connect to DB
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// Create a app from express
const app = express();

// Body Parser
app.use(express.json());

// Cookie
app.use(cookieParser());

// Dev logging middleware:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} // GET /api/v1/bootcamps/5f6f4c18dc7fa92f8065b5a4 200 173.405 ms - 590

// File Upload Middleware
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
