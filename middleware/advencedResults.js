const advencedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // query içinde silinecek alanlar
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string;
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $lte vs...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding data
  query = model.find(JSON.parse(queryStr));

  // Select fields;
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort fields;
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');

    // this is default sorted status
  }

  // Pagination
  // redix: taban(mathematic)

  // Current page;
  const page = parseInt(req.query.page, 10) || 1; // default first page

  // Each page per data
  const limit = parseInt(req.query.limit, 10) || 25; // default 25 data per page

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query;
  const results = await query;

  // Pagination result;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  res.advencedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advencedResults;
