const STORAGE_KEY = "ecocampus-data-v1";

// Get application data
function getAppData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        return {
            version: 1,
            complaints: [],
            resources: [],
            preferences: {
                role: "student"
            }
        };
    }

    return JSON.parse(savedData);
}

// Save application data
function saveAppData(data) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

// Add a new complaint
function addComplaint(complaint) {
    const data = getAppData();

    const now = new Date().toISOString();

    const newComplaint = {
        id: "CMP-" + Date.now(),
        title: complaint.title,
        category: complaint.category,
        location: complaint.location,
        description: complaint.description,
        reporterRole: complaint.reporterRole || "student",
        status: "open",
        createdAt: now,
        updatedAt: now,
        isDemo: complaint.isDemo === true
    };

    data.complaints.push(newComplaint);

    saveAppData(data);

    return newComplaint;
}

// Update complaint status
function updateComplaintStatus(id, status) {
    const allowedStatuses = [
        "open",
        "in-progress",
        "resolved"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid complaint status");
    }

    const data = getAppData();

    const complaint = data.complaints.find(
        item => item.id === id
    );

    if (!complaint) {
        throw new Error("Complaint not found");
    }

    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();

    saveAppData(data);

    return complaint;
}

// Add resource record
function addResourceRecord(record) {
    const data = getAppData();

    data.resources.push(record);

    saveAppData(data);

    return record;
}
