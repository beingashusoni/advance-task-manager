# 📌 Advanced Task Manager - Ashutosh Soni

A modern **Trello-inspired task management app** built with **React 18, Vite, TailwindCSS **, and **@hello-pangea/dnd**.  
This project is a full-featured **Task/Board Management System** where users can create boards, lists, and tasks with advanced functionality.

---

## 🚀 Features

### 🔑 Core
- **Multiple Boards** – Create & manage multiple boards (projects).
- **Lists (Columns)** – Add, rename, delete lists within boards.
- **Tasks (Cards)** – Add, edit, delete tasks inside lists.
- **Drag & Drop** – Move tasks across lists with smooth drag-and-drop.

### 🎨 Modern UI
- Trello-like modern design with **cards, shadows, gradients, and rounded corners**.
- **Dark Mode toggle** 🌙 for better usability.
- **Clean typography** and professional dashboard layout.

### 🏷️ Task Management
- **Labels** – Assign colored labels (Bug, Feature, Enhancement, Blocked).
- **Due Dates** – Select with integrated calendar (`react-datepicker`).
- **Assignees** – Assign tasks to team members.
- **Search** – Quickly filter tasks by title/description.
- **Activity Feed** – Track recent actions per board.

### 💾 Persistence & Sharing
- **Local Storage Persistence** – Boards and tasks are saved automatically.
- **Export/Import JSON** – Backup your boards to a `.json` file and restore anytime.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Bundler**: [Vite 5](https://vitejs.dev/)
- **Styling**: [TailwindCSS v3](https://tailwindcss.com/) (with dark mode support)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Date Handling**: [react-datepicker](https://reactdatepicker.com/), [date-fns](https://date-fns.org/)

---

## 📂 Project Structure

```
advanced-task-manager-revamp-fixed/
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── context/
│   │   └── BoardsProvider.jsx
│   ├── reducers/
│   │   └── boardsReducer.js
│   ├── utils/
│   │   └── storage.js
│   ├── data/
│   │   ├── labels.js
│   │   └── users.js
│   ├── components/
│   │   ├── ListColumn.jsx
│   │   └── TaskCard.jsx
│   └── routes/
│       ├── Dashboard.jsx
│       └── BoardView.jsx
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repo / extract ZIP
```bash
git clone <your-repo-url>
cd advanced-task-manager
```
or extract the provided `.zip`.

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run development server
```bash
npm run dev
```

Visit 👉 [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧑‍💻 Author
Ashutosh Soni
