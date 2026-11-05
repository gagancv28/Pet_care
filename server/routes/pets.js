const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const CareTask = require('../models/CareTask');
const VisitRecord = require('../models/VisitRecord');
const { validatePet } = require('../middleware/validate');

// GET /api/pets
router.get('/', async (req, res, next) => {
  try {
    const pets = await Pet.find().sort({ createdAt: 1 });
    res.json({ success: true, data: pets });
  } catch (err) { next(err); }
});

// POST /api/pets
router.post('/', validatePet, async (req, res, next) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json({ success: true, data: pet });
  } catch (err) { next(err); }
});

// PUT /api/pets/:id
router.put('/:id', validatePet, async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, data: pet });
  } catch (err) { next(err); }
});

// DELETE /api/pets/:id — cascades to tasks and visits
router.delete('/:id', async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    await CareTask.deleteMany({ petId: req.params.id });
    await VisitRecord.deleteMany({ petId: req.params.id });
    res.json({ success: true, message: 'Pet and all related records deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
