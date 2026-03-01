# Jw-show 个人作品展示平台

基于 **Next.js** 前端 + **Strapi** CMS + **PostgreSQL**，使用 Docker Compose 一键启动，无需 PM2。

## 项目结构

```
Jw-show/
├── frontend/          # Next.js 14（App Router）
├── cms/               # Strapi 4 后台
├── docker-compose.yml
├── .env.example
└── README.md
```

## 快速开始

### 1. 环境要求

- Docker 与 Docker Compose
- 本地开发可选：Node.js 18+、pnpm/npm

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，至少修改 POSTGRES_PASSWORD 和 Strapi 相关密钥
```

生成随机密钥（可选）：

```bash
openssl rand -base64 32   # 用于 STRAPI_APP_KEYS 等
```

### 3. 启动全部服务（Docker）

```bash
docker compose up -d --build
```

- **前端**：http://localhost:3000  
- **Strapi 后台**：http://localhost:1337/admin  

首次访问 Strapi 后台会要求创建管理员账号，创建后登录。

### 4. 开放 API 权限（必做）

登录 Strapi 后台后：

1. 进入 **设置 (Settings)** → **用户与权限插件 (Users & Permissions)** → **角色 (Roles)**
2. 点击 **Public**
3. 勾选：
   - **Work**：find、findOne
   - **Category**：find、findOne
   - **About**：find
4. 保存

保存后，前端即可拉取作品、分类和关于页数据。

### 5. 添加内容

- **分类**：内容管理器 → 分类 → 创建（如：UI、动效、开发）
- **作品**：内容管理器 → 作品 → 创建（标题、slug、封面、描述、链接、分类等），并点击「发布」
- **关于**：内容管理器 → 关于（单类型）→ 填写介绍、头像、社交链接等

## 本地开发（不用 Docker）

### 前端

```bash
cd frontend
npm install
# 确保 .env.local 中有 NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
npm run dev
```

### CMS

```bash
cd cms
npm install
# 使用 SQLite 开发时可先不配置 PostgreSQL，直接：
npm run develop
```

开发时 Strapi 默认用 SQLite（`.tmp/data.db`）。生产环境在 Docker 中通过 `.env` 配置 PostgreSQL。

**说明**：Strapi 4 官方建议 Node 18～20。Docker 镜像使用 Node 20，本地若为 Node 22 可能只有引擎警告，一般仍可运行；若遇问题可改用 nvm 切到 Node 20。

## 部署到 Ubuntu 服务器

1. 安装 Docker 与 Docker Compose  
2. 克隆项目，配置 `.env`（强密码与密钥）  
3. 执行：

   ```bash
   docker compose up -d --build
   ```

4. 使用 Nginx 反向代理（可选）：将域名指向本机 `3000`（前端）和 `1337`（Strapi），并配置 HTTPS。  
5. 前端如需在 SSR 中访问 Strapi，可设置 `STRAPI_INTERNAL_URL=http://cms:1337`（Docker 内网），`NEXT_PUBLIC_STRAPI_URL` 为对外访问 Strapi 的地址（如 `https://cms.你的域名.com`）。

## 技术栈

- **前端**：Next.js 14、TypeScript、App Router  
- **CMS**：Strapi 4、PostgreSQL  
- **运行**：Docker + Docker Compose（无 PM2）

## 常见问题

- **前端报错拉不到数据**：检查 Strapi 是否已启动、Public 权限是否已勾选、`.env` 中 `NEXT_PUBLIC_STRAPI_URL` 是否正确。  
- **Strapi 首次启动慢**：正在构建 admin 与数据库结构，属正常现象。  
- **上传图片 413**：在 Nginx 中调大 `client_max_body_size`。
