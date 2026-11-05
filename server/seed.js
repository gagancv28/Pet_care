const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const CareTask = require('./models/CareTask');
const VisitRecord = require('./models/VisitRecord');

const daysAgo = (n) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - n); return d; };
const daysFromNow = (n) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + n); return d; };
const today = () => { const d = new Date(); d.setHours(9,0,0,0); return d; };

async function seedDatabase() {
  const petCount = await Pet.countDocuments();
  if (petCount > 0) {
    console.log('[Seed] Database already has data - skipping seed.');
    return;
  }

  console.log('[Seed] 🌱 Seeding database with sample pets, tasks & visit records...');

  // ── Create Pets ────────────────────────────────────────────────────────────
  const milo = await Pet.create({
    name: 'Milo',
    species: 'Dog',
    breed: 'Golden Retriever',
    ageYears: 3,
    weightKg: 28.4,
    gender: 'Male',
    microchipId: 'MC-985141001234567',
    vetClinicName: 'Greenfield Animal Hospital',
    vetPhone: '+91-98765-43210',
    feedingNotes: {
      morningMeal: 'Royal Canin Medium Adult 180g + 1 tsp Salmon Oil supplement',
      eveningMeal: 'Royal Canin Medium Adult 180g + 1 boiled carrot (treat)',
      portionSizeGrams: 180,
      dietBrand: 'Royal Canin Medium Adult',
      allergiesAndRestrictions: 'Chicken & poultry products - causes skin flare-ups and itching',
    },
    medicalSummary: 'Healthy. Annual hip joint monitoring recommended. Up-to-date on core vaccines. Slight stiffness in left hip noted at last exam.',
  });

  const luna = await Pet.create({
    name: 'Luna',
    species: 'Cat',
    breed: 'Indian Domestic Shorthair',
    ageYears: 2,
    weightKg: 4.2,
    gender: 'Female',
    microchipId: 'MC-985141009876543',
    vetClinicName: 'PawsPure Cat Clinic',
    vetPhone: '+91-91234-56789',
    feedingNotes: {
      morningMeal: 'Whiskas Wet Food Pouch (Ocean Fish) 85g + 1/2 tsp Taurine Paste',
      eveningMeal: 'Whiskas Wet Food Pouch (Tuna in Jelly) 85g + fresh water bowl refill',
      portionSizeGrams: 85,
      dietBrand: 'Whiskas Wet Pouches',
      allergiesAndRestrictions: 'Strict grain-free diet - absolutely no wheat, corn or rice fillers',
    },
    medicalSummary: 'Spayed. Prone to UTI - encourage water intake with wet food. Dental cleaning due. Last spay check: 2 months ago - healed well.',
  });

  const buddy = await Pet.create({
    name: 'Buddy',
    species: 'Dog',
    breed: 'Beagle',
    ageYears: 5,
    weightKg: 11.8,
    gender: 'Male',
    microchipId: 'MC-985141005554321',
    vetClinicName: 'City Paws Veterinary Centre',
    vetPhone: '+91-80000-12345',
    feedingNotes: {
      morningMeal: "Hill's Science Diet Weight Control Kibble 110g (measured accurately)",
      eveningMeal: "Hill's Science Diet Weight Control Kibble 110g + steamed green beans (filler)",
      portionSizeGrams: 110,
      dietBrand: "Hill's Science Diet Adult Perfect Weight",
      allergiesAndRestrictions: 'Strictly NO table scraps, human food or dairy - obesity risk. No rawhide chews.',
    },
    medicalSummary: 'Weight management critical - target 11.2 kg. Recurrent ear infections (otitis externa). Monthly ear checks mandatory. Overall health good.',
  });

  // ── OVERDUE Tasks (always overdue relative to today) ───────────────────────
  await CareTask.insertMany([
    {
      petId: milo._id,
      title: 'Annual Rabies Vaccination',
      category: 'Vaccination',
      dueDate: daysAgo(14),
      recurrence: 'Yearly',
      dosageOrInstruction: 'Rabies 1ml SC - Nobivac Rabies single-dose vial',
      priority: 'High',
      notes: 'Book appointment with Dr. Priya Sharma at Greenfield. Bring vaccination booklet.',
      status: 'Pending',
    },
    {
      petId: luna._id,
      title: 'Deworming - Drontal Cat Tablet',
      category: 'Deworming',
      dueDate: daysAgo(7),
      recurrence: 'Every 6 Months',
      dosageOrInstruction: '1/2 tablet oral - Drontal Cat (praziquantel + pyrantel)',
      priority: 'High',
      notes: 'Administer after meal to avoid nausea. Crush and mix in wet food if needed.',
      status: 'Pending',
    },
    {
      petId: buddy._id,
      title: 'Monthly Ear Cleaning & Infection Check',
      category: 'Grooming',
      dueDate: daysAgo(10),
      recurrence: 'Monthly',
      dosageOrInstruction: 'Epi-Otic Ear Cleaner - 5-8 drops per ear, massage 30 sec, wipe with gauze',
      priority: 'Medium',
      notes: 'Check for redness, brown discharge, or foul odour - refer to vet immediately if found.',
      status: 'Pending',
    },
    {
      petId: milo._id,
      title: 'Flea & Tick Preventative - Frontline Plus',
      category: 'Medication',
      dueDate: daysAgo(5),
      recurrence: 'Monthly',
      dosageOrInstruction: 'Frontline Plus 2.68ml spot-on - Large Dog (20-40kg). Apply between shoulder blades.',
      priority: 'High',
      notes: 'Part fur to reach skin. Do not bathe for 48 hours after application.',
      status: 'Pending',
    },
  ]);

  // ── DUE TODAY Tasks ────────────────────────────────────────────────────────
  await CareTask.insertMany([
    {
      petId: luna._id,
      title: 'Vet Appointment - Dental Assessment',
      category: 'Vet Appointment',
      dueDate: today(),
      recurrence: 'One-Time',
      dosageOrInstruction: 'Bring vaccination card and previous dental records',
      priority: 'High',
      notes: 'PawsPure Cat Clinic - 11:00 AM. Dr. Anjali Mehta. Fasting from midnight.',
      status: 'Pending',
    },
    {
      petId: buddy._id,
      title: 'Weekly Weigh-In & Diet Progress Review',
      category: 'Vet Appointment',
      dueDate: today(),
      recurrence: 'Weekly',
      dosageOrInstruction: 'Weigh on digital scale before breakfast. Log in app. Target: 11.2 kg.',
      priority: 'Medium',
      notes: 'Compare to last week. Adjust portion by +/-10g if trend is wrong.',
      status: 'Pending',
    },
  ]);

  // ── UPCOMING Tasks ─────────────────────────────────────────────────────────
  await CareTask.insertMany([
    {
      petId: milo._id,
      title: 'Annual Wellness Exam + Blood Panel',
      category: 'Vet Appointment',
      dueDate: daysFromNow(5),
      recurrence: 'Yearly',
      dosageOrInstruction: 'Full physical exam + CBC + kidney/liver panel + hip X-ray',
      priority: 'High',
      notes: 'Book morning slot - Dr. Priya Sharma at Greenfield. Fast for 8 hours before blood draw.',
      status: 'Pending',
    },
    {
      petId: luna._id,
      title: 'FVRCP Booster Vaccination',
      category: 'Vaccination',
      dueDate: daysFromNow(10),
      recurrence: 'Yearly',
      dosageOrInstruction: 'FVRCP 0.5ml SC - Felocell 4 (Feline Rhinotracheitis, Calicivirus, Panleukopenia, Chlamydia)',
      priority: 'High',
      notes: 'Must be completed before any travel or boarding. Observe 15 min post-vaccination.',
      status: 'Pending',
    },
    {
      petId: buddy._id,
      title: 'Full Grooming Session - Bath, Brush & Ear Trim',
      category: 'Grooming',
      dueDate: daysFromNow(3),
      recurrence: 'Monthly',
      dosageOrInstruction: 'Oatmeal anti-itch shampoo. Blow-dry on low. Trim ear hair. Clip nails.',
      priority: 'Low',
      notes: 'Pawsome Grooming Studio - 2:00 PM appointment. Mention sensitive ears to groomer.',
      status: 'Pending',
    },
    {
      petId: milo._id,
      title: 'Heartworm Prevention - Heartgard Plus',
      category: 'Medication',
      dueDate: daysFromNow(15),
      recurrence: 'Monthly',
      dosageOrInstruction: 'Heartgard Plus chewable tablet - Large Dog (26-50kg). Give with meal.',
      priority: 'High',
      notes: 'Store in cool dry place. Do not skip - heartworm treatment is costly and painful.',
      status: 'Pending',
    },
    {
      petId: luna._id,
      title: 'Monthly Flea Prevention - Revolution Spot-On',
      category: 'Medication',
      dueDate: daysFromNow(8),
      recurrence: 'Monthly',
      dosageOrInstruction: 'Revolution 45mg spot-on (Cat <7.5kg) - 1 tube. Apply to nape of neck.',
      priority: 'Medium',
      notes: 'Part hair and apply directly to skin. Keep dry for 2 hours. Also protects against ear mites.',
      status: 'Pending',
    },
  ]);

  // ── Historical VisitRecords ────────────────────────────────────────────────
  await VisitRecord.insertMany([
    {
      petId: milo._id,
      visitDate: daysAgo(90),
      title: 'Annual Vaccination (DHPPiL + Leptospirosis)',
      category: 'Vaccination',
      clinicName: 'Greenfield Animal Hospital',
      vetName: 'Dr. Priya Sharma',
      weightRecordedKg: 27.9,
      costInr: 1800,
      diagnosisAndNotes: 'All core vaccines administered. No adverse reactions observed. Slight stiffness in left hip - recommend annual X-ray. Next rabies booster due in 1 year.',
      nextFollowUpDate: daysFromNow(90),
    },
    {
      petId: luna._id,
      visitDate: daysAgo(60),
      title: 'Post-Spay Follow-Up & Health Check',
      category: 'Vet Appointment',
      clinicName: 'PawsPure Cat Clinic',
      vetName: 'Dr. Anjali Mehta',
      weightRecordedKg: 4.0,
      costInr: 1200,
      diagnosisAndNotes: 'Spay incision healed completely. Weight improving well. Recommend dental scaling in 6-8 weeks. No UTI signs currently - continue wet food diet for hydration.',
      nextFollowUpDate: daysFromNow(30),
    },
    {
      petId: buddy._id,
      visitDate: daysAgo(45),
      title: 'Ear Infection (Otitis Externa) Treatment',
      category: 'Medication',
      clinicName: 'City Paws Veterinary Centre',
      vetName: 'Dr. Ramesh Nair',
      weightRecordedKg: 12.1,
      costInr: 2200,
      diagnosisAndNotes: 'Bilateral otitis externa - bacterial origin confirmed by cytology. Prescribed Surolan ear drops 2x daily for 7 days. Ear hair manually plucked. Weight still above target - reinforced diet plan.',
      nextFollowUpDate: daysAgo(31),
    },
    {
      petId: milo._id,
      visitDate: daysAgo(180),
      title: 'Flea & Tick Treatment (Tick Infestation)',
      category: 'Medication',
      clinicName: 'Greenfield Animal Hospital',
      vetName: 'Dr. Priya Sharma',
      weightRecordedKg: 27.5,
      costInr: 950,
      diagnosisAndNotes: 'Light tick infestation found on ears and groin area - 6 ticks manually removed with tick-twist. Frontline Plus applied. Advised to maintain monthly preventative schedule rigorously.',
      nextFollowUpDate: null,
    },
    {
      petId: luna._id,
      visitDate: daysAgo(120),
      title: 'Routine Deworming + Fecal Exam',
      category: 'Deworming',
      clinicName: 'PawsPure Cat Clinic',
      vetName: 'Dr. Anjali Mehta',
      weightRecordedKg: 3.9,
      costInr: 750,
      diagnosisAndNotes: 'Drontal Cat administered. Fecal exam - no intestinal parasites detected. Weight at 3.9kg - slightly low. Increased wet food to 2 full pouches per day. Next deworming in 6 months.',
      nextFollowUpDate: daysFromNow(60),
    },
    {
      petId: buddy._id,
      visitDate: daysAgo(30),
      title: 'Weight Management Progress Check',
      category: 'Vet Appointment',
      clinicName: 'City Paws Veterinary Centre',
      vetName: 'Dr. Ramesh Nair',
      weightRecordedKg: 11.8,
      costInr: 800,
      diagnosisAndNotes: "Weight stable at 11.8kg - 300g lost since last visit (good progress). Diet plan on track. Continue Hill's Weight Control at 220g/day split. No table scraps - strictly enforced. Ears clear at this visit.",
      nextFollowUpDate: daysFromNow(30),
    },
  ]);

  console.log('[Seed] ✅ Seeded: 3 pets (Milo, Luna, Buddy) | 4 overdue + 2 due today + 5 upcoming tasks | 6 visit records');
}

module.exports = seedDatabase;
