# Smart Archives Platform (智慧档案平台)

[English](#english) | [中文](#chinese)

<a name="english"></a>

## 🇬🇧 English Introduction

This is the monorepo for the Smart Archives Platform, a comprehensive system including a mobile web application for users, an admin panel for content management, and a robust backend service.

### 📁 Project Structure

The project is organized as a monorepo with the following structure:

```
archives-platform/
├── projects/
│   ├── backend/          # NestJS Backend API Service
│   ├── frontend-admin/   # Vue 3 + Vite Admin Control Panel
│   └── frontend-mobile/  # Vue 3 + Vite Mobile Web Application
├── database/             # Database initialization scripts and schemas
├── .trae/documents/      # Product Requirements & Technical Documentation
└── README.md             # Project documentation
```

### 🚀 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework), TypeScript
- **Admin Frontend**: [Vue 3](https://vuejs.org/), Vite, Element Plus
- **Mobile Frontend**: [Vue 3](https://vuejs.org/), Vite, Vant UI
- **Database**: MySQL 8.0
- **Cache**: Redis (Optional)

### 🛠️ Prerequisites

- Node.js (v16 or higher recommended)
- npm or pnpm
- MySQL 8.0
- Git

### 📦 Installation & Setup

#### 1. Database Setup

1. Create a MySQL database named `archives_db`.
2. Run the initialization script located in `database/schema.sql` to set up tables.

#### 2. Backend Service

```bash
cd projects/backend
npm install
# Configure your .env file
npm run start:dev
```

The backend server will typically start on `http://localhost:3000`.

#### 3. Admin Frontend

```bash
cd projects/frontend-admin
npm install
npm run dev
```

The admin panel will be accessible at the URL provided by Vite (e.g., `http://localhost:5173`).

#### 4. Mobile Frontend

```bash
cd projects/frontend-mobile
npm install
npm run dev
```

The mobile app will be accessible at the URL provided by Vite.

### ✨ Key Features

- **User System**: Registration, login, and profile management.
- **Exhibitions**: Virtual VR exhibitions and physical exhibition information.
- **Courses**: Online learning (videos) and offline course booking.
- **Archives**: Archive retrieval and digital copy viewing.
- **Appointments**: Booking system for exhibitions, courses, and archive visits.
- **Admin Panel**: Content management system (CMS) for all the above.

### 📝 Recent Updates

- 2026-01-20
  - Added comprehensive Chinese comments across mobile API modules
  - Annotated backend controllers and services for maintainability
  - Updated README with latest development notes

---

<a name="chinese"></a>

## 🇨🇳 中文介绍

这是一个智慧档案平台的 Monorepo 仓库，包含面向用户的移动端 Web 应用、用于内容管理的后台管理系统以及强大的后端服务。

### � 项目结构

本项目采用 Monorepo 结构进行管理：

```
archives-platform/
├── projects/
│   ├── backend/          # NestJS 后端 API 服务
│   ├── frontend-admin/   # Vue 3 + Vite 管理后台
│   └── frontend-mobile/  # Vue 3 + Vite 移动端应用
├── database/             # 数据库初始化脚本和 Schema
├── .trae/documents/      # 产品需求与技术文档
└── README.md             # 项目文档
```

### 🚀 技术栈

- **后端**: [NestJS](https://nestjs.com/) (Node.js 框架), TypeScript
- **管理后台**: [Vue 3](https://vuejs.org/), Vite, Element Plus
- **移动端**: [Vue 3](https://vuejs.org/), Vite, Vant UI
- **数据库**: MySQL 8.0
- **缓存**: Redis (可选)

### 🛠️ 环境要求

- Node.js (建议 v16 或更高版本)
- npm 或 pnpm
- MySQL 8.0
- Git

### 📦 安装与启动

#### 1. 数据库设置

1. 创建一个名为 `archives_db` 的 MySQL 数据库。
2. 运行 `database/schema.sql` 中的初始化脚本以创建数据表。

#### 2. 后端服务

```bash
cd projects/backend
npm install
# 配置 .env 文件
npm run start:dev
```

后端服务通常会在 `http://localhost:3000` 启动。

#### 3. 管理后台

```bash
cd projects/frontend-admin
npm install
npm run dev
```

管理后台可以通过 Vite 提供的 URL 访问（例如 `http://localhost:5173`）。

#### 4. 移动端应用

```bash
cd projects/frontend-mobile
npm install
npm run dev
```

移动端应用可以通过 Vite 提供的 URL 访问。

### ✨ 核心功能

- **用户系统**: 注册、登录和个人资料管理。
- **展览**: 虚拟 VR 展览和线下展览资讯。
- **课程**: 在线学习（视频）和线下课程预约。
- **档案**: 档案检索和电子件阅览。
- **预约**: 展览、课程和查档的预约系统。
- **管理后台**: 用于管理上述所有内容的内容管理系统 (CMS)。

### 📝 最近更新

- 2026-01-20
  - 为移动端 API 模块补充中文注释，说明字段与接口用途
  - 为后端控制器与服务补充中文注释，提升可维护性
  - 更新 README，补充最新开发说明

### 📖 文档

详细文档可在 `.trae/documents/` 目录下找到：
- `archives-tech-spec.md`: 技术架构说明书
- `archives-db-design.md`: 数据库设计文档
- `archives-prd.md`: 产品需求文档

### 📄 许可证

本项目为专有软件。
