const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const nodemon = require('nodemon');

// @description:    Get all bootcamps
// @route:          GET /api/v1/bootcamps/
// @access:         Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advencedResults);
});

// @description:    Get a bootcamp by ID
// @route:          GET /api/v1/bootcamps/:id
// @access:         Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @description:    Add a new bootcamp
// @route:          POST /api/v1/bootcamps/
// @access:         Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamps
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already publish a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @description:    Update a bootcamp by ID
// @route:          PUT /api/v1/bootcamps/:id
// @access:         Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  // Is the user the owner of the bootcamp?
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @description:    Delete a bootcamp by ID
// @route:          DELETE /api/v1/bootcamps/:id
// @access:         Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }

  bootcamp.remove();
  // findByIdAndDelete demedik çünkü Bootcamp model'de remove middleware'ını tetiklememiz lazım. (BootcampSchema.pre('remove', ...)

  res.status(200).json({
    success: true,
    msg: 'Bootcamp deleted.',
  });
});

// @description   Get bootcamps with a radius
// @route         GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access        Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude; // enlem
  const lng = loc[0].longitude; // boylam

  // Calculate radius use radians
  const radius = distance / 3963; // 3,963 mils = earth radius

  // find by location
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @description   Upload image for bootcamp
// @route         PUT /api/v1/bootcamps/:İD/PHOTO
// @access        Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  // Is the user the owner of the bootcamp?
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  // Control file upload
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Is the file a photo?
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `This file size greater than ${process.env.MAX_FILE_UPLOAD} bytes`,
        400
      )
    );
  }

  // Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);

      return next(new ErrorResponse(`Problem with file upload `, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });

  console.log(file.name);
});
