# 🎓🤝 Campus Collab

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

Campus Collab is a centralized platform designed to bridge the gap between students, enabling them to discover projects, find potential collaborators, and share resources within their academic community.

## 🚀 Features

- **Project Showcasing:** Upload and describe current projects or research.
- **Team Discovery:** Find teammates based on specific skills or project interests.
- **Resource Sharing:** Exchange notes, study materials, and helpful links.
- **User Profiles:** Personalized profiles highlighting skills, interests, and previous collaborations.
- **Interactive Dashboard:** Stay updated with the latest campus projects and announcements.

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS** (for styling)
- **Redux / Context API** (for state management)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** (Database)
- **JWT** (JSON Web Tokens) or Firebase (Authentication)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v14+ recommended)
- `npm` or `yarn`
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/7085ashishraj/Campus-Collab.git
   cd Campus-Collab
   ```

2. **Install dependencies:**
   This project uses a monorepo-style setup. You will need to install dependencies for both the frontend and backend.
   
   *For backend and root dependencies:*
   ```bash
   npm install
   ```
   
   *For frontend dependencies:*
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Environment Variables:**
   Copy `server/.env.example` to `server/.env` and configure the database and two different token secrets:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_REFRESH_SECRET=your_different_refresh_secret_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   Copy `client/.env.example` to `client/.env` for local development. On Vercel, set `VITE_API_URL=https://campus-collab-backend-afs2.onrender.com/api` and redeploy after changing it. On Render, set `CLIENT_URL=https://campus-collab-client.vercel.app`, `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.

   On `*.vercel.app`, REST requests use `/api` on the frontend's own origin. The API rewrite in `client/vercel.json` must stay before the SPA fallback and forward to the Render backend. `VITE_API_URL` still supplies the direct backend URL for chat sockets and file links.

   A sleeping Render service can take about a minute to start. Authentication waits up to 90 seconds and displays a startup notice after 10 seconds. If signup loses its response, try signing in before registering again. Do not automatically retry account creation.

4. **Run the application:**
   To run both the client and server concurrently from the root directory:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

**Steps to contribute:**
1. **Fork** the Project.
2. **Create** your Feature Branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your Changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request.**

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Made with ❤️ by [Ashish Raj](https://github.com/7085ashishraj) & Contributors*
