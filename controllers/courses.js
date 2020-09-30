const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @description     Get all courses
// @route           GET /api/v1/courses
// @route           GET /api/v1/:bootcampId/courses
// @access          public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advencedResults);
  }
});

// @description   Get single course by ID
// @route         GET /api/v1/courses/:id
// @access        Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate(
    'bootcamp',
    'name description'
  );

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found for this ID number ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @description   Create course to a bootcamp.
// @route         POST /api/v1/bootcamps/:bootcampId/courses
// @access        Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for this Bootcamp ID ${req.params.bootcampId} `
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @description   Update course
// @route         PUT /api/v1/courses/:id
// @access        Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found for this ID number ${req.params.id}`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @description   Delete course
// @route         DELETE /api/v1/courses/:id
// @access        Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found for this ID number ${req.params.id}`,
        404
      )
    );
  }

  // await Course.remove(course);
  // await Course.remove({ _id: course._id });
  await course.remove();

  res.status(200).json({
    success: true,
    msg: 'Course deleted.',
  });
});
