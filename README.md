# 文武贝贝工具集（微信云托管版）

基于微信云托管的 Node.js/Express 后端骨架，为小程序「文武贝贝」提供可扩展的工具集服务。当前版本聚焦基础设施，方便后续按需接入多个小工具模块。

## 核心特性

- 面向微信小程序的轻量级服务框架，内置健康检查与 OpenID 获取
- 模块化目录结构，适合快速接入多工具场景
- 统一响应格式、错误码与参数校验示例
- 支持无数据库配置的快速启动，本地体验更友好
- 覆盖本地开发与微信云托管部署流程

## 快速开始

### 环境要求
- Node.js >= 12
- （可选）MySQL 8.x，用于正式接入数据
- 微信开发者账号 + 云托管服务

### 本地运行
1. 安装依赖：
   ```bash
   npm install
   ```
2. 配置环境变量（可选，未配置则跳过数据库连接）：
   ```env
   MYSQL_USERNAME=your_user
   MYSQL_PASSWORD=your_password
   MYSQL_ADDRESS=your_host:3306
   PORT=80
   ```
3. 启动服务：
   ```bash
   npm start
   ```
4. 访问欢迎页/健康检查：
   - http://localhost:80
   - http://localhost:80/api/v1/health

### 微信云托管部署
1. 推送代码到仓库并在云托管控制台创建服务
2. 在「环境变量」中设置 `MYSQL_USERNAME`、`MYSQL_PASSWORD`、`MYSQL_ADDRESS`、`PORT`
3. 构建并发布版本，健康检查通过后即可与小程序联调

## 目录结构

```
.
├── config/               # 预留配置目录
├── docs/                 # 文档（API、规范、升级说明等）
├── middleware/           # 中间件（参数验证等）
├── models/               # 数据模型（按需新增）
├── public/               # 静态资源与欢迎页
├── routes/               # 路由入口与模块路由
├── utils/                # 工具函数（统一响应等）
├── db.js                 # 数据库配置与初始化
├── index.js              # 应用入口
├── Dockerfile            # 容器构建配置
└── package.json
```

## 内置接口
- `GET /api/v1/health`：服务健康检查，返回服务名、版本、时间戳
- `GET /api/v1/wx/openid`：从微信云托管注入头中获取用户 OpenID，仅小程序内可用
- `GET /api/v1/tools`：工具列表占位，返回空列表，等待业务接入

更多设计约定与扩展方式，详见 [docs/API.md](docs/API.md)。

## 环境变量

| 变量名 | 说明 | 是否必填 | 默认值 |
| --- | --- | --- | --- |
| MYSQL_USERNAME | 数据库用户名 | 部署环境建议必填 | - |
| MYSQL_PASSWORD | 数据库密码 | 部署环境建议必填 | - |
| MYSQL_ADDRESS | 数据库地址，格式 host:port | 部署环境建议必填 | - |
| PORT | 服务监听端口 | 否 | 80 |
| SERVICE_VERSION | 显示用版本号 | 否 | package.json version |

## 开发规范与文档
- 开发规范与约定：[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- API 约定与示例：[docs/API.md](docs/API.md)
- 快速上手与部署：[docs/QUICKSTART.md](docs/QUICKSTART.md)
- 升级与版本策略：[docs/UPGRADE.md](docs/UPGRADE.md)
- 变更记录：[docs/CHANGELOG.md](docs/CHANGELOG.md)

## 许可

Apache-2.0。欢迎基于本框架扩展你的工具集能力。

