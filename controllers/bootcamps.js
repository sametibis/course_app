// @description:    Get all bootcamps
// @route:          GET /api/v1/bootcamps/
// @access:         Public
exports.getBootcamps = (req, res, next) => {
  res.json({ success: true, msg: 'Bring all bootcamps.' });
};

// @description:    Get a bootcamp by ID
// @route:          GET /api/v1/bootcamps/:id
// @access:         Public
exports.getBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Bring this bootcamp: ${req.params.id}` });
};

// @description:    Add a new bootcamp
// @route:          POST /api/v1/bootcamps/
// @access:         Private
exports.createBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Add a new bootcamp.` });
};

// @description:    Update a bootcamp by ID
// @route:          PUT /api/v1/bootcamps/:id
// @access:         Private
exports.updateBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Update this bootcamp: ${req.params.id}` });
};

// @description:    Delete a bootcamp by ID
// @route:          DELETE /api/v1/bootcamps/:id
// @access:         Private
exports.deleteBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Delete this bootcamp: ${req.params.id}` });
};
