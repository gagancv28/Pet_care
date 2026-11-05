const mongoose = require('mongoose');

const careTaskSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: [true, 'Pet ID is required'] },
  title: { type: String, required: [true, 'Task title is required'], trim: true },
  category: {
    type: String,
    enum: ['Vaccination', 'Feeding', 'Medication', 'Grooming', 'Deworming', 'Vet Appointment'],
    default: 'Medication'
  },
  dueDate: { type: Date, required: [true, 'Due date is required'] },
  recurrence: {
    type: String,
    enum: ['One-Time', 'Daily', 'Weekly', 'Monthly', 'Every 6 Months', 'Yearly'],
    default: 'One-Time'
  },
  dosageOrInstruction: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('CareTask', careTaskSchema);
