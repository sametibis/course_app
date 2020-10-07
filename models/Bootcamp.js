const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 charcters'],
    },
    slug: String, // include bootcamp name for url: Node.JS Bootcamp => nodejs-bootcamp (slug) AND use a middleware
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 50 charcters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 charcters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid e-mail',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Academic',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: String,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*--  Bootcamp controller'daki işleler gerçekleşmeden buradaki middleware'lar çalışacak, sonra controller'daki işlemler devam edecek. Çünkü burada, Bootcamp model ile ilgili middleware'ler oluşturduk.  --*/

// Slugify Middleware
// Create Bootcamp slug from the name;
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: '_' });
  next();
}); // pre => operasyonlardan önce çalışacak(controller operations)
// pre('save', ...); kaydetmeden önce çalışacak

// GeoCode location fields: MIDDLEWARE
BootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  this.address = undefined;
  next();
});

// If the bootcamp is deleted, the lessons it contains will also be deleted. MIDDLEWARE;
BootcampSchema.pre('remove', async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  // Bootcamp silindiğinde, Course model içerisindeki bootcamp alanına silinen bootcamp id'si gidecek ve o id ye göre kurslar da silinecek.
  next();
});

// Reverse populate with virtuyals.
/* Course model içinde bootcamp alanı oluşturup, ref olarak Bootcamp modeli geçerek, bootcamp alanını populate ile doldurup kursların bootcamp bilgilerini alabiliyoduk.
Burada ters bir poıpulate yapıp, Bootcamp model içinde, içerdiği kursları gösterecek VİRTUAL yapısını kullanıcaz. */
BootcampSchema.virtual('courses', {
  // bootcamp şemaya eklemek istediğimiz alan, VİRTUAL olarak 'courses'.
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp', // in the Course model
  justOne: false,
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
