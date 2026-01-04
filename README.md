# 文武贝贝工具集

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)](https://nodejs.org/)

文武贝贝工具集是一个基于微信云托管的微信小程序工具集服务，旨在提供多种实用小工具，为用户提供便捷的服务体验。

## 项目简介

本项目采用 Node.js + Express 框架构建后端服务，配合微信云托管平台部署，为微信小程序提供稳定可靠的后端支持。项目采用模块化设计，支持快速扩展和集成新的工具功能。

## 技术栈

- **运行环境**: Node.js >= 12.0.0
- **Web 框架**: Express 4.x
- **数据库**: MySQL (通过 Sequelize ORM)
- **部署平台**: 微信云托管
- **其他依赖**: cors, morgan, mysql2, sequelize

## 快速开始

### 前置要求

- Node.js 12.0 或更高版本
- MySQL 数据库（微信云托管会自动提供）
- 微信开发者账号

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/WenWuBeiBei/wxcloudrun-express.git
   cd wxcloudrun-express
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env` 文件并配置以下环境变量：
   ```
   MYSQL_USERNAME=你的数据库用户名
   MYSQL_PASSWORD=你的数据库密码
   MYSQL_ADDRESS=数据库地址:端口
   PORT=80
   ```

4. **启动服务**
   ```bash
   npm start
   ```

5. **访问服务**
   
   浏览器访问 `http://localhost:80`

### 微信云托管部署

1. 前往 [微信云托管控制台](https://cloud.weixin.qq.com/cloudrun/)
2. 创建新服务并关联本仓库
3. 配置数据库环境变量（MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS）
4. 触发部署

详细部署指南请参考[微信云托管文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/)

## 项目结构

```
.
├── config/              # 配置文件目录
├── docs/                # 文档目录
├── middleware/          # 中间件目录
├── models/              # 数据模型目录
├── public/              # 静态文件目录
│   └── index.html       # 欢迎页面
├── routes/              # 路由目录
├── utils/               # 工具函数目录
├── db.js                # 数据库配置
├── index.js             # 应用入口文件
├── package.json         # 项目配置文件
├── Dockerfile           # Docker 构建文件
└── container.config.json # 云托管配置文件
```

## API 接口文档

### 健康检查接口

**接口地址**: `GET /api/health`

**功能说明**: 检查服务运行状态

**响应示例**:
```json
{
  "code": 0,
  "message": "服务正常运行",
  "data": {
    "service": "文武贝贝工具集",
    "version": "1.0.0",
    "timestamp": "2026-01-04T11:20:00.000Z"
  }
}
```

### 获取微信 OpenID

**接口地址**: `GET /api/wx_openid`

**功能说明**: 获取小程序用户的 OpenID

**请求头**: 需要微信小程序调用，包含 `x-wx-source` 和 `x-wx-openid` 头信息

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "openid": "用户的OpenID"
  }
}
```

## 开发指南

详细的开发规范和指南请查看：
- [开发规范文档](docs/DEVELOPMENT.md)
- [API 文档](docs/API.md)
- [升级指南](docs/UPGRADE.md)
- [变更日志](docs/CHANGELOG.md)

## 环境变量说明

| 变量名 | 说明 | 必填 | 默认值 |
|--------|------|------|--------|
| MYSQL_USERNAME | MySQL 数据库用户名 | 是 | - |
| MYSQL_PASSWORD | MySQL 数据库密码 | 是 | - |
| MYSQL_ADDRESS | MySQL 数据库地址（格式：host:port） | 是 | - |
| PORT | 服务监听端口 | 否 | 80 |

## 注意事项

- 如果不是通过微信云托管控制台部署，而是手动部署，需要在服务设置中配置环境变量
- 生产环境请确保数据库连接信息的安全性
- 建议使用 HTTPS 协议访问服务

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 许可证

本项目采用 [Apache-2.0](LICENSE) 许可证

## 联系方式

- 项目地址: [https://github.com/WenWuBeiBei/wxcloudrun-express](https://github.com/WenWuBeiBei/wxcloudrun-express)
- 问题反馈: [提交 Issue](https://github.com/WenWuBeiBei/wxcloudrun-express/issues)

---

© 2026 文武贝贝工具集 - Powered by 微信云托管

