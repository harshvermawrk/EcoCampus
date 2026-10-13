"use strict";

const STORAGE_KEY = "ecocampus-data-v1";
const COMPLAINT_CATEGORIES = [
  "water",
  "electricity",
  "waste",
  "plastic",
  "other"
];
const RESOURCE_TYPES = ["water", "electricity"];

function createEmptyAppData() {
  return {
    version: 1,
    complaints: [],
    resources: [],
    preferences: { role: "student" }
  };
}

/** Read and normalize the versioned data saved in this browser. */
function getAppData() {
  let savedData;

  try {
    savedData = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new Error("EcoCampus could not access this browser's storage.");
  }

  if (savedData === null) return createEmptyAppData();

  let parsed;
  try {
    parsed = JSON.parse(savedData);
  } catch (error) {
    throw new Error(
      "Saved EcoCampus data is unreadable. Your browser data was left unchanged."
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Saved EcoCampus data has an invalid format.");
  }

  if (
    (parsed.complaints !== undefined && !Array.isArray(parsed.complaints)) ||
    (parsed.resources !== undefined && !Array.isArray(parsed.resources))
  ) {
    throw new Error("Saved EcoCampus data has an invalid format.");
  }

  const preferences = parsed.preferences &&
    typeof parsed.preferences === "object" &&
    !Array.isArray(parsed.preferences)
    ? parsed.preferences
    : {};

  return {
    ...parsed,
    version: 1,
    complaints: parsed.complaints || [],
    resources: parsed.resources || [],
    preferences: { role: "student", ...preferences }
  };
}

/** Save application data. Storage errors are surfaced to the calling form. */
function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    throw new Error("EcoCampus could not save data in this browser.");
  }
}

function createRecordId(prefix) {
  const randomPart = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}-${randomPart}`;
}

function addComplaint(complaint) {
  const title = String(complaint.title || "").trim();
  const location = String(complaint.location || "").trim();
  const description = String(complaint.description || "").trim();

  if (
    !title || title.length > 100 ||
    !COMPLAINT_CATEGORIES.includes(complaint.category) ||
    !location || location.length > 120 ||
    !description || description.length > 1000
  ) {
    throw new Error("Please enter valid complaint details.");
  }

  const data = getAppData();
  const now = new Date().toISOString();
  const newComplaint = {
    id: createRecordId("CMP"),
    title,
    category: complaint.category,
    location,
    description,
    reporterRole: complaint.reporterRole || "student",
    status: "open",
    createdAt: now,
    updatedAt: now,
    isDemo: true
  };

  data.complaints.push(newComplaint);
  saveAppData(data);
  return newComplaint;
}

function updateComplaintStatus(id, status) {
  const allowedStatuses = ["open", "in-progress", "resolved"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid complaint status.");
  }

  const data = getAppData();
  const complaint = data.complaints.find(item => item && item.id === id);
  if (!complaint) throw new Error("Complaint not found.");

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  saveAppData(data);
  return complaint;
}

function addResourceRecord(record) {
  const type = String(record.type || "");
  const amount = Number(record.amount);
  const date = String(record.date || "");
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date;

  if (
    !RESOURCE_TYPES.includes(type) ||
    !Number.isFinite(amount) || amount <= 0 ||
    !validDate
  ) {
    throw new Error("Please enter a valid resource reading.");
  }

  const data = getAppData();
  const newRecord = {
    id: createRecordId("RES"),
    type,
    amount,
    date,
    createdAt: new Date().toISOString()
  };

  data.resources.push(newRecord);
  saveAppData(data);
  return newRecord;
}
