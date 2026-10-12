"use strict";

const DEMO_COMPLAINTS = [
  {
    title: "Leaking tap near the washroom",
    category: "water",
    location: "Block B",
    description: "The tap continues leaking when not in use.",
    reporterRole: "student",
    isDemo: true
  },
  {
    title: "Lights left on in an empty lab",
    category: "electricity",
    location: "Lab 2",
    description: "Lights remain on after the lab is empty.",
    reporterRole: "teacher",
    isDemo: true
  },
  {
    title: "Recycling bin overflowing",
    category: "waste",
    location: "Block A",
    description: "The recycling bin needs to be emptied.",
    reporterRole: "student",
    isDemo: true
  }
];

const DEMO_RESOURCES = [
  {
    id: "RES-DEMO-001",
    resource: "water",
    location: "Block A",
    amount: 120,
    unit: "litres",
    recordedAt: "2026-10-10",
    isDemo: true
  },
  {
    id: "RES-DEMO-002",
    resource: "water",
    location: "Block B",
    amount: 95,
    unit: "litres",
    recordedAt: "2026-10-11",
    isDemo: true
  },
  {
    id: "RES-DEMO-003",
    resource: "electricity",
    location: "Lab 2",
    amount: 45,
    unit: "kWh",
    recordedAt: "2026-10-10",
    isDemo: true
  },
  {
    id: "RES-DEMO-004",
    resource: "electricity",
    location: "Block A",
    amount: 38,
    unit: "kWh",
    recordedAt: "2026-10-11",
    isDemo: true
  }
];

function seedDemoData() {
  const data = getAppData();

  // Prevent duplicate demo records.
  if (
    data.complaints.some(item => item.isDemo === true) ||
    data.resources.some(item => item.isDemo === true)
  ) {
    console.log("EcoCampus demo data already exists.");
    return;
  }

  // Add demo complaints.
  DEMO_COMPLAINTS.forEach(complaint => {
    addComplaint(complaint);
  });

  // Add demo resource records.
  DEMO_RESOURCES.forEach(record => {
    addResourceRecord(record);
  });

  // Give the demo complaints different statuses.
  const updatedData = getAppData();
  const demoComplaints = updatedData.complaints.filter(
    item => item.isDemo === true
  );

  if (demoComplaints.length >= 3) {
    updateComplaintStatus(demoComplaints[1].id, "in-progress");
    updateComplaintStatus(demoComplaints[2].id, "resolved");
  }

  console.log("EcoCampus demo data added successfully.");
}

// Run after storage.js has loaded.
if (typeof getAppData === "function") {
  seedDemoData();
}