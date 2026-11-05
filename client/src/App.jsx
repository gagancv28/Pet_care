import React, { useState, useEffect, useCallback } from 'react';

// ── Clean SVG Icons (Lucide Style, 16px, 1.75 stroke) ────────────────────────
const PetLogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 0-4 4c0 2 2 3 4 5 2-2 4-3 4-5a4 4 0 0 0-4-4Z" />
    <path d="M6 10c-1.5 0-3 1.5-3 3 0 2 2 3 3 4 1-1 2-2 2-4 0-1.5-1-3-2-3Z" />
    <path d="M18 10c1.5 0 3 1.5 3 3 0 2-2 3-3 4-1-1-2-2-2-4 0-1.5 1-3 2-3Z" />
    <path d="M7 21c2-1 4-2 5-2s3 1 5 2c0-3-2-5-5-5s-5 2-5 5Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ── Utility Formatting Helpers ──────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ── Toast Notification System ───────────────────────────────────────────────
let toastId = 0;
let globalAddToast = null;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    globalAddToast = (msg, type = 'success') => {
      const id = ++toastId;
      setToasts(p => [...p, { id, msg, type }]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    };
    return () => { globalAddToast = null; };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? <CheckIcon /> : <AlertIcon />}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

const toast = (msg, type = 'success') => globalAddToast && globalAddToast(msg, type);

// ── API Helpers ─────────────────────────────────────────────────────────────
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const withBase = (path) => `${API_BASE}${path}`;

