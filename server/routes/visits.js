const express = require('express');
const router = express.Router();
const VisitRecord = require('../models/VisitRecord');
const { validateVisit } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.petId) filter.petId = req.query.petId;
    const visits = await VisitRecord.find(filter).populate('petId', 'name species').sort({ visitDate: -1 });
    res.json({ success: true, data: visits, total: visits.length });
  } catch (err) { next(err); }
});

router.post('/', validateVisit, async (req, res, next) => {
  try {
    const visit = new VisitRecord(req.body);
    await visit.save();
    const populated = await visit.populate('petId', 'name species');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const visit = await VisitRecord.findByIdAndDelete(req.params.id);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, message: 'Visit deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
