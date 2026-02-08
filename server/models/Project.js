const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  themeColor: { 
    type: String, 
    enum: ['pink', 'purple', 'blue', 'green', 'yellow'],
    default: 'blue'
  },
  createdAt: { type: Date, default: Date.now }
});

// Map _id to id for frontend compatibility
ProjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Project', ProjectSchema);