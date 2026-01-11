# Shenzhen Archives Platform (深圳市档案馆平台)

This is the monorepo for the Shenzhen Archives Platform, a comprehensive system including a mobile web application for users, an admin panel for content management, and a robust backend service.

## 📁 Project Structure

The project is organized as a monorepo with the following structure:

```
sz-archives-platform/
├── projects/
│   ├── backend/          # NestJS Backend API Service
│   ├── frontend-admin/   # Vue 3 + Vite Admin Control Panel
│   └── frontend-mobile/  # Vue 3 + Vite Mobile Web Application
├── database/             # Database initialization scripts and schemas
├── .trae/documents/      # Product Requirements & Technical Documentation
└── README.md             # Project documentation
```

## 🚀 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework), TypeScript
- **Admin Frontend**: [Vue 3](https://vuejs.org/), Vite, Element Plus (assumed)
- **Mobile Frontend**: [Vue 3](https://vuejs.org/), Vite, Vant UI (assumed)
- **Database**: MySQL 8.0
- **Cache**: Redis (Optional)

## 🛠️ Prerequisites

- Node.js (v16 or higher recommended)
- npm or pnpm
- MySQL 8.0
- Git

## 📦 Installation & Setup

### 1. Database Setup

1. Create a MySQL database named `sz_archives`.
2. Run the initialization script located in `database/schema.sql` to set up tables.

### 2. Backend Service

```bash
cd projects/backend
npm install
# Configure your .env file based on .env.example (if available)
# Update database connection settings in app.module.ts or configuration files
npm run start:dev
```

The backend server will typically start on `http://localhost:3000`.

### 3. Admin Frontend

```bash
cd projects/frontend-admin
npm install
npm run dev
```

The admin panel will be accessible at the URL provided by Vite (e.g., `http://localhost:5173`).

### 4. Mobile Frontend

```bash
cd projects/frontend-mobile
npm install
npm run dev
```

The mobile app will be accessible at the URL provided by Vite.

## ✨ Key Features

- **User System**: Registration, login, and profile management.
- **Exhibitions**: Virtual VR exhibitions and physical exhibition information.
- **Courses**: Online learning (videos) and offline course booking (party/ideology classes).
- **Archives**: Archive retrieval and digital copy viewing.
- **Appointments**: Booking system for exhibitions, courses, and archive visits.
- **Admin Panel**: Content management system (CMS) for all the above.

## 📖 Documentation

Detailed documentation can be found in the `.trae/documents/` directory:
- `shenzhen-archives-tech-spec.md`: Technical Architecture Specification
- `shenzhen-archives-db-design.md`: Database Design Document

## 📄 License

This project is proprietary software.
