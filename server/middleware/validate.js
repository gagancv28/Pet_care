const validatePet = (req, res, next) => {
  const errors = {};
  const { name, weightKg, ageYears } = req.body;
  if (!name || !name.toString().trim()) errors.name = 'Pet name is required';
  if (weightKg !== undefined && weightKg !== '' && (isNaN(Number(weightKg)) || Number(weightKg) < 0.1))
    errors.weightKg = 'Weight must be at least 0.1 kg';
  if (ageYears !== undefined && ageYears !== '' && (isNaN(Number(ageYears)) || Number(ageYears) < 0))
    errors.ageYears = 'Age cannot be negative';
  if (Object.keys(errors).length > 0)
    return res.status(400).json({ success: false, errors });
  next();
};

const validateTask = (req, res, next) => {
  const errors = {};
  const { petId, title, dueDate } = req.body;
  if (!petId) errors.petId = 'Pet ID is required';
  if (!title || !title.toString().trim()) errors.title = 'Task title is required';
  if (!dueDate || isNaN(new Date(dueDate).getTime()))
    errors.dueDate = 'A valid due date is required';
  if (Object.keys(errors).length > 0)
    return res.status(400).json({ success: false, errors });
  next();
};

const validateVisit = (req, res, next) => {
  const errors = {};
  const { petId, visitDate, title, weightRecordedKg, costInr } = req.body;
  if (!petId) errors.petId = 'Pet ID is required';
  if (!title || !title.toString().trim()) errors.title = 'Visit title is required';
  if (!visitDate || isNaN(new Date(visitDate).getTime()))
    errors.visitDate = 'A valid visit date is required';
  if (weightRecordedKg !== undefined && weightRecordedKg !== null && weightRecordedKg !== '' &&
      (isNaN(Number(weightRecordedKg)) || Number(weightRecordedKg) < 0.1))
    errors.weightRecordedKg = 'Weight must be at least 0.1 kg';
  if (costInr !== undefined && costInr !== '' && (isNaN(Number(costInr)) || Number(costInr) < 0))
    errors.costInr = 'Cost cannot be negative';
  if (Object.keys(errors).length > 0)
    return res.status(400).json({ success: false, errors });
  next();
};

module.exports = { validatePet, validateTask, validateVisit };
