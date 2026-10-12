
<<<<<<< HEAD
function createComplaint(formValues) {
  const title = formValues.title.trim();
  const category = formValues.category;
  const location = formValues.location.trim();
  const description = formValues.description.trim();

  // Check if fields are empty
  if (!title || !category || !location || !description) {
    return {
      success: false,
      message: "Please fill in all fields."
    };
  }

  // Create a new complaint
  const complaint = {
    id: crypto.randomUUID(),
    title: title,
    category: category,
    location: location,
    description: description,
    status: "open",
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    complaint: complaint
  };
}

const testComplaint = createComplaint({
  title: "Water tap leaking",
  category: "water",
  location: "Block A",
  description: "Water is being wasted."
});

console.log(testComplaint);
=======
"use strict";

/**
 * Render the Green Complaint Box and its complaint list.
 */
function renderComplaints() {
  const root = document.getElementById("complaints-root");
  if (!root) return;

  let complaints;

  try {
    const data = getAppData();
    complaints = Array.isArray(data.complaints)
      ? data.complaints
      : [];
  } catch (error) {
    console.error("Could not load complaints:", error);

    root.innerHTML = `
      <section class="panel">
        <h2>Report a Campus Issue</h2>
        <p role="alert">
          Could not load saved complaints. Please refresh the page.
        </p>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="panel">
      <h2>Report a Campus Issue</h2>
      <p>Help make our campus cleaner, greener and more sustainable.</p>

      <form id="complaint-form" class="complaint-form">
        <label for="complaint-title">Complaint title</label>
        <input
          id="complaint-title"
          name="title"
          type="text"
          placeholder="e.g. Leaking tap near the library"
          maxlength="100"
          required
        />

        <label for="complaint-category">Category</label>
        <select id="complaint-category" name="category" required>
          <option value="">Choose a category</option>
          <option value="water">Water wastage</option>
          <option value="electricity">Electricity wastage</option>
          <option value="waste">Waste management</option>
          <option value="plastic">Plastic pollution</option>
          <option value="other">Other sustainability issue</option>
        </select>

        <label for="complaint-location">Campus location</label>
        <input
          id="complaint-location"
          name="location"
          type="text"
          placeholder="e.g. Block B, Room 204"
          maxlength="120"
          required
        />

        <label for="complaint-description">Description</label>
        <textarea
          id="complaint-description"
          name="description"
          placeholder="Describe the issue and what needs attention..."
          maxlength="1000"
          rows="4"
          required
        ></textarea>

        <button type="submit">Submit Complaint</button>
        <p
          id="complaint-message"
          role="status"
          aria-live="polite"
        ></p>
      </form>
    </section>

    <section class="panel">
      <h2>Reported Campus Issues</h2>
      <div id="complaint-list"></div>
    </section>
  `;

  renderComplaintList(complaints);

  const form = document.getElementById("complaint-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const complaint = {
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || ""),
      location: String(formData.get("location") || "").trim(),
      description: String(
        formData.get("description") || ""
      ).trim(),
      reporterRole: "student",
      status: "open",
      isDemo: true
    };

    const allowedCategories = [
      "water",
      "electricity",
      "waste",
      "plastic",
      "other"
    ];

    if (
      !complaint.title ||
      complaint.title.length > 100 ||
      !allowedCategories.includes(complaint.category) ||
      !complaint.location ||
      complaint.location.length > 120 ||
      !complaint.description ||
      complaint.description.length > 1000
    ) {
      showComplaintMessage(
        "Please complete all fields with valid information.",
        true
      );
      return;
    }

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const saved = addComplaint(complaint);

      if (!saved) {
        showComplaintMessage(
          "Could not save the complaint. Please try again.",
          true
        );
        return;
      }

      renderComplaints();

      showComplaintMessage(
        "Complaint submitted successfully!",
        false
      );
    } catch (error) {
      console.error("Could not save complaint:", error);

      showComplaintMessage(
        "Could not save the complaint. Please try again.",
        true
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

/**
 * Render complaints and attach status-change handlers.
 */
function renderComplaintList(complaints) {
  const list = document.getElementById("complaint-list");
  if (!list) return;

  if (!Array.isArray(complaints) || complaints.length === 0) {
    list.innerHTML = "<p>No complaints reported yet.</p>";
    return;
  }

  const allowedStatuses = [
    "open",
    "in-progress",
    "resolved"
  ];

  const statusLabels = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved"
  };

  list.innerHTML = complaints
    .slice()
    .reverse()
    .map(function (complaint) {
      const title = escapeComplaintText(complaint.title);
      const location = escapeComplaintText(complaint.location);
      const description = escapeComplaintText(
        complaint.description
      );
      const category = escapeComplaintText(complaint.category);
      const id = escapeComplaintText(complaint.id);

      const status = allowedStatuses.includes(complaint.status)
        ? complaint.status
        : "open";

      const statusLabel = statusLabels[status];

      return `
        <article class="complaint-card">
          <div class="complaint-card-heading">
            <h3>${title}</h3>
            <span class="status status-${status}">
              ${statusLabel}
            </span>
          </div>

          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p>${description}</p>

          <label for="status-${id}">Update status</label>
          <select
            id="status-${id}"
            class="complaint-status-select"
            data-complaint-id="${id}"
          >
            <option
              value="open"
              ${status === "open" ? "selected" : ""}
            >Open</option>
            <option
              value="in-progress"
              ${status === "in-progress" ? "selected" : ""}
            >In Progress</option>
            <option
              value="resolved"
              ${status === "resolved" ? "selected" : ""}
            >Resolved</option>
          </select>
        </article>
      `;
    })
    .join("");

  list.querySelectorAll(".complaint-status-select").forEach(
    function (select) {
      select.addEventListener("change", function () {
        const complaintId = select.dataset.complaintId;
        const newStatus = select.value;

        if (!allowedStatuses.includes(newStatus)) {
          alert("Please select a valid complaint status.");
          renderComplaints();
          return;
        }

        try {
          const updated = updateComplaintStatus(
            complaintId,
            newStatus
          );

          if (!updated) {
            throw new Error("Complaint status was not updated.");
          }

          renderComplaints();
        } catch (error) {
          console.error(
            "Could not update complaint status:",
            error
          );

          alert(
            "Could not update the complaint status. Please try again."
          );

          renderComplaints();
        }
      });
    }
  );
}

/**
 * Display a success or error message beside the form.
 */
function showComplaintMessage(message, isError) {
  const element = document.getElementById("complaint-message");
  if (!element) return;

  element.textContent = message;
  element.style.color = isError ? "#b42318" : "#18794e";
}

/**
 * Escape untrusted text before inserting it into HTML.
 */
function escapeComplaintText(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (character) {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return replacements[character];
  });
}
>>>>>>> a162d9557bd1b40bd3eabbf6d4b41f61a7d831b9
