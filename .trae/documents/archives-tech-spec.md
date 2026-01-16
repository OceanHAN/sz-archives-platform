# 深圳市档案馆小程序 - 技术架构说明书

**版本**: 1.3
**日期**: 2026-01-13
**状态**: 重构实施阶段

---

## 1. 架构概览

本项目采用 **Monorepo** 结构管理，包含移动端 Web 应用（C端）、后台管理系统（B端）以及后端服务。整体采用前后端分离架构，通过 RESTful API 进行通信。

### 1.1 系统目录结构

```
archives-platform/
├── projects/
│   ├── backend/          # NestJS 后端 API 服务
│   ├── frontend-admin/   # Vue 3 + Vite 管理后台
│   └── frontend-mobile/  # Vue 3 + Vite 移动端应用 (Web/H5)
├── database/             # 数据库初始化脚本 (Schema)
├── prototypes/           # 原始 HTML/CSS 静态原型
├── .trae/documents/      # 产品需求与技术文档
└── README.md             # 项目说明文档
```

### 1.2 系统拓扑图

```mermaid
graph TD
    User[C端用户 (移动Web)] --> |HTTPS| Nginx[Nginx / Gateway]
    Admin[管理员 (Web后台)] --> |HTTPS| Nginx
    
    subgraph "应用服务层"
        Nginx --> NestJS[NestJS API 服务]
        
        NestJS --> ModUser[用户模块]
        NestJS --> ModBooking[预约模块]
        NestJS --> ModCMS[内容管理模块]
        NestJS --> ModSearch[检索模块]
    end
    
    subgraph "数据存储层"
        NestJS --> SQLite[(SQLite 开发库)]
        NestJS --> MySQL[(MySQL 生产库)]
        NestJS --> Redis[Redis 缓存 (可选)]
    end
```

---

## 2. 技术选型

### 2.1 移动端应用 (Frontend Mobile)
- **框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件库**: [Vant 4](https://vant-ui.github.io/vant/)
  - **设计规范**: 必须严格遵循**微信小程序设计规范 (WeChat Design)**，确保 UI/UX 与原生小程序体验一致。
  - **适配**: 针对移动端 H5 进行适配。
- **布局策略 (Layout Strategy)**:
  - **App Shell 模式**: 所有页面根容器强制 `height: 100vh; overflow: hidden;`，采用 Flex 纵向布局 (`flex-direction: column`)。
    - **Header/Footer**: 使用 `.static-header` 和 `.static-nav` 类，设置为 `flex-shrink: 0`，确保头部和底部导航固定不跟随内容滚动。
    - **Content**: 内容区域使用 `.app-shell-content` 类，设置为 `flex: 1; overflow-y: auto;`，实现独立滚动。
  - **宽度一致性 (Width Consistency)**: 
    - 全局定义 `--mobile-max-width: 375px`。
    - 所有页面容器 (`.mobile-container`) 在桌面端严格限制 `max-width: 375px` 并居中 (`margin: 0 auto`)。
    - 强制约束 `fixed` 定位元素（如 `van-nav-bar`, `van-submit-bar`, 底部导航）的宽度为 `100%` 且 `max-width: 375px`，防止在大屏下溢出。
  - **组件适配**: 
    - Vant 底部弹窗组件 (`van-popup`, `van-calendar`, `van-action-sheet`) 在桌面端强制约束宽度为 375px 并居中显示。
    - 使用 CSS 变量和 `:deep()` 选择器穿透 Vant 组件样式，确保一致性。
- **核心视图 (Views)**:
  - **HomeView**: 首页，聚合各功能入口。
  - **BookingView**: 统一预约页 (支持个人、团队、查档)。
  - **ProfileView**: 个人中心。
  - **GuideView / SearchView / CourseBookingView 等**: 功能占位页。
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: Vue Router 4
- **样式**: CSS / Less，统一管理在 `styles.css`。

### 2.2 后台管理系统 (Frontend Admin)
- **框架**: Vue 3
- **构建工具**: Vite
- **UI 组件库**: Element Plus (计划中)
- **状态管理**: Pinia

### 2.3 服务端 (Backend)
- **框架**: [NestJS](https://nestjs.com/) (基于 TypeScript 的渐进式 Node.js 框架)
- **语言**: TypeScript
- **ORM**: [TypeORM](https://typeorm.io/)
- **数据库**: 
  - **开发环境**: SQLite (轻量级，开箱即用)
  - **生产环境**: MySQL 8.0
- **API 文档**: Swagger (NestJS 集成)

---

## 3. 开发规范

### 3.1 代码注释
- **强制要求**: 所有业务逻辑代码、复杂组件和 API 接口定义必须包含清晰的注释。
- **格式**: 使用 JSDoc 风格或双斜杠注释，解释“为什么这样做”以及“输入输出是什么”。

### 3.2 接口规范 (API Design)
遵循 RESTful 风格，统一响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

---

## 4. 核心模块设计

### 4.1 数据库实体 (Entities)
基于 TypeORM 定义的核心实体：
- **User**: 用户信息 (OpenID, 手机号等)
- **Exhibition**: 展览信息 (标题, 封面, 类型)
- **ExhibitionScene**: VR 场景数据
- **CourseOnline / CourseOffline**: 线上/线下课程
- **Appointment**: 预约记录
- **Archive**: 档案元数据
- **News**: 资讯文章

---

## 5. 部署方案

- **开发环境**: 本地启动 NestJS 服务 + Vite 开发服务器。
- **生产环境**:
  - 前端构建为静态资源 (dist)，部署至 Nginx 或 CDN。
  - 后端编译为 JavaScript (dist)，通过 PM2 或 Docker 运行。
  - 数据库使用云数据库 MySQL。

此架构设计既保证了开发效率（Monorepo、SQLite），又具备良好的扩展性，能够平滑过渡到生产环境。

---

## 6. 变更记录（重构）

- 2026-01-14
  - 统一 App Shell 布局：所有页面采用 `.mobile-container` + `.static-header` + `.app-shell-content` 结构
  - 移除视图内局部 `.static-header`/`.static-nav` 样式，统一复用全局样式
  - 强制桌面端 375px 居中：Vant 导航栏、底部操作栏均限制 `max-width: 375px`
  - Search、Guide、Map、ExhibitionList、ExhibitionDetail、Profile 页面已适配并验证

## 7. UI 规范：Div 交互块（三端统一）

- 目标：统一“可点击的区块（div）”交互体验，满足移动端触控与键盘可访问性
- 标准类名：`touch-block`
- 交互要求：
  - 触控目标最小高度 44px
  - 支持键盘触发：`role="button" tabindex="0"`，监听 `Enter` 触发
  - 焦点态显示可见的聚焦边框
- 移动端实现：`projects/frontend-mobile/src/assets/styles.css` 定义 `touch-block` 并应用到首页功能入口
- 后台管理端实现：`projects/frontend-admin/src/style.css` 定义 `touch-block`，在 `HelloWorld.vue` 中示例使用
- 后端：无需改动（UI 纯前端规范），保持 REST 接口不变
