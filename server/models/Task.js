const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'testing', 'complete'],
    default: 'todo'
  },
  tags: [{ type: String }],
  dueDate: { type: Date },
  checklist: [{
    text: String,
    completed: { type: Boolean, default: false }
  }],
  createdAt: { type: Number, default: Date.now }
});

// Map _id to id for frontend compatibility
TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    // Handle checklist items _id as well
    if (ret.checklist) {
      ret.checklist.forEach(item => {
        item.id = item._id;
        delete item._id;
      });
    }
  }
});

module.exports = mongoose.model('Task', TaskSchema);