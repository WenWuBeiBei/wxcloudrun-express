# 快速开发指南

欢迎使用文武贝贝工具集！本指南将帮助你快速上手开发。

## 开始之前

确保你已经：
- ✅ 安装了 Node.js (>= 12.0.0)
- ✅ 拥有微信开发者账号
- ✅ 熟悉 JavaScript/Node.js 基础
- ✅ 了解 Express 框架基础

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/WenWuBeiBei/wxcloudrun-express.git
cd wxcloudrun-express
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的数据库配置：

```env
MYSQL_USERNAME=your_username
MYSQL_PASSWORD=your_password
MYSQL_ADDRESS=your_host:3306
PORT=80
```

### 4. 启动服务

```bash
npm start
```

服务启动后，访问 `http://localhost:80` 查看欢迎页面。

## 添加你的第一个工具

### Step 1: 创建数据模型

在 `models/` 目录下创建 `tool.js`:

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Tool = sequelize.define('Tool', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '工具名称'
  },
  description: {
    type: DataTypes.STRING(500),
    comment: '工具描述'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '工具分类'
  }
}, {
  tableName: 'tools',
  timestamps: true,
  underscored: true
});

module.exports = Tool;
```

### Step 2: 创建路由

在 `routes/` 目录下创建 `tools.js`:

```javascript
const express = require('express');
const router = express.Router();
const Tool = require('../models/tool');
const { success, fail } = require('../utils/response');

// 获取工具列表
router.get('/tools', async (req, res) => {
  try {
    const tools = await Tool.findAll();
    success(res, tools, '查询成功');
  } catch (error) {
    console.error('获取工具列表失败:', error);
    fail(res, '获取工具列表失败', 500, 500);
  }
});

// 创建工具
router.post('/tools', async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const tool = await Tool.create({ name, description, category });
    success(res, tool, '创建成功');
  } catch (error) {
    console.error('创建工具失败:', error);
    fail(res, '创建工具失败', 500, 500);
  }
});

module.exports = router;
```

### Step 3: 注册路由

在 `index.js` 中注册路由：

```javascript
// 在文件顶部导入路由
const toolsRouter = require('./routes/tools');

// 在路由部分添加
app.use('/api', toolsRouter);
```

### Step 4: 同步数据库

在 `db.js` 的 `init()` 函数中添加模型同步：

```javascript
// 导入模型
const Tool = require('./models/tool');

async function init() {
  try {
    await sequelize.authenticate();
    console.log("数据库连接成功");
    
    // 同步模型到数据库（开发环境）
    await Tool.sync({ alter: true });
    
  } catch (error) {
    console.error("数据库连接失败:", error);
    throw error;
  }
}
```

### Step 5: 测试接口

重启服务后测试：

```bash
# 创建工具
curl -X POST http://localhost:80/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JSON格式化",
    "description": "在线JSON格式化工具",
    "category": "开发工具"
  }'

# 获取工具列表
curl http://localhost:80/api/tools
```

## 项目结构说明

```
wxcloudrun-express/
├── config/              # 配置文件（预留）
├── docs/                # 项目文档
│   ├── API.md          # API接口文档
│   ├── CHANGELOG.md    # 变更日志
│   ├── DEVELOPMENT.md  # 开发规范
│   └── UPGRADE.md      # 升级指南
├── middleware/          # Express中间件
│   └── validator.js    # 参数验证中间件
├── models/              # 数据模型
│   └── README.md       # 模型使用说明
├── public/              # 静态文件
│   └── index.html      # 欢迎页面
├── routes/              # 路由定义
│   └── example.js      # 路由示例
├── utils/               # 工具函数
│   └── response.js     # 响应格式化工具
├── db.js               # 数据库配置
├── index.js            # 应用入口
├── package.json        # 项目配置
└── Dockerfile          # Docker配置
```

## 常用开发命令

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 本地开发（带文件监控，需要安装nodemon）
npm install -D nodemon
npx nodemon index.js
```

## 开发最佳实践

### 1. 遵循代码规范

- 使用 2 空格缩进
- 变量使用小驼峰命名：`userName`
- 常量使用大写下划线：`MAX_COUNT`
- 文件名使用小写加中划线：`user-service.js`

### 2. 错误处理

始终使用 try-catch 处理异步操作：

```javascript
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return fail(res, '用户不存在', 404, 404);
    }
    success(res, user);
  } catch (error) {
    console.error('查询用户失败:', error);
    fail(res, '服务器错误', 500, 500);
  }
});
```

### 3. 参数验证

使用中间件验证请求参数：

```javascript
const { validateRequired } = require('../middleware/validator');

router.post('/users', 
  validateRequired(['name', 'email']),
  async (req, res) => {
    // 处理请求
  }
);
```

### 4. 统一响应格式

使用 `utils/response.js` 中的工具函数：

```javascript
const { success, fail, paginate } = require('../utils/response');

// 成功响应
success(res, data, '操作成功');

// 失败响应
fail(res, '操作失败', 400, 400);

// 分页响应
paginate(res, items, total, page, pageSize);
```

## 数据库操作

### 查询

```javascript
// 查询所有
const users = await User.findAll();

// 条件查询
const user = await User.findOne({
  where: { openid: 'xxx' }
});

// 分页查询
const { count, rows } = await User.findAndCountAll({
  limit: 10,
  offset: 0,
  order: [['createdAt', 'DESC']]
});
```

### 创建

```javascript
const user = await User.create({
  openid: 'xxx',
  nickname: '张三'
});
```

### 更新

```javascript
await User.update(
  { nickname: '李四' },
  { where: { id: 1 } }
);
```

### 删除

```javascript
await User.destroy({
  where: { id: 1 }
});
```

## 微信小程序集成

### 获取用户 OpenID

```javascript
// 小程序端
wx.request({
  url: 'https://your-domain.com/api/wx_openid',
  method: 'GET',
  success(res) {
    const openid = res.data.data.openid;
    // 保存 openid
    wx.setStorageSync('openid', openid);
  }
});
```

### 调用自定义接口

```javascript
wx.request({
  url: 'https://your-domain.com/api/tools',
  method: 'GET',
  success(res) {
    if (res.data.code === 0) {
      const tools = res.data.data;
      // 处理数据
    }
  },
  fail(err) {
    wx.showToast({
      title: '请求失败',
      icon: 'none'
    });
  }
});
```

## 部署到微信云托管

### 1. 准备代码

确保代码已提交到 Git 仓库。

### 2. 创建云托管服务

1. 登录[微信云托管控制台](https://cloud.weixin.qq.com/cloudrun/)
2. 创建新服务
3. 关联 Git 仓库
4. 配置环境变量

### 3. 配置环境变量

在服务设置中添加：

```
MYSQL_USERNAME=<数据库用户名>
MYSQL_PASSWORD=<数据库密码>
MYSQL_ADDRESS=<数据库地址>:3306
```

### 4. 部署

点击「部署」按钮，等待构建完成。

### 5. 绑定域名

在小程序后台配置服务器域名。

## 常见问题

### Q: 数据库连接失败？

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
