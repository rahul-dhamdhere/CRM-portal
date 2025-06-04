# CRM Portal

A full-stack CRM (Customer Relationship Management) Portal built with React (frontend) and Flask (backend). This portal allows you to manage leads, clients, notifications, and user authentication with a modern, responsive UI.

## Features

- **Authentication:** Login, Signup, and Logout with protected routes.
- **Dashboard:** Overview with profile and analytics charts.
- **Leads Management:** Add, edit, search, filter, and export leads.
- **Clients Management:** Add, edit, search, filter, and export clients.
- **Notifications:** Real-time notification panel for system events.
- **Profile Settings:** Update user profile and preferences.
- **Responsive Design:** Optimized for desktop and mobile screens.

## Tech Stack

- **Frontend:** React, React Router, Chart.js, Axios, CSS Modules
- **Backend:** Flask, SQLite (for authentication and data storage)
- **Other:** Vite (for fast React development)

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.x

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/CRM-portal.git
cd CRM-portal
```

#### 2. Install frontend dependencies

```sh
npm install
```

#### 3. Setup and run the backend

- Go to the backend directory (create if not present):

```sh
cd backend
```

- Create a file named `auth_backend.py` (see project for sample code).
- Install Flask and CORS:

```sh
pip install flask flask-cors
```

- Run the backend server:

```sh
python auth_backend.py
```

#### 4. Run the frontend

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

## Usage

- **Login:** Start at `/auth` to log in or sign up.
- **Dashboard:** After login, view your dashboard and analytics.
- **Leads/Clients:** Use the sidebar to manage leads and clients.
- **Notifications:** Click the bell icon in the top nav for notifications.
- **Profile:** Access and update your profile from the top-right menu.

## Project Structure

```
src/
  ├── App.jsx
  ├── Auth.jsx, Login.jsx, Signup.jsx
  ├── Dashboard.jsx
  ├── Lead.jsx, AddLeadContact.jsx
  ├── Client.jsx, AddClientContact.jsx
  ├── Settings.jsx
  ├── uppernav.jsx, nav.jsx
  ├── assets/
  └── ...css files
backend/
  └── auth_backend.py
```

## Customization

- Update backend endpoints as needed for your deployment.
- Adjust CSS for branding and theming.

## License

MIT License

---

*This project uses Vite for fast React development. For more info, see:*
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
