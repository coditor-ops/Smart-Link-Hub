# Smart Link Hub (v1)

A premium, "Modern Cyberpunk" Linktree-style application designed for professionals who want to make a statement. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS and Framer Motion for a highly interactive, "alive" feel.

![Smart Link Hub](/path/to/screenshot/if/any.png)

## 🚀 Features

### 🎨 Visuals & UX
- **Cyberpunk Aesthetic**: "Deepest Black" background, Neon Green accents, and matrix rain effects.
- **Glassmorphism**: Premium glass-style cards with hover glow effects.
- **Micro-interactions**: Glitch effects on avatars, smooth scaling animations using Framer Motion.
- **Responsive Design**: Fully responsive layout for mobile and desktop.

### 🛠️ Core Functionality
- **Public Profile**: A personalized page displaying all your links with an animated background.
- **Link Management**:
    -   Add/Edit/Delete links.
    -   **Photo Uploads**: Attach custom images to your links for a visual preview.
    -   **Rules Engine**: Set visibility rules based on **Time**, **Device**, or **Location**.
- **Command Center (Dashboard)**:
    -   Visual traffic stats (Sparklines).
    -   Grid-based layout for managing multiple hubs.
    -   Click analytics tracking.
- **Profile Customization**: Update your avatar directly from the profile page.

## 💻 Tech Stack

-   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide React.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose).
-   **Fonts**: Playfair Display (Headings), Jost (Body), JetBrains Mono (Code/Data).

## 🛠️ Setup & Installation

### Prerequisites
- Node.js installed.
- MongoDB instance (local or Atlas) running.

### 1. Backend Setup
```bash
cd server
npm install
# Create a .env file with your MONGO_URI and PORT
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The client will typically run on `http://localhost:5173` (or 5174 if occupied), and the server on your specified port (default 5000).

## 📂 Project Structure

-   `/client`: React frontend application.
    -   `/src/components`: Reusable UI components (LinkCard, Layout, etc.).
    -   `/src/pages`: Main application pages (PublicProfile, Dashboard, etc.).
-   `/server`: Node.js/Express backend API.
    -   `/src/models`: Mongoose schemas (Hub, Link).
    -   `/src/routes`: API endpoints.

## 🤝 Contributing

This project is currently in v1 status. Feel free to fork and submit PRs for new "modules" or visual themes.

---
*System Online // Smart_Link_Hub_v1*
