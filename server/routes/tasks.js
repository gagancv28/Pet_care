const express = require('express');
const router = express.Router();
const CareTask = require('../models/CareTask');
const VisitRecord = require('../models/VisitRecord');
const { validateTask } = require('../middleware/validate');

function computeNextDate(dueDate, recurrence) {
  const d = new Date(dueDate);
  switch (recurrence) {
    case 'Daily':         d.setDate(d.getDate() + 1); break;
    case 'Weekly':        d.setDate(d.getDate() + 7); break;
    case 'Monthly':       d.setMonth(d.getMonth() + 1); break;
    case 'Every 6 Months':d.setMonth(d.getMonth() + 6); break;
    case 'Yearly':        d.setFullYear(d.getFullYear() + 1); break;
    default: return null;
  }
  return d;
}

// GET /api/timeline or /api/tasks/timeline
router.get('/', async (req, res, next) => {
  // If mounted at /api/timeline or /api/tasks (handling timeline logic)
  if (req.baseUrl === '/api/timeline' || req.query.timeline === 'true') {
    return handleTimeline(req, res, next);
  }
  try {
    const filter = {};
    if (req.query.petId) filter.petId = req.query.petId;
    if (req.query.status) filter.status = req.query.status;
    const tasks = await CareTask.find(filter).populate('petId', 'name species').sort({ dueDate: 1 });
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
});

router.get('/timeline', (req, res, next) => handleTimeline(req, res, next));

async function handleTimeline(req, res, next) {
  try {
    const filter = { status: 'Pending' };
    if (req.query.petId) filter.petId = req.query.petId;
    if (req.query.category) filter.category = req.query.category;

    const tasks = await CareTask.find(filter)
      .populate('petId', 'name species')
      .sort({ dueDate: 1 });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000 - 1);

    const enriched = tasks.map(t => {
      const due = new Date(t.dueDate);
      const daysDelta = Math.round((due - todayStart) / 86400000);
      let timelineStatus;
      if (due < todayStart) timelineStatus = 'OVERDUE';
      else if (due <= todayEnd) timelineStatus = 'DUE_TODAY';
      else timelineStatus = 'UPCOMING';
      return { ...t.toObject(), timelineStatus, daysDelta };
    });

    // Sort: OVERDUE oldest-first, DUE_TODAY as-is, UPCOMING soonest-first
    const overdue  = enriched.filter(t => t.timelineStatus === 'OVERDUE').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const dueToday = enriched.filter(t => t.timelineStatus === 'DUE_TODAY');
    const upcoming = enriched.filter(t => t.timelineStatus === 'UPCOMING').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const sorted = [...overdue, ...dueToday, ...upcoming];

    res.json({
      success: true,
      data: sorted,
      summary: {
        overdueCount:   overdue.length,
        dueTodayCount:  dueToday.length,
        upcomingCount:  upcoming.length,
        total:          sorted.length,
      }
    });
  } catch (err) { next(err); }
}

// POST /api/tasks
router.post('/', validateTask, async (req, res, next) => {
  try {
    const task = new CareTask(req.body);
    await task.save();
    const populated = await CareTask.findById(task._id).populate('petId', 'name species');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
});

// PUT /api/tasks/:id
router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const task = await CareTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('petId', 'name species');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await CareTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
});

// PATCH /api/tasks/:id/complete — mark done, log visit, auto-reschedule
router.patch('/:id/complete', async (req, res, next) => {
  try {
    const task = await CareTask.findById(req.params.id).populate('petId', 'name species vetClinicName');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const now = new Date();
    task.status = 'Completed';
    task.completedAt = now;
    await task.save();

    // Auto-create VisitRecord
    const visitRecord = new VisitRecord({
      petId: task.petId._id,
      visitDate: now,
      title: task.title,
      category: task.category,
      clinicName: task.petId.vetClinicName || '',
      diagnosisAndNotes: [task.dosageOrInstruction, task.notes].filter(Boolean).join(' | ') || 'Task completed via PetCare Planner',
    });
    await visitRecord.save();

    // Auto-reschedule recurring tasks
    let nextTask = null;
    if (task.recurrence && task.recurrence !== 'One-Time') {
      const nextDate = computeNextDate(task.dueDate, task.recurrence);
      if (nextDate) {
        nextTask = new CareTask({
          petId: task.petId._id,
          title: task.title,
          category: task.category,
          dueDate: nextDate,
          recurrence: task.recurrence,
          dosageOrInstruction: task.dosageOrInstruction,
          priority: task.priority,
          notes: task.notes,
          status: 'Pending',
        });
        await nextTask.save();
        await nextTask.populate('petId', 'name species');
      }
    }

    res.json({ success: true, data: { task, visitRecord, nextTask } });
  } catch (err) { next(err); }
});

module.exports = router;
