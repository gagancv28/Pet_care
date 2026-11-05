const mongoose = require('mongoose');

const feedingNotesSchema = new mongoose.Schema({
  morningMeal: { type: String, default: '' },
  eveningMeal: { type: String, default: '' },
  portionSizeGrams: { type: Number, min: 0, default: 0 },
  dietBrand: { type: String, default: '' },
  allergiesAndRestrictions: { type: String, default: '' },
}, { _id: false });

const petSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Pet name is required'], trim: true },
  species: { type: String, enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'], default: 'Dog' },
  breed: { type: String, default: '' },
  ageYears: { type: Number, min: [0, 'Age cannot be negative'], default: 0 },
  weightKg: { type: Number, min: [0.1, 'Weight must be at least 0.1 kg'], default: 1 },
  gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
  microchipId: { type: String, default: '' },
  vetClinicName: { type: String, default: '' },
  vetPhone: { type: String, default: '' },
  feedingNotes: { type: feedingNotesSchema, default: () => ({}) },
  medicalSummary: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
