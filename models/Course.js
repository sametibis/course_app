const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['Beginner', 'Intermediate', 'Advenced'],
  },
  schoolarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true, // Each course needs to have a bootcamp
  },
});

// getAverageCost
// Static methodlara doğrudan model üzerinden erişilir
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // aggregation
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save: Her kurs eklendikten sonra ortalama maliyet yeniden hesaplanacak
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
  // Course schema contructor içinde getAverageCost
});

// Call getAverageCost before remove: Her kurs silinmeden hemen önce ortalama maliyet yeniden hesaplanacak
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
