
function renderComplaints() {
  const root = document.getElementById("complaints-root");
  if (!root) return;

  const data = getAppData();
  const complaints = data.complaints || [];

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
          required maxlength="100"
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
          required maxlength="120"
        />

        <label for="complaint-description">Description</label>
        <textarea
          id="complaint-description"
          name="description"
          placeholder="Describe the issue and what needs attention..."
          required maxlength="1000" rows="4"
        ></textarea>

        <button type="submit">Submit Complaint</button>
        <p id="complaint-message" role="status" aria-live="polite"></p>
      </form>
    </section>

    <section class="panel">
      <h2>Reported Campus Issues</h2>
      <div id="complaint-list"></div>
    </section>
  `;

  renderComplaintList(complaints);

  const form = document.getElementById("complaint-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const complaint = {
      title: String(formData.get("title")).trim(),
      category: String(formData.get("category")),
      location: String(formData.get("location")).trim(),
      description: String(formData.get("description")).trim(),
      status: "open",
      isDemo: true
    };

    if (
      !complaint.title ||
      !complaint.category ||
      !complaint.location ||
      !complaint.description
    ) {
      showComplaintMessage("Please complete all fields.", true);
      return;
    }

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
  });
}

function renderComplaintList(complaints) {
  const list = document.getElementById("complaint-list");
  if (!list) return;

  if (complaints.length === 0) {
    list.innerHTML = "<p>No complaints reported yet.</p>";
    return;
  }

  list.innerHTML = complaints
    .slice()
    .reverse()
    .map(function (complaint) {
      const title = escapeComplaintText(complaint.title);
      const location = escapeComplaintText(complaint.location);
      const description = escapeComplaintText(complaint.description);
      const category = escapeComplaintText(complaint.category);
      const id = escapeComplaintText(complaint.id);
      const status = complaint.status || "open";

      const statusLabel = {
        open: "Open",
        "in-progress": "In Progress",
        resolved: "Resolved"
      }[status] || "Open";

      return `
        <article class="complaint-card">
          <div class="complaint-card-heading">
            <h3>${title}</h3>
            <span class="status status-${status}">${statusLabel}</span>
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
            <option value="open" ${status === "open" ? "selected" : ""}>Open</option>
            <option value="in-progress" ${status === "in-progress" ? "selected" : ""}>In Progress</option>
            <option value="resolved" ${status === "resolved" ? "selected" : ""}>Resolved</option>
          </select>
        </article>
      `;
    })
    .join("");

  list.querySelectorAll(".complaint-status-select").forEach(function (select) {
    select.addEventListener("change", function () {
      const saved = updateComplaintStatus(
        select.dataset.complaintId,
        select.value
      );

      if (saved) {
        renderComplaints();
      } else {
        alert("Could not update the complaint status.");
      }
    });
  });
}

function showComplaintMessage(message, isError) {
  const element = document.getElementById("complaint-message");
  if (!element) return;

  element.textContent = message;
  element.style.color = isError ? "#b42318" : "#18794e";
}

function escapeComplaintText(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}
