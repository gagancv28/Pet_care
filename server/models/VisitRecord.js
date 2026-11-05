const mongoose = require('mongoose');

const visitRecordSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: [true, 'Pet ID is required'] },
  visitDate: { type: Date, required: [true, 'Visit date is required'] },
  title: { type: String, required: [true, 'Visit title is required'], trim: true },
  category: { type: String, default: '' },
  clinicName: { type: String, default: '' },
  vetName: { type: String, default: '' },
  weightRecordedKg: { type: Number, min: [0.1, 'Weight must be at least 0.1 kg'], default: null },
  costInr: { type: Number, min: [0, 'Cost cannot be negative'], default: 0 },
  diagnosisAndNotes: { type: String, default: '' },
  nextFollowUpDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('VisitRecord', visitRecordSchema);
