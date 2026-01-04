# 升级指南

本文档提供了文武贝贝工具集项目的版本升级指南。

## 目录

- [升级前准备](#升级前准备)
- [版本升级步骤](#版本升级步骤)
- [版本迁移指南](#版本迁移指南)
- [常见问题](#常见问题)

## 升级前准备

### 备份数据

在进行任何升级操作之前，请务必：

1. **备份数据库**
   ```bash
   # 导出数据库
   mysqldump -u username -p wenwubeibei > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **备份配置文件**
   ```bash
   # 备份环境变量配置
   cp .env .env.backup
   ```

3. **记录当前版本**
   ```bash
   # 查看当前版本
   cat package.json | grep version
   ```

### 检查兼容性

- 查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本变更
- 检查是否有破坏性变更（Breaking Changes）
- 确认 Node.js 版本是否满足要求

## 版本升级步骤

### 本地环境升级

1. **拉取最新代码**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   ```

2. **安装依赖**
   ```bash
   # 清理旧依赖
   rm -rf node_modules
   rm package-lock.json
   
   # 安装新依赖
   npm install
   ```

3. **数据库迁移**
   ```bash
   # 如果有数据库变更，执行迁移脚本
   npm run migrate
   ```

4. **测试服务**
   ```bash
   # 启动服务
   npm start
   
   # 访问健康检查接口
   curl http://localhost:80/api/health
   ```

### 微信云托管升级

#### 方式一：通过控制台升级

1. 登录 [微信云托管控制台](https://cloud.weixin.qq.com/cloudrun/)
2. 选择对应的服务
3. 点击「版本管理」
4. 点击「新建版本」
5. 选择最新代码分支
6. 配置环境变量（如有新增）
7. 点击「部署」

#### 方式二：通过 CI/CD 自动部署

如果配置了自动部署：

1. 合并代码到主分支
2. 等待自动构建和部署完成
3. 验证新版本运行状态

### 升级验证

升级完成后，请进行以下验证：

1. **健康检查**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **功能测试**
   - 测试关键接口是否正常
   - 检查数据是否完整
   - 验证新功能是否可用

3. **性能监控**
   - 查看服务响应时间
   - 检查错误率
   - 监控资源使用情况

## 版本迁移指南

### 从 Demo 版本迁移到 1.0.0

如果你是从原始的计数器 Demo 版本升级到文武贝贝工具集 1.0.0 版本：

#### 1. 代码变更

**数据库名称变更**：
- 旧版本：`nodejs_demo`
- 新版本：`wenwubeibei`

**项目结构变更**：
```
旧结构:
.
├── index.js
├── db.js
├── index.html
└── package.json

新结构:
.
├── config/
├── docs/
├── middleware/
├── models/
├── public/
│   └── index.html
├── routes/
├── utils/
├── index.js
├── db.js
└── package.json
```

#### 2. API 变更

**移除的接口**：
- `GET /api/count` - 已移除
- `POST /api/count` - 已移除

**新增的接口**：
- `GET /api/health` - 健康检查接口
- `GET /api/wx_openid` - 获取微信 OpenID（已优化）

#### 3. 数据迁移

如果需要保留旧数据：

```sql
-- 创建新数据库
CREATE DATABASE IF NOT EXISTS wenwubeibei;

-- 迁移数据（示例）
-- 根据实际情况调整
USE wenwubeibei;

-- 如果需要保留计数器数据，可以创建新表
CREATE TABLE IF NOT EXISTS legacy_counters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 从旧数据库导入数据
INSERT INTO wenwubeibei.legacy_counters 
SELECT * FROM nodejs_demo.Counters;
```

#### 4. 环境变量配置

在微信云托管控制台更新环境变量：

```
MYSQL_USERNAME=<你的数据库用户名>
MYSQL_PASSWORD=<你的数据库密码>
MYSQL_ADDRESS=<数据库地址>:<端口>
PORT=80
```

#### 5. 验证升级

```bash
# 检查服务状态
curl https://your-domain.com/api/health

# 预期响应
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

## 常见问题

### 升级后服务无法启动

**可能原因**：
1. 数据库连接配置错误
2. 依赖包安装不完整
3. Node.js 版本不兼容

**解决方法**：
```bash
# 检查环境变量
echo $MYSQL_ADDRESS
echo $MYSQL_USERNAME

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 应该 >= 12.0.0
```

### 数据库连接失败

**可能原因**：
- 数据库地址配置错误
- 数据库用户名或密码错误
- 数据库未创建

**解决方法**：
```bash
# 测试数据库连接
mysql -h <host> -P <port> -u <username> -p

# 创建数据库
CREATE DATABASE IF NOT EXISTS wenwubeibei;
```

### 接口返回 404

**可能原因**：
- 路由配置错误
- 接口路径变更

**解决方法**：
- 查看 [API 文档](./API.md) 确认正确的接口路径
- 检查路由配置文件

### 性能下降

**可能原因**：
- 数据库查询未优化
- 缺少索引
- 并发连接数过高

**解决方法**：
```javascript
// 优化数据库连接池配置
const sequelize = new Sequelize(DB_NAME, username, password, {
  pool: {
    max: 10,      // 增加最大连接数
    min: 2,       // 设置最小连接数
    acquire: 30000,
    idle: 10000
  }
});
```

### 部署后小程序无法连接

**可能原因**：
- 域名未在小程序后台配置
- HTTPS 证书问题

**解决方法**：
1. 登录微信小程序后台
2. 进入「开发」-「开发管理」-「开发设置」
3. 在「服务器域名」中添加你的云托管域名
4. 确保使用 HTTPS 协议

## 回滚方案

如果升级后出现严重问题，可以回滚到之前的版本：

### 本地环境回滚

```bash
# 回退到上一个版本
git log --oneline  # 查看提交历史
git checkout <commit-hash>

# 恢复数据库
mysql -u username -p wenwubeibei < backup_20260104_112000.sql

# 重启服务
npm start
```

### 云托管环境回滚

1. 登录微信云托管控制台
2. 选择对应的服务
3. 点击「版本管理」
4. 找到上一个稳定版本
5. 点击「部署」

## 获取帮助

如果在升级过程中遇到问题：

1. 查看 [开发文档](./DEVELOPMENT.md)
2. 查看 [常见问题](./FAQ.md)
3. 提交 [Issue](https://github.com/WenWuBeiBei/wxcloudrun-express/issues)
4. 联系技术支持

## 最佳实践

1. **在测试环境先验证**: 不要直接在生产环境升级
2. **选择合适的时间**: 在业务低峰期进行升级
3. **保持沟通**: 通知相关人员升级计划
4. **做好监控**: 升级后密切关注系统状态
5. **准备回滚方案**: 确保可以快速回滚

---

如有任何疑问，请参考 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/) 或联系我们。
