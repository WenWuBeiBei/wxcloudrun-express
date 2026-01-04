# 快速开始（后端框架）

本指南帮助你在本地或微信云托管上快速跑通文武贝贝工具集后端骨架。

## 环境准备
- Node.js >= 12
- 微信开发者账号 + 云托管服务
- （可选）MySQL 8.x，如果需要持久化数据

## 本地运行
1. 安装依赖：
   ```bash
   npm install
   ```
2. （可选）配置数据库环境变量：创建 `.env` 或在终端导出
   ```env
   MYSQL_USERNAME=your_user
   MYSQL_PASSWORD=your_password
   MYSQL_ADDRESS=your_host:3306
   PORT=80
   ```
   未配置时将跳过数据库连接，便于快速体验。
3. 启动：
   ```bash
   npm start
   ```
4. 验证：
   - 欢迎页：http://localhost:80
   - 健康检查：http://localhost:80/api/v1/health

## 部署到微信云托管
1. 推送代码到你的仓库
2. 在云托管控制台创建服务，选择仓库分支构建
3. 配置环境变量：`MYSQL_USERNAME`、`MYSQL_PASSWORD`、`MYSQL_ADDRESS`、`PORT`
4. 部署后验证健康检查，确认返回 `code: 0`
5. 在小程序后台添加服务器域名，使用 `wx.request` 联调

## 接入第一个小工具（示例思路）
1. **建表/模型**：在 `models/` 定义 Sequelize 模型（如 `tool.js`），表名使用复数
2. **编写路由**：在 `routes/tools.js` 补充 `GET/POST/PUT/DELETE`，使用 `success/fail/paginate` 统一返回
3. **注册路由**：`routes/index.js` 已挂载 `/api/v1/tools`，直接扩展即可
4. **校验与错误**：使用 `middleware/validator.js` 或自定义校验，错误返回 400/422
5. **文档更新**：在 `docs/API.md` 补充接口说明，在 `docs/CHANGELOG.md` 记录变更

## 常见问题
- **无法连接数据库**：检查环境变量、端口、白名单；本地可先不配 DB 跳过
- **小程序请求 404/500**：确认路径为 `/api/v1/...`，查看云托管日志和健康检查
- **域名校验失败**：确保云托管域名已添加到小程序「服务器域名」

## 推荐命令
```bash
npm install       # 安装依赖
npm start         # 启动服务
# 可选：热重载
npm install -D nodemon
npx nodemon index.js
```

检查环境变量配置是否正确，确保数据库地址、用户名、密码都正确。

### Q: 接口返回 404？

检查路由是否正确注册，URL 路径是否正确。

### Q: 小程序无法调用接口？

1. 检查域名是否在小程序后台配置
2. 确保使用 HTTPS 协议
3. 检查请求格式是否正确

## 获取帮助

- 📖 查看[完整文档](./docs/DEVELOPMENT.md)
- 🐛 提交[Issue](https://github.com/WenWuBeiBei/wxcloudrun-express/issues)
- 💬 查看[微信云托管文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/)

## 下一步

现在你已经掌握了基础知识，可以开始：

1. ✨ 设计你的工具功能
2. 📝 编写数据模型
3. 🔧 实现业务逻辑
4. 🧪 编写测试用例
5. 🚀 部署到生产环境

祝你开发愉快！🎉
