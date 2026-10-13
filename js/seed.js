"use strict";

const demoComplaints = [
  {
    title: "Leaking tap near the washroom",
    category: "water",
    location: "Block B",
    description: "The tap continues leaking when it is not in use.",
    reporterRole: "student"
  },
  {
    title: "Lights left on in an empty lab",
    category: "electricity",
    location: "Lab 2",
    description: "Lights remain on after the lab is empty.",
    reporterRole: "teacher"
  },
  {
    title: "Recycling bin overflowing",
    category: "waste",
    location: "Block A",
    description: "The recycling bin needs to be emptied.",
    reporterRole: "student"
  }
];

const demoResourceReadings = [
  { type: "water", amount: 120, daysAgo: 3 },
  { type: "water", amount: 95, daysAgo: 2 },
  { type: "electricity", amount: 45, daysAgo: 3 },
  { type: "electricity", amount: 38, daysAgo: 2 }
];

function seedDemoData() {
  try {
    const data = getAppData();

    // Seed only a completely empty browser so existing entries are untouched.
    if (data.complaints.length > 0 || data.resources.length > 0) return;

    const seededComplaints = demoComplaints.map(addComplaint);
    addResourceReadings();

    updateComplaintStatus(seededComplaints[1].id, "in-progress");
    updateComplaintStatus(seededComplaints[2].id, "resolved");
  } catch (error) {
    console.warn("Could not add EcoCampus demo data.", error);
  }
}

function addResourceReadings() {
  demoResourceReadings.forEach(reading => {
    addResourceRecord({
      type: reading.type,
      amount: reading.amount,
      date: getDemoDate(reading.daysAgo)
    });
  });
}

function getDemoDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

seedDemoData();