const api = {
  get:    (path)       => fetch(withBase(path)).then(r => r.json()),
  post:   (path, body) => fetch(withBase(path), { method: 'POST',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  put:    (path, body) => fetch(withBase(path), { method: 'PUT',   headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  patch:  (path, body) => fetch(withBase(path), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  delete: (path)       => fetch(withBase(path), { method: 'DELETE' }).then(r => r.json()),
};

function Spinner({ dark }) {
  return <span className={`spinner${dark ? ' dark' : ''}`} />;
}

// ── Clean Studio Modal ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header-row">
          <h3 className="modal-heading">{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="modal-content-body">{children}</div>
      </div>
    </div>
  );
}

function FieldError({ errors, field }) {
  if (!errors || !errors[field]) return null;
  return <span className="form-error-feedback">{errors[field]}</span>;
}

// ── Modal Form: Pet Profile ─────────────────────────────────────────────────
function PetModalForm({ pet, onSave, onClose }) {
  const blank = {
    name: '', species: 'Dog', breed: '', ageYears: '', weightKg: '',
    gender: 'Male', microchipId: '', vetClinicName: '', vetPhone: '', medicalSummary: '',
    fn_morning: '', fn_evening: '', fn_portion: '', fn_brand: '', fn_allergy: '',
  };

  const flatten = (p) => ({
    name: p.name || '', species: p.species || 'Dog', breed: p.breed || '',
    ageYears: p.ageYears ?? '', weightKg: p.weightKg ?? '',
    gender: p.gender || 'Male', microchipId: p.microchipId || '',
    vetClinicName: p.vetClinicName || '', vetPhone: p.vetPhone || '', medicalSummary: p.medicalSummary || '',
    fn_morning: p.feedingNotes?.morningMeal || '',
    fn_evening: p.feedingNotes?.eveningMeal || '',
    fn_portion: p.feedingNotes?.portionSizeGrams ?? '',
    fn_brand:   p.feedingNotes?.dietBrand || '',
    fn_allergy: p.feedingNotes?.allergiesAndRestrictions || '',
  });

  const [form, setForm] = useState(() => (pet ? flatten(pet) : blank));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed,
      ageYears: form.ageYears === '' ? 0 : Number(form.ageYears),
      weightKg: Number(form.weightKg),
      gender: form.gender,
      microchipId: form.microchipId,
      vetClinicName: form.vetClinicName,
      vetPhone: form.vetPhone,
      medicalSummary: form.medicalSummary,
      feedingNotes: {
        morningMeal: form.fn_morning,
        eveningMeal: form.fn_evening,
        portionSizeGrams: Number(form.fn_portion) || 0,
        dietBrand: form.fn_brand,
        allergiesAndRestrictions: form.fn_allergy,
      },
    };

    try {
      const res = pet?._id ? await api.put(`/api/pets/${pet._id}`, payload) : await api.post('/api/pets', payload);
      if (!res.success) {
        setErrors(res.errors || { _: res.message });
      } else {
        toast(pet?._id ? 'Pet record updated' : 'New pet profile created');
        onSave(res.data);
      }
    } catch {
      setErrors({ _: 'Network error — please check API connection.' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit}>
      {errors._ && <div style={{ color: 'var(--status-overdue)', marginBottom: 12, fontSize: 13 }}>{errors._}</div>}
      <div className="form-grid-2col">
        <div className="form-group-item">
          <label className="form-label-text">Pet Name *</label>
          <input className={`form-input-control ${errors.name ? 'has-error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Milo" />
          <FieldError errors={errors} field="name" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Species</label>
          <select className="form-input-control" value={form.species} onChange={e => set('species', e.target.value)}>
            {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Breed</label>
          <input className="form-input-control" value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="e.g. Golden Retriever" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Gender</label>
          <select className="form-input-control" value={form.gender} onChange={e => set('gender', e.target.value)}>
            {['Male', 'Female', 'Unknown'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Age (Years)</label>
          <input className={`form-input-control ${errors.ageYears ? 'has-error' : ''}`} type="number" min="0" value={form.ageYears} onChange={e => set('ageYears', e.target.value)} placeholder="3" />
          <FieldError errors={errors} field="ageYears" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Weight (kg) *</label>
          <input className={`form-input-control ${errors.weightKg ? 'has-error' : ''}`} type="number" min="0.1" step="0.1" value={form.weightKg} onChange={e => set('weightKg', e.target.value)} placeholder="28.4" />
          <FieldError errors={errors} field="weightKg" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Microchip ID</label>
          <input className="form-input-control" style={{ fontFamily: 'var(--font-mono)' }} value={form.microchipId} onChange={e => set('microchipId', e.target.value)} placeholder="MC-985141001234567" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Primary Vet Clinic</label>
          <input className="form-input-control" value={form.vetClinicName} onChange={e => set('vetClinicName', e.target.value)} placeholder="Greenfield Animal Hospital" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Vet Phone Contact</label>
          <input className="form-input-control" style={{ fontFamily: 'var(--font-mono)' }} value={form.vetPhone} onChange={e => set('vetPhone', e.target.value)} placeholder="+91-98765-43210" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Morning Meal Routine</label>
          <input className="form-input-control" value={form.fn_morning} onChange={e => set('fn_morning', e.target.value)} placeholder="Royal Canin 180g + Salmon Oil" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Evening Meal Routine</label>
          <input className="form-input-control" value={form.fn_evening} onChange={e => set('fn_evening', e.target.value)} placeholder="Royal Canin 180g + boiled vegetables" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Portion Size (grams)</label>
          <input className="form-input-control" type="number" min="0" value={form.fn_portion} onChange={e => set('fn_portion', e.target.value)} placeholder="180" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Diet / Kibble Brand</label>
          <input className="form-input-control" value={form.fn_brand} onChange={e => set('fn_brand', e.target.value)} placeholder="Royal Canin Medium Adult" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Allergies & Dietary Restrictions</label>
          <input className="form-input-control" value={form.fn_allergy} onChange={e => set('fn_allergy', e.target.value)} placeholder="e.g. Chicken & poultry - causes skin flare-ups" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Medical Notes & History</label>
          <textarea className="form-input-control form-textarea-control" rows={2} value={form.medicalSummary} onChange={e => set('medicalSummary', e.target.value)} placeholder="Healthy. Annual hip joint monitoring recommended..." />
        </div>
      </div>
      <div className="modal-footer-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <><Spinner /> Saving...</> : pet?._id ? 'Save Changes' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}

// ── Modal Form: Care Task ───────────────────────────────────────────────────
function TaskModalForm({ pets, prefillPetId, onSave, onClose }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    petId: prefillPetId || pets[0]?._id || '',
    title: '', category: 'Vaccination', dueDate: todayStr,
    recurrence: 'One-Time', dosageOrInstruction: '', priority: 'High', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await api.post('/api/tasks', form);
      if (!res.success) {
        setErrors(res.errors || { _: res.message });
      } else {
        toast('Care task scheduled');
        onSave();
      }
    } catch {
      setErrors({ _: 'Network error — please check API connection.' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit}>
      {errors._ && <div style={{ color: 'var(--status-overdue)', marginBottom: 12, fontSize: 13 }}>{errors._}</div>}
      <div className="form-grid-2col">
        <div className="form-group-item full-width">
          <label className="form-label-text">Pet *</label>
          <select className={`form-input-control ${errors.petId ? 'has-error' : ''}`} value={form.petId} onChange={e => set('petId', e.target.value)}>
            {pets.map(p => <option key={p._id} value={p._id}>{p.name} ({p.breed || p.species})</option>)}
          </select>
          <FieldError errors={errors} field="petId" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Task Title *</label>
          <input className={`form-input-control ${errors.title ? 'has-error' : ''}`} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Annual Rabies Vaccination" />
          <FieldError errors={errors} field="title" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Category</label>
          <select className="form-input-control" value={form.category} onChange={e => set('category', e.target.value)}>
            {['Vaccination', 'Feeding', 'Medication', 'Grooming', 'Deworming', 'Vet Appointment'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Due Date *</label>
          <input className={`form-input-control ${errors.dueDate ? 'has-error' : ''}`} type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          <FieldError errors={errors} field="dueDate" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Recurrence</label>
          <select className="form-input-control" value={form.recurrence} onChange={e => set('recurrence', e.target.value)}>
            {['One-Time', 'Daily', 'Weekly', 'Monthly', 'Every 6 Months', 'Yearly'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Priority</label>
          <select className="form-input-control" value={form.priority} onChange={e => set('priority', e.target.value)}>
            {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Dosage / Instruction</label>
          <input className="form-input-control" style={{ fontFamily: 'var(--font-mono)' }} value={form.dosageOrInstruction} onChange={e => set('dosageOrInstruction', e.target.value)} placeholder="e.g. Rabies 1ml SC - Nobivac Rabies single-dose vial" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Notes</label>
          <textarea className="form-input-control form-textarea-control" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Book morning appointment with Dr. Sharma." />
        </div>
      </div>
      <div className="modal-footer-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <><Spinner /> Scheduling...</> : 'Schedule Care Task'}
        </button>
      </div>
    </form>
  );
}

// ── Modal Form: Vet Visit ───────────────────────────────────────────────────
function VisitModalForm({ pets, prefillPetId, onSave, onClose }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    petId: prefillPetId || pets[0]?._id || '',
    visitDate: todayStr, title: '', category: 'Vet Appointment', clinicName: '',
    vetName: '', weightRecordedKg: '', costInr: '', diagnosisAndNotes: '', nextFollowUpDate: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = {
      ...form,
      weightRecordedKg: form.weightRecordedKg === '' ? null : Number(form.weightRecordedKg),
      costInr: form.costInr === '' ? 0 : Number(form.costInr),
      nextFollowUpDate: form.nextFollowUpDate || null,
    };

    try {
      const res = await api.post('/api/visits', payload);
      if (!res.success) {
        setErrors(res.errors || { _: res.message });
      } else {
        toast('Veterinary visit logged');
        onSave();
      }
    } catch {
      setErrors({ _: 'Network error — please check API connection.' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit}>
      {errors._ && <div style={{ color: 'var(--status-overdue)', marginBottom: 12, fontSize: 13 }}>{errors._}</div>}
      <div className="form-grid-2col">
        <div className="form-group-item full-width">
          <label className="form-label-text">Pet *</label>
          <select className={`form-input-control ${errors.petId ? 'has-error' : ''}`} value={form.petId} onChange={e => set('petId', e.target.value)}>
            {pets.map(p => <option key={p._id} value={p._id}>{p.name} ({p.breed || p.species})</option>)}
          </select>
          <FieldError errors={errors} field="petId" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Procedure / Reason for Visit *</label>
          <input className={`form-input-control ${errors.title ? 'has-error' : ''}`} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Annual Comprehensive Wellness Exam" />
          <FieldError errors={errors} field="title" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Date of Visit *</label>
          <input className={`form-input-control ${errors.visitDate ? 'has-error' : ''}`} type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} />
          <FieldError errors={errors} field="visitDate" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Category</label>
          <input className="form-input-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Vaccination / Checkup" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Clinic Name</label>
          <input className="form-input-control" value={form.clinicName} onChange={e => set('clinicName', e.target.value)} placeholder="Greenfield Animal Hospital" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Attending Veterinarian</label>
          <input className="form-input-control" value={form.vetName} onChange={e => set('vetName', e.target.value)} placeholder="Dr. Priya Sharma" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Recorded Weight (kg)</label>
          <input className={`form-input-control ${errors.weightRecordedKg ? 'has-error' : ''}`} type="number" min="0.1" step="0.1" value={form.weightRecordedKg} onChange={e => set('weightRecordedKg', e.target.value)} placeholder="28.4" />
          <FieldError errors={errors} field="weightRecordedKg" />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Cost (INR ₹)</label>
          <input className={`form-input-control ${errors.costInr ? 'has-error' : ''}`} type="number" min="0" step="1" value={form.costInr} onChange={e => set('costInr', e.target.value)} placeholder="1800" />
          <FieldError errors={errors} field="costInr" />
        </div>
        <div className="form-group-item full-width">
          <label className="form-label-text">Clinical Notes & Diagnosis</label>
          <textarea className="form-input-control form-textarea-control" rows={3} value={form.diagnosisAndNotes} onChange={e => set('diagnosisAndNotes', e.target.value)} placeholder="Clinical findings, observations, treatment..." />
        </div>
        <div className="form-group-item">
          <label className="form-label-text">Next Follow-Up Date</label>
          <input className="form-input-control" type="date" value={form.nextFollowUpDate} onChange={e => set('nextFollowUpDate', e.target.value)} />
        </div>
      </div>
      <div className="modal-footer-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <><Spinner /> Logging...</> : 'Log Visit Record'}
        </button>
      </div>
    </form>
  );
}

// ── Left Column: Pet Profile & Feeding Journal ──────────────────────────────
function LeftProfileColumn({ pet, onEditPet, onFeedingUpdated, onDeletePet }) {
  const [editingDiet, setEditingDiet] = useState(false);
  const [dietForm, setDietForm] = useState({});
  const [savingDiet, setSavingDiet] = useState(false);

  const fn = pet?.feedingNotes || {};

  const openDietEdit = () => {
    setDietForm({
      morningMeal: fn.morningMeal || '',
      eveningMeal: fn.eveningMeal || '',
      portionSizeGrams: fn.portionSizeGrams ?? '',
      dietBrand: fn.dietBrand || '',
      allergiesAndRestrictions: fn.allergiesAndRestrictions || '',
    });
    setEditingDiet(true);
  };

  const saveDiet = async () => {
    setSavingDiet(true);
    try {
      const payload = {
        ...pet,
        feedingNotes: {
          ...fn,
          morningMeal: dietForm.morningMeal,
          eveningMeal: dietForm.eveningMeal,
          portionSizeGrams: Number(dietForm.portionSizeGrams) || 0,
          dietBrand: dietForm.dietBrand,
          allergiesAndRestrictions: dietForm.allergiesAndRestrictions,
        },
      };
      const res = await api.put(`/api/pets/${pet._id}`, payload);
      if (res.success) {
        onFeedingUpdated(res.data);
        setEditingDiet(false);
        toast('Feeding routine updated');
      } else {
        toast('Failed to save feeding routine', 'error');
      }
    } catch {
      toast('Network error saving feeding routine', 'error');
    }
    setSavingDiet(false);
  };

  if (!pet) return null;

  const initials = pet.name ? pet.name.slice(0, 2).toUpperCase() : 'PT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. Pet Profile Card ── */}
      <div className="panel-card">
        <div className="pet-profile-top">
          <div className="pet-avatar-identity">
            <div className="pet-initials-avatar">{initials}</div>
            <div>
              <h2 className="pet-profile-name">{pet.name}</h2>
              <p className="pet-profile-sub">{pet.breed || 'Companion'} • {pet.species}</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onEditPet}>
            <EditIcon /> Edit
          </button>
        </div>

        {/* 2x2 Clean Vitals Grid */}
        <div className="vitals-grid">
          <div className="vital-box">
            <div className="vital-label">Age</div>
            <div className="vital-value text-mono">{pet.ageYears} {pet.ageYears === 1 ? 'year' : 'years'}</div>
          </div>
          <div className="vital-box">
            <div className="vital-label">Weight</div>
            <div className="vital-value text-mono">{pet.weightKg} kg</div>
          </div>
          <div className="vital-box">
            <div className="vital-label">Microchip ID</div>
            <div className="vital-value text-mono" style={{ fontSize: 12 }}>{pet.microchipId || 'None'}</div>
          </div>
          <div className="vital-box">
            <div className="vital-label">Gender</div>
            <div className="vital-value">{pet.gender || 'Unknown'}</div>
          </div>
        </div>

        {/* Primary Vet Clinic Block */}
        <div className="vet-clinic-box">
          <div className="vital-label">Primary Vet Clinic</div>
          <div className="vet-clinic-name">{pet.vetClinicName || 'No clinic listed'}</div>
          {pet.vetPhone && <div className="vet-clinic-phone">{pet.vetPhone}</div>}
        </div>

        {/* Medical Summary */}
        {pet.medicalSummary && (
          <div className="medical-summary-box">
            <div className="medical-summary-title">Medical History & Notes</div>
            <div>{pet.medicalSummary}</div>
          </div>
        )}
      </div>

      {/* ── 2. Feeding Routine & Dietary Notes Card ── */}
      <div className="panel-card feeding-panel">
        <div className="panel-card-header">
          <h3 className="panel-card-title">Feeding & Dietary Routine</h3>
          {!editingDiet && (
            <button className="btn btn-secondary btn-sm" onClick={openDietEdit}>
              <EditIcon /> Edit
            </button>
          )}
        </div>

        <div className="panel-card-body">
          {editingDiet ? (
            <div>
              <div className="form-group-item" style={{ marginBottom: 10 }}>
                <label className="form-label-text">Morning Meal</label>
                <input
                  className="form-input-control"
                  value={dietForm.morningMeal}
                  onChange={e => setDietForm(p => ({ ...p, morningMeal: e.target.value }))}
                  placeholder="Royal Canin 180g + Salmon Oil"
                />
              </div>
              <div className="form-group-item" style={{ marginBottom: 10 }}>
                <label className="form-label-text">Evening Meal</label>
                <input
                  className="form-input-control"
                  value={dietForm.eveningMeal}
                  onChange={e => setDietForm(p => ({ ...p, eveningMeal: e.target.value }))}
                  placeholder="Royal Canin 180g + boiled vegetables"
                />
              </div>
              <div className="form-grid-2col" style={{ marginBottom: 10 }}>
                <div className="form-group-item">
                  <label className="form-label-text">Portion Size (g)</label>
                  <input
                    className="form-input-control"
                    type="number"
                    min="0"
                    value={dietForm.portionSizeGrams}
                    onChange={e => setDietForm(p => ({ ...p, portionSizeGrams: e.target.value }))}
                  />
                </div>
                <div className="form-group-item">
                  <label className="form-label-text">Food Brand</label>
                  <input
                    className="form-input-control"
                    value={dietForm.dietBrand}
                    onChange={e => setDietForm(p => ({ ...p, dietBrand: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group-item" style={{ marginBottom: 14 }}>
                <label className="form-label-text">Allergies & Restrictions</label>
                <textarea
                  className="form-input-control form-textarea-control"
                  rows={2}
                  value={dietForm.allergiesAndRestrictions}
                  onChange={e => setDietForm(p => ({ ...p, allergiesAndRestrictions: e.target.value }))}
                  placeholder="Strictly NO poultry or table scraps"
                />
              </div>
              <div className="inline-edit-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setEditingDiet(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={saveDiet} disabled={savingDiet}>
                  {savingDiet ? <Spinner /> : 'Save Routine'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="diet-row-item">
                <span className="diet-row-label">Morning Meal</span>
                <span className="diet-row-content">{fn.morningMeal || 'Not specified'}</span>
              </div>
              <div className="diet-row-item">
                <span className="diet-row-label">Evening Meal</span>
                <span className="diet-row-content">{fn.eveningMeal || 'Not specified'}</span>
              </div>
              <div className="diet-row-item">
                <span className="diet-row-label">Portion Size</span>
                <span className="diet-row-content" style={{ fontFamily: 'var(--font-mono)' }}>
                  {fn.portionSizeGrams ? `${fn.portionSizeGrams}g per serving` : 'Not specified'}
                </span>
              </div>
              <div className="diet-row-item">
                <span className="diet-row-label">Food Brand</span>
                <span className="diet-row-content">{fn.dietBrand || 'Not specified'}</span>
              </div>

              {/* Red Alert Box for Allergies & Restrictions */}
              {fn.allergiesAndRestrictions && (
                <div className="allergy-alert-box">
                  <span className="allergy-alert-icon"><AlertIcon /></span>
                  <div>
                    <div className="allergy-alert-title">Allergies & Dietary Restrictions</div>
                    <div className="allergy-alert-text">{fn.allergiesAndRestrictions}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
            <button
              className="btn btn-danger btn-sm"
              style={{ width: '100%' }}
              onClick={() => onDeletePet(pet)}
            >
              Delete {pet.name}'s Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Right Column: Timeline & Visit History Table ────────────────────────────
function RightTimelineColumn({
  timeline,
  summary,
  visits,
  loadingTimeline,
  loadingVisits,
  onCompleteTask,
  onDeleteTask,
  onDeleteVisit,
  onOpenTask,
  onOpenVisit,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING'
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Vaccination', 'Medication', 'Deworming', 'Vet Appointment', 'Grooming', 'Feeding'];

  const filteredTasks = timeline.filter(t => {
    const statusMatch =
      statusFilter === 'ALL' ||
      (statusFilter === 'OVERDUE' && t.timelineStatus === 'OVERDUE') ||
      (statusFilter === 'DUE_TODAY' && t.timelineStatus === 'DUE_TODAY') ||
      (statusFilter === 'UPCOMING' && t.timelineStatus === 'UPCOMING');

    const catMatch = categoryFilter === 'All' || t.category === categoryFilter;
    return statusMatch && catMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── 1. Unified Care Timeline Section ── */}
      <div className="panel-card">
        {/* Underlined Tab Bar with Category Select Dropdown on Right */}
        <div className="timeline-section-header">
          <div className="underlined-tabs">
            <button
              className={`underlined-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Tasks
              <span className="tab-badge">{summary.total ?? timeline.length}</span>
            </button>
            <button
              className={`underlined-tab ${statusFilter === 'OVERDUE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('OVERDUE')}
            >
              Overdue
              <span className="tab-badge" style={{ color: 'var(--status-overdue)', background: 'var(--status-overdue-bg)' }}>
                {summary.overdueCount ?? 0}
              </span>
            </button>
            <button
              className={`underlined-tab ${statusFilter === 'DUE_TODAY' ? 'active' : ''}`}
              onClick={() => setStatusFilter('DUE_TODAY')}
            >
              Due Today
              <span className="tab-badge" style={{ color: 'var(--status-today)', background: 'var(--status-today-bg)' }}>
                {summary.dueTodayCount ?? 0}
              </span>
            </button>
            <button
              className={`underlined-tab ${statusFilter === 'UPCOMING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('UPCOMING')}
            >
              Upcoming
              <span className="tab-badge" style={{ color: 'var(--status-upcoming)', background: 'var(--status-upcoming-bg)' }}>
                {summary.upcomingCount ?? 0}
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              className="category-filter-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Continuous Vertical Timeline Stream */}
        <div className="timeline-list">
          {loadingTimeline ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading care timeline...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="clean-empty-state">
              <span style={{ color: 'var(--text-muted)' }}><CheckIcon /></span>
              <div className="empty-state-title">No pending care tasks</div>
              <div className="empty-state-subtitle">All scheduled routines match current filters or are up to date.</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={onOpenTask}>
                <PlusIcon /> Schedule New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task, idx) => (
              <TimelineCardItem
                key={task._id}
                task={task}
                isLast={idx === filteredTasks.length - 1}
                onComplete={() => onCompleteTask(task._id)}
                onDelete={() => onDeleteTask(task._id, task.title)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── 2. Veterinary & Care Visit History Data Table ── */}
      <div className="panel-card visit-history-panel">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">
              Veterinary & Care Visit History
              <span className="tab-badge" style={{ marginLeft: 6 }}>{visits.length}</span>
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenVisit}>
            <PlusIcon /> Log Vet Visit
          </button>
        </div>

        <div className="table-responsive-wrapper">
          {loadingVisits ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading visit history...
            </div>
          ) : visits.length === 0 ? (
            <div className="clean-empty-state">
              <span style={{ color: 'var(--text-muted)' }}><FileTextIcon /></span>
              <div className="empty-state-title">No clinical records found</div>
              <div className="empty-state-subtitle">Complete care tasks or record clinic visits to build the medical log.</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pet</th>
                  <th>Procedure / Visit Reason</th>
                  <th>Clinic & Vet</th>
                  <th>Weight</th>
                  <th>Cost</th>
                  <th>Clinical Notes</th>
                  <th>Follow-Up</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visits.map(v => (
                  <tr key={v._id}>
                    <td className="table-date-cell">{fmtDate(v.visitDate)}</td>
                    <td className="table-patient-cell">{v.petId?.name || 'Pet'}</td>
                    <td>
                      <div className="table-title-cell">{v.title}</div>
                      {v.category && <div className="table-sub-cat">{v.category}</div>}
                    </td>
                    <td className="table-clinic-cell">
                      <div>{v.clinicName || 'Clinic'}</div>
                      {v.vetName && <div className="table-sub-cat">{v.vetName}</div>}
                    </td>
                    <td className="table-numeric-cell">
                      {v.weightRecordedKg ? `${v.weightRecordedKg} kg` : '—'}
                    </td>
                    <td className="table-cost-cell">
                      {v.costInr > 0 ? `₹${v.costInr.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="table-notes-cell" title={v.diagnosisAndNotes}>
                      {v.diagnosisAndNotes || '—'}
                    </td>
                    <td className="table-date-cell">
                      {v.nextFollowUpDate ? fmtDate(v.nextFollowUpDate) : '—'}
                    </td>
                    <td>
                      <button
                        className="btn-icon danger"
                        onClick={() => onDeleteVisit(v._id, v.title)}
                        title="Delete visit record"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single Timeline Card (Clean 2-Column Layout, 4px Left Border) ───────────
function TimelineCardItem({ task, isLast, onComplete, onDelete }) {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStatusBadge = () => {
    if (task.timelineStatus === 'OVERDUE') {
      const days = Math.abs(task.daysDelta);
      return (
        <span className="status-tag OVERDUE">
          {days === 0 ? 'Overdue today' : `${days} ${days === 1 ? 'day' : 'days'} overdue`}
        </span>
      );
    }
    if (task.timelineStatus === 'DUE_TODAY') {
      return <span className="status-tag DUE_TODAY">Due Today</span>;
    }
    const days = Math.abs(task.daysDelta);
    return <span className="status-tag UPCOMING">In {days} {days === 1 ? 'day' : 'days'}</span>;
  };

  const handleComplete = async () => {
    setCompleting(true);
    await onComplete();
    setCompleting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <div className="timeline-row">
      {/* Left Rail Stem & Node */}
      <div className="timeline-rail">
        <div className={`timeline-node ${task.timelineStatus}`} />
        {!isLast && <div className="timeline-stem" />}
      </div>

      {/* Main 2-Column Timeline Card */}
      <div className="timeline-card-wrapper">
        <div className={`clean-timeline-card ${task.timelineStatus}`}>
          {/* Left Side: Title, Instruction Paragraph, Single Meta Line */}
          <div className="timeline-card-left">
            <h4 className="timeline-card-title">{task.title}</h4>

            {task.dosageOrInstruction && (
              <div className="timeline-instruction-text">
                {task.dosageOrInstruction}
              </div>
            )}

            <div className="timeline-meta-line">
              <span>{fmtDate(task.dueDate)}</span>
              <span className="timeline-meta-dot">•</span>
              <span>{task.category}</span>
              <span className="timeline-meta-dot">•</span>
              <span className="timeline-pet-badge">{task.petId?.name || 'Pet'}</span>
              {task.recurrence && task.recurrence !== 'One-Time' && (
                <>
                  <span className="timeline-meta-dot">•</span>
                  <span>Repeats {task.recurrence}</span>
                </>
              )}
              {task.notes && (
                <>
                  <span className="timeline-meta-dot">•</span>
                  <span>Note: {task.notes}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Urgency Status Tag + Mark Complete + Delete Button */}
          <div className="timeline-card-right">
            {getStatusBadge()}
            <div className="timeline-actions-group">
              <button
                className="btn-complete"
                onClick={handleComplete}
                disabled={completing}
              >
                {completing ? <Spinner dark /> : <CheckIcon />} Mark Complete
              </button>
              <button
                className="btn-icon danger"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete task"
              >
                {deleting ? <Spinner dark /> : <TrashIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top Level App Component ─────────────────────────────────────────────────
export default function App() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(''); // Empty initially, set to pets[0]._id on load
  const [timeline, setTimeline] = useState([]);
  const [summary, setSummary] = useState({});
  const [visits, setVisits] = useState([]);

  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);

  // Active Modals: null | 'NEW_PET' | 'EDIT_PET' | 'TASK' | 'VISIT'
  const [activeModal, setActiveModal] = useState(null);

  // Load pets once on startup
  const fetchPets = useCallback(async () => {
    setLoadingPets(true);
    try {
      const res = await api.get('/api/pets');
      if (res.success && res.data.length > 0) {
        setPets(res.data);
        // Default to first pet (Milo) if none is currently selected
        setSelectedPetId(curr => (curr ? curr : res.data[0]._id));
      }
    } catch {
      toast('Failed to load pets', 'error');
    }
    setLoadingPets(false);
  }, []);

  const fetchTimeline = useCallback(async (petId) => {
    setLoadingTimeline(true);
    try {
      const qs = petId && petId !== 'ALL' ? `?petId=${petId}` : '';
      const res = await api.get(`/api/timeline${qs}`);
      if (res.success) {
        setTimeline(res.data);
        setSummary(res.summary || {});
      }
    } catch {
      toast('Failed to load care timeline', 'error');
    }
    setLoadingTimeline(false);
  }, []);

  const fetchVisits = useCallback(async (petId) => {
    setLoadingVisits(true);
    try {
      const qs = petId && petId !== 'ALL' ? `?petId=${petId}` : '';
      const res = await api.get(`/api/visits${qs}`);
      if (res.success) {
        setVisits(res.data);
      }
    } catch {
      toast('Failed to load visit records', 'error');
    }
    setLoadingVisits(false);
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    if (selectedPetId) {
      fetchTimeline(selectedPetId);
      fetchVisits(selectedPetId);
    }
  }, [selectedPetId, fetchTimeline, fetchVisits]);

  // Active pet reference: Always guarantee a full profile on the left column!
  const activePet =
    selectedPetId === 'ALL'
      ? pets[0] || null
      : pets.find(p => p._id === selectedPetId) || pets[0] || null;

  const handleCompleteTask = async (taskId) => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}/complete`, {});
      if (res.success) {
        toast(`Task completed & visit record logged${res.data.nextTask ? ' • Next recurrence scheduled' : ''}`);
        fetchTimeline(selectedPetId);
        fetchVisits(selectedPetId);
      }
    } catch {
      toast('Failed to complete task', 'error');
    }
  };

  const handleDeleteTask = async (taskId, title) => {
    if (!window.confirm(`Delete care task "${title}"?`)) return;
    try {
      const res = await api.delete(`/api/tasks/${taskId}`);
      if (res.success) {
        toast('Care task deleted');
        fetchTimeline(selectedPetId);
      }
    } catch {
      toast('Failed to delete task', 'error');
    }
  };

  const handleDeleteVisit = async (visitId, title) => {
    if (!window.confirm(`Delete clinical record for "${title}"?`)) return;
    try {
      const res = await api.delete(`/api/visits/${visitId}`);
      if (res.success) {
        toast('Visit record deleted');
        fetchVisits(selectedPetId);
      }
    } catch {
      toast('Failed to delete visit record', 'error');
    }
  };

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Are you sure you want to delete ${pet.name}'s profile and all associated records?`)) return;
    try {
      const res = await api.delete(`/api/pets/${pet._id}`);
      if (res.success) {
        toast(`${pet.name}'s profile deleted`);
        fetchPets();
      }
    } catch {
      toast('Failed to delete profile', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* ── 1. Top Bar ── */}
      <header className="top-bar">
        <div className="top-bar-inner">
          {/* Brand Left */}
          <div className="brand-section">
            <div className="brand-logo-mark">
              <PetLogoIcon />
            </div>
            <div>
              <div className="brand-title">PetCare Planner</div>
              <div className="brand-subtitle">Care Schedules & Clinical Records</div>
            </div>
          </div>

          {/* Center: Pet Switcher Segmented Control */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="pet-segmented-control" role="tablist">
              {pets.map(p => (
                <button
                  key={p._id}
                  className={`segmented-tab ${selectedPetId === p._id ? 'active' : ''}`}
                  onClick={() => setSelectedPetId(p._id)}
                  role="tab"
                  aria-selected={selectedPetId === p._id}
                >
                  {p.name}
                </button>
              ))}
              <button
                className={`segmented-tab ${selectedPetId === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedPetId('ALL')}
                role="tab"
                aria-selected={selectedPetId === 'ALL'}
              >
                All Pets
                <span className="segmented-tab-count">{pets.length}</span>
              </button>
            </div>
            <button className="btn-add-pet-segment" onClick={() => setActiveModal('NEW_PET')}>
              <PlusIcon /> Add Pet
            </button>
          </div>

          {/* Right: Primary Action Buttons */}
          <div className="top-bar-actions">
            <button className="btn btn-primary" onClick={() => setActiveModal('TASK')}>
              <PlusIcon /> New Care Task
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveModal('VISIT')}>
              <PlusIcon /> Log Vet Visit
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Content Wrapper ── */}
      <main className="content-wrapper">
        {/* Top Summary Strip: 4 Clean Metric Cards (NOT pills) */}
        <div className="summary-strip">
          <div className="summary-card overdue">
            <div className="summary-card-header">
              <span className="summary-card-label">Overdue Tasks</span>
              <div className="summary-card-icon"><AlertIcon /></div>
            </div>
            <div className="summary-card-number">{summary.overdueCount ?? 0}</div>
            <div className="summary-card-desc">Requires immediate attention</div>
          </div>

          <div className="summary-card today">
            <div className="summary-card-header">
              <span className="summary-card-label">Due Today</span>
              <div className="summary-card-icon"><ClockIcon /></div>
            </div>
            <div className="summary-card-number">{summary.dueTodayCount ?? 0}</div>
            <div className="summary-card-desc">Scheduled for today</div>
          </div>

          <div className="summary-card upcoming">
            <div className="summary-card-header">
              <span className="summary-card-label">Upcoming (30d)</span>
              <div className="summary-card-icon"><CalendarIcon /></div>
            </div>
            <div className="summary-card-number">{summary.upcomingCount ?? 0}</div>
            <div className="summary-card-desc">Next routine care schedules</div>
          </div>

          <div className="summary-card visits">
            <div className="summary-card-header">
              <span className="summary-card-label">Visit History</span>
              <div className="summary-card-icon"><FileTextIcon /></div>
            </div>
            <div className="summary-card-number">{visits.length}</div>
            <div className="summary-card-desc">Completed vet & care records</div>
          </div>
        </div>

        {/* ── 3. Main Split Workspace (Left 35% / Right 65%) ── */}
        <div className="workspace-grid">
          {/* Left Column (35%): Pet Profile & Feeding Routine */}
          <aside>
            {selectedPetId === 'ALL' && activePet && (
              <div style={{
                background: 'var(--indigo-subtle)',
                border: '1px solid var(--indigo-border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 12.5,
                color: 'var(--indigo-dark)',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <PetLogoIcon />
                <span>Showing <strong>{activePet.name}</strong>'s profile • Timeline shows All Pets</span>
              </div>
            )}

            <LeftProfileColumn
              pet={activePet}
              onEditPet={() => setActiveModal('EDIT_PET')}
              onFeedingUpdated={(updatedPet) => {
                setPets(ps => ps.map(p => p._id === updatedPet._id ? updatedPet : p));
              }}
              onDeletePet={handleDeletePet}
            />
          </aside>

          {/* Right Column (65%): Timeline & Visit History Table */}
          <section>
            <RightTimelineColumn
              timeline={timeline}
              summary={summary}
              visits={visits}
              loadingTimeline={loadingTimeline}
              loadingVisits={loadingVisits}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              onDeleteVisit={handleDeleteVisit}
              onOpenTask={() => setActiveModal('TASK')}
              onOpenVisit={() => setActiveModal('VISIT')}
            />
          </section>
        </div>
      </main>

      {/* ── Modals ── */}
      {activeModal === 'NEW_PET' && (
        <Modal title="Add Pet Profile" onClose={() => setActiveModal(null)}>
          <PetModalForm
            pet={null}
            onSave={(newPet) => {
              setActiveModal(null);
              fetchPets();
              if (newPet?._id) setSelectedPetId(newPet._id);
            }}
            onClose={() => setActiveModal(null)}
          />
        </Modal>
      )}

      {activeModal === 'EDIT_PET' && activePet && (
        <Modal title={`Edit ${activePet.name}'s Profile`} onClose={() => setActiveModal(null)}>
          <PetModalForm
            pet={activePet}
            onSave={(savedPet) => {
              setActiveModal(null);
              setPets(ps => ps.map(p => p._id === savedPet._id ? savedPet : p));
            }}
            onClose={() => setActiveModal(null)}
          />
        </Modal>
      )}

      {activeModal === 'TASK' && (
        <Modal title="Schedule Care Task" onClose={() => setActiveModal(null)}>
          <TaskModalForm
            pets={pets}
            prefillPetId={selectedPetId !== 'ALL' ? selectedPetId : ''}
            onSave={() => {
              setActiveModal(null);
              fetchTimeline(selectedPetId);
            }}
            onClose={() => setActiveModal(null)}
          />
        </Modal>
      )}

      {activeModal === 'VISIT' && (
        <Modal title="Log Veterinary Visit" onClose={() => setActiveModal(null)}>
          <VisitModalForm
            pets={pets}
            prefillPetId={selectedPetId !== 'ALL' ? selectedPetId : ''}
            onSave={() => {
              setActiveModal(null);
              fetchVisits(selectedPetId);
            }}
            onClose={() => setActiveModal(null)}
          />
        </Modal>
      )}

      {/* Feedback Toast Container */}
      <ToastContainer />
    </div>
  );
}
