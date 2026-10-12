# 🌱 EcoCampus

### Building a Greener, Cleaner and More Sustainable Campus

EcoCampus is a campus sustainability web application designed to encourage environmentally responsible habits, make it easier to report campus issues, and promote sustainable practices among students.

The project is being developed as a hackathon project for **KAUSHAL 8.0**.

---

## 📌 Problem Statement

College campuses can face sustainability challenges such as water wastage, unnecessary electricity consumption, poor waste management, and limited student participation in environmental initiatives.

Students need a simple way to learn sustainable practices, track their participation, and report issues that require attention.

## 💡 Our Solution

EcoCampus brings campus sustainability activities together in one place through an accessible web interface.

The application currently focuses on three main areas:

- **Dashboard:** An overview of the application and its available sections.
- **Green Complaint Box:** Submit and track campus sustainability complaints.
- **Sustainable Lab:** Explore sustainability guides and complete green challenges.

## ✨ Features

### 📊 Dashboard
- Access the main sections of EcoCampus.
- Navigate between sustainability features.
- View the information and progress provided by the application.

### 🌿 Green Complaint Box
- Report campus issues related to water, electricity, waste, plastic, and other sustainability concerns.
- Provide a complaint title, category, location, and description.
- View submitted complaints.
- Track complaint status:
  - Open
  - In Progress
  - Resolved
- Save and retrieve complaint data using browser local storage.

### ♻️ Sustainable Lab
- Explore sustainability guide cards.
- Complete green challenges.
- Track challenge progress.
- Retain challenge progress across page reloads using browser storage.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive interface |
| JavaScript | Application logic and interactions |
| Browser Local Storage | Local persistence of application data |
| Git | Version control |
| GitHub | Source code hosting |

## 🚀 Getting Started

Follow these steps to run EcoCampus on your Windows computer.

### Prerequisites

Install or verify the following:

- [Git](https://git-scm.com/downloads)
- [Python](https://www.python.org/downloads/) for the local development server
- A modern web browser, such as Chrome or Edge
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

Check your installations:

```powershell
git --version
python --version
```

### 1. Clone the repository

If you do not already have the project on your computer:

```powershell
git clone https://github.com/harshvermawrk/EcoCampus.git
cd EcoCampus
```

If you already have a local copy, navigate to it instead:

```powershell
cd C:\Users\dell\EcoCampus
```

### 2. Get the latest changes

```powershell
git pull
```

If Git reports conflicts or warns that local changes would be overwritten, resolve that issue before proceeding.

### 3. Start the local server

From the project root, run:

```powershell
python -m http.server 8000
```

If the `python` command is unavailable, try:

```powershell
py -m http.server 8000
```

### 4. Open the application

Visit this address in your browser:

**http://localhost:8000**

Keep the terminal running while you use EcoCampus. Press `Ctrl + C` to stop the server.

> If the browser displays a directory listing instead of the application, locate the correct HTML entry point and open the corresponding page URL.

## 🧪 Testing

Check the JavaScript files for syntax errors:

```powershell
node --check .\js\storage.js
node --check .\js\dashboard.js
node --check .\js\complaints.js
node --check .\js\lab.js
node --check .\js\main.js
```

Check the current Git changes for whitespace errors:

```powershell
git diff --check
```

### Manual Testing Checklist

- [ ] Dashboard loads and navigation works.
- [ ] Green Complaint Box loads correctly.
- [ ] A complaint can be submitted.
- [ ] Submitted complaints appear in the list.
- [ ] Complaint status can be updated.
- [ ] Complaint data remains after a page reload.
- [ ] Sustainable Lab guide cards appear.
- [ ] Green challenge progress updates and persists.
- [ ] All main sections remain accessible.

## 💾 Data Storage and Limitations

EcoCampus currently uses browser `localStorage` for local persistence.

- Data is stored in the browser on the device where the application is used.
- Different devices and browsers do not automatically share complaint records or challenge progress.
- Clearing browser storage can remove locally saved data.
- The current local storage implementation is suitable for a prototype and demonstration, but it is not a shared, production-grade database.

A future version could introduce a backend and shared database to support cross-device synchronization, user accounts, and centralized complaint management.

## 📁 Project Structure

```text
EcoCampus/
├── index.html
├── css/
│   └── ...
├── js/
│   ├── storage.js
│   ├── dashboard.js
│   ├── complaints.js
│   ├── lab.js
│   └── main.js
├── README.md
└── ...
```

This is an overview of the main files. Refer to the repository for the complete and current directory structure.

## 🔄 Git and GitHub Workflow

To download the latest committed changes:

```powershell
git pull
```

After editing files, inspect the changes:

```powershell
git status
git diff
```

Stage only the files you intend to commit:

```powershell
git add README.md
```

Commit your changes:

```powershell
git commit -m "Add EcoCampus project documentation"
```

Push to GitHub:

```powershell
git push
```

Avoid committing passwords, API keys, personal credentials, or unrelated temporary files.

## 🤝 Team Collaboration

For a team working on the same project:

1. Agree on tasks and assign ownership of files or features.
2. Pull the latest changes before beginning work.
3. Make small, focused changes.
4. Test changes before committing.
5. Communicate before modifying the same files.
6. Review and resolve merge conflicts carefully.

## 🔮 Future Improvements

Potential future improvements include:

- Shared backend and database.
- User authentication and role-based access.
- Centralized complaint management.
- Administrative complaint review and resolution.
- More sustainability challenges and educational resources.
- Additional dashboard statistics and impact tracking.
- Online deployment for easy access across devices.

These are proposed improvements, not claims that the features are already implemented.

## 🎯 Project Goal

Our goal is to encourage students to take practical steps toward a greener campus by making sustainability awareness, participation, and issue reporting easier.

**Let's build a cleaner, greener and more responsible campus together!** 🌍

---

## 📄 License

No license has been specified yet. Add a license after deciding how the project should be used, modified, and distributed.

## 🔗 Repository

[EcoCampus on GitHub](https://github.com/harshvermawrk/EcoCampus)