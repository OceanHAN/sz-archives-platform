# 深圳市档案馆小程序 - 技术架构说明书

**版本**: 1.1
**日期**: 2026-01-09
**状态**: 优化设计

---

## 1. 架构概览

考虑到系统用户量适中（非超高并发场景），我们采用**轻量化单体架构 (Monolithic Architecture)** 以降低开发和运维成本，同时引入**后台管理系统 (Admin Panel)** 用于内容和数据的统一管理。

### 1.1 系统拓扑图

```mermaid
graph TD
    User[C端用户 (小程序)] --> |HTTPS| Nginx[Nginx 反向代理]
    Admin[管理员 (Web后台)] --> |HTTPS| Nginx
    
    subgraph "应用服务层 (Node.js/Java)"
        Nginx --> APIServer[API 服务端]
        
        APIServer --> ModUser[用户模块]
        APIServer --> ModBooking[预约模块]
        APIServer --> ModCMS[内容管理模块]
        APIServer --> ModSearch[检索模块]
    end
    
    subgraph "数据存储层"
        APIServer --> MySQL[(主数据库)]
        APIServer --> Redis[缓存 & Session]
        APIServer --> OSS[对象存储 (文件/图片)]
    end
```

---

## 2. 技术选型

### 2.1 小程序端 (C端)
- **框架**: Uni-app (Vue 3) / 微信原生
- **UI库**: Vant Weapp
- **功能**: 档案检索、预约、云展厅、云课堂

### 2.2 后台管理系统 (B端)
- **框架**: Vue 3 + Element Plus / Ant Design Vue
- **脚手架**: vue-element-admin / Vben Admin
- **功能**:
  - **内容管理**: 发布/编辑/下架展览、课程、资讯。
  - **预约管理**: 查看预约记录、核销管理、导出报表。
  - **档案管理**: 档案元数据的导入、修改、关联电子件。
  - **系统设置**: 角色权限管理、操作日志。

### 2.3 服务端 (Backend)
- **语言框架**: 
  - **Node.js**: NestJS / Koa2 (开发效率高，适合全栈团队)
  - **Java**: Spring Boot (生态成熟，适合企业级)
- **数据库**: MySQL 8.0
- **缓存**: Redis (可选，用于Token缓存和简单限流)
- **文件存储**: 本地磁盘存储 (小规模) 或 阿里云OSS/腾讯云COS (推荐)

---

## 3. 后台管理系统功能规划

### 3.1 展厅/课程管理 (CMS)
- **列表页**: 展示所有展览/课程，支持按状态（上架/下架）、类型筛选。
- **编辑页**: 
  - 填写标题、简介、详情（富文本编辑器）。
  - 上传封面图、视频文件（直传OSS）。
  - VR场景配置：上传全景图，设置热点坐标。
- **操作**: 一键发布、下架、置顶。

### 3.2 预约管理
- **排班设置**: 设置每日开放时段、每个时段的最大预约人数。
- **订单查询**: 按日期、手机号、状态搜索预约单。
- **核销**: 扫码核销或后台手动输入核销码核销。
- **数据导出**: 导出Excel格式的预约名单，供安保人员核对。

### 3.3 档案元数据管理
- **批量导入**: 支持Excel模板批量导入档案条目。
- **详情编辑**: 修改档号、题名、控制状态。
- **附件管理**: 关联PDF或图片格式的档案原文。

---

## 4. 接口规范 (API Design)

### 4.1 管理后台接口示例

#### 4.1.1 登录
- `POST /admin/login`
- Body: `{ username, password }`
- Response: `{ token: "..." }`

#### 4.1.2 展览增删改查
- `GET /admin/exhibitions`: 获取列表
- `POST /admin/exhibitions`: 新增展览
- `PUT /admin/exhibitions/:id`: 更新展览
- `DELETE /admin/exhibitions/:id`: 删除展览

#### 4.1.3 导出预约
- `GET /admin/appointments/export`
- Query: `date=2026-05-01`
- Response: 二进制流 (Excel文件)

---

## 5. 部署方案 (简化版)

- **服务器**: 单台云服务器 (2核4G或4核8G)。
- **环境**: 安装 Docker 和 Docker Compose。
- **部署**:
  - Nginx 容器：负责静态资源托管 (后台Web) 和 API 反向代理。
  - MySQL 容器：数据存储。
  - API 服务容器：后端业务逻辑。
- **备份**: 每日定时脚本备份 MySQL 数据到对象存储。

此架构足以支撑日活 1w+ 的用户量，且运维成本极低。
