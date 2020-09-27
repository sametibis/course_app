const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

// @description:    Get all bootcamps
// @route:          GET /api/v1/bootcamps/
// @access:         Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // query bilgisi bir nesne(JSON). Örneğin;
  // Person.
  //   find({
  //     age: { $gt: 17, $lt: 66 }, => query1
  //     likes: { $in: ['vaporizing', 'talking'] }, => query2
  //   });

  // let queryStr = JSON.stringify(req.query); // query to string

  // queryStr = queryStr.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // );

  // console.log(queryStr); // çıktısı altta
  // // {"averageCost":{"$lte":"10000"}}
  // // GET /api/v1/bootcamps?averageCost[lte]=10000 // req url

  /***********************************************************/

  /* 
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // 
    const removeFields = ['select', 'sort']

    //
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string;
    let queryStr = JSON.stringfy(reqQuery);

    // Create operators ($gt, $lte vs...)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding data 
    query = Bootcamp.find(JSON.parse(queryStr));

    // Select fields;
    if(req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort fields;
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
      
      // this is default status
    }

    // Executing query;
    const bootcamps = await query;
    ......
    ......
  */

  /**********************************************************/

  let query;
  let queryStr;

  queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await query;
  // const bootcamps = await query.select('name description'); =>  bring =>  id, name, description
  // const bootcamps = await query.select('name description housing averageCost').sort({averageCost: 1});
  // const bootcamps = await query.sort('-averageCost');

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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

// @description:    Delete a bootcamp by ID
// @route:          DELETE /api/v1/bootcamps/:id
// @access:         Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

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
