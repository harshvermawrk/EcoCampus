
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