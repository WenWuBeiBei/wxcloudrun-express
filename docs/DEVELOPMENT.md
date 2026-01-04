# 开发规范文档

本文档定义了文武贝贝工具集项目的开发规范和最佳实践。

## 目录

- [代码规范](#代码规范)
- [目录结构](#目录结构)
- [数据库规范](#数据库规范)
- [API 设计规范](#api-设计规范)
- [Git 提交规范](#git-提交规范)
- [微信小程序开发规范](#微信小程序开发规范)

## 代码规范

### JavaScript 编码规范

1. **使用 ES6+ 语法**
   - 优先使用 `const`，需要重新赋值时使用 `let`
   - 避免使用 `var`
   - 使用箭头函数简化代码

2. **命名规范**
   - 变量和函数：使用小驼峰命名法（camelCase）
     ```javascript
     const userName = 'zhangsan';
     function getUserInfo() {}
     ```
   - 常量：使用全大写下划线命名法
     ```javascript
     const MAX_COUNT = 100;
     const API_BASE_URL = 'https://api.example.com';
     ```
   - 类和构造函数：使用大驼峰命名法（PascalCase）
     ```javascript
     class UserService {}
     ```
   - 文件名：使用小写字母和中划线
     ```
     user-service.js
     api-handler.js
     ```

3. **代码格式化**
   - 使用 2 个空格缩进
   - 语句结束使用分号
   - 字符串优先使用单引号
   - 对象和数组最后一项不加逗号

4. **注释规范**
   ```javascript
   /**
    * 获取用户信息
    * @param {string} userId - 用户ID
    * @returns {Promise<Object>} 用户信息对象
    */
   async function getUserInfo(userId) {
     // 实现代码
   }
   ```

### 异步处理

1. 优先使用 `async/await` 而不是 Promise 链
   ```javascript
   // 推荐
   async function getData() {
     try {
       const result = await fetchData();
       return result;
     } catch (error) {
       console.error('获取数据失败:', error);
       throw error;
     }
   }
   
   // 不推荐
   function getData() {
     return fetchData()
       .then(result => result)
       .catch(error => {
         console.error('获取数据失败:', error);
         throw error;
       });
   }
   ```

2. 错误处理必须使用 try-catch
   ```javascript
   async function processData() {
     try {
       const data = await fetchData();
       return processResult(data);
     } catch (error) {
       console.error('处理失败:', error);
       // 适当的错误处理
       throw new Error('数据处理失败');
     }
   }
   ```

## 目录结构

```
.
├── config/              # 配置文件
│   ├── database.js      # 数据库配置
│   └── app.js           # 应用配置
├── docs/                # 文档目录
├── middleware/          # 中间件
│   ├── auth.js          # 认证中间件
│   ├── validator.js     # 参数验证中间件
│   └── error-handler.js # 错误处理中间件
├── models/              # 数据模型
│   └── user.js          # 用户模型
├── public/              # 静态文件
│   ├── index.html
│   └── assets/
├── routes/              # 路由
│   ├── index.js         # 路由入口
│   ├── user.js          # 用户相关路由
│   └── tools.js         # 工具相关路由
├── services/            # 业务逻辑层（可选）
│   └── user-service.js
├── utils/               # 工具函数
│   ├── response.js      # 响应格式化
│   └── validator.js     # 验证工具
├── db.js                # 数据库配置文件
├── index.js             # 应用入口
└── package.json
```

### 目录职责

- **config/**: 存放配置文件，如数据库配置、应用配置等
- **middleware/**: 存放 Express 中间件
- **models/**: 存放 Sequelize 数据模型定义
- **routes/**: 存放路由定义，按功能模块划分
- **services/**: 存放业务逻辑代码（可选，复杂业务建议使用）
- **utils/**: 存放通用工具函数
- **public/**: 存放静态资源文件

## 数据库规范

### 表命名规范

- 使用小写字母和下划线
- 表名使用复数形式
- 示例：`users`, `tool_items`, `user_favorites`

### 字段命名规范

- 使用小写字母和下划线
- 主键统一使用 `id`
- 创建时间：`created_at`
- 更新时间：`updated_at`
- 删除时间：`deleted_at`（软删除）

### 模型定义规范

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户ID'
  },
  openid: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: '微信OpenID'
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '用户昵称'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '用户头像'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    comment: '创建时间'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    comment: '更新时间'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  comment: '用户表'
});

module.exports = User;
```

## API 设计规范

### RESTful API 规范

1. **URL 设计**
   - 使用名词而非动词
   - 使用复数形式
   - 使用小写字母和连字符
   
   ```
   GET    /api/users          # 获取用户列表
   GET    /api/users/:id      # 获取单个用户
   POST   /api/users          # 创建用户
   PUT    /api/users/:id      # 更新用户
   DELETE /api/users/:id      # 删除用户
   ```

2. **HTTP 方法使用**
   - GET：查询
   - POST：创建
   - PUT：完整更新
   - PATCH：部分更新
   - DELETE：删除

3. **响应格式**
   
   统一使用以下格式：
   
   ```javascript
   // 成功响应
   {
     "code": 0,
     "message": "操作成功",
     "data": {
       // 返回的数据
     }
   }
   
   // 错误响应
   {
     "code": -1,
     "message": "错误描述",
     "error": "详细错误信息"
   }
   
   // 分页响应
   {
     "code": 0,
     "message": "查询成功",
     "data": {
       "items": [],
       "total": 100,
       "page": 1,
       "pageSize": 10
     }
   }
   ```

4. **错误码定义**
   - `0`: 成功
   - `-1`: 通用错误
   - `400`: 请求参数错误
   - `401`: 未授权
   - `403`: 禁止访问
   - `404`: 资源不存在
   - `500`: 服务器内部错误

### 参数验证

所有接口都应进行参数验证：

```javascript
const validateUser = (req, res, next) => {
  const { openid } = req.body;
  
  if (!openid || typeof openid !== 'string') {
    return res.status(400).json({
      code: 400,
      message: 'openid 参数无效'
    });
  }
  
  next();
};

app.post('/api/users', validateUser, async (req, res) => {
  // 处理请求
});
```

## Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（既不是新功能也不是修复 bug）
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(user): 添加用户注册功能

- 实现用户注册接口
- 添加参数验证
- 更新用户模型

Closes #123
```

## 微信小程序开发规范

### 接口调用规范

1. **获取用户 OpenID**
   ```javascript
   // 小程序端调用
   wx.request({
     url: 'https://your-domain.com/api/wx_openid',
     success: (res) => {
       const openid = res.data.data.openid;
     }
   });
   ```

2. **错误处理**
   ```javascript
   wx.request({
     url: 'https://your-domain.com/api/users',
     fail: (error) => {
       wx.showToast({
         title: '网络请求失败',
         icon: 'none'
       });
     }
   });
   ```

### 安全规范

1. **不要在小程序端存储敏感信息**
2. **所有请求都应通过 HTTPS**
3. **使用微信提供的加密接口处理敏感数据**
4. **定期更新小程序和后端服务的依赖包**

## 测试规范

### 单元测试

```javascript
// 使用 Jest 或 Mocha 进行测试
describe('User API', () => {
  test('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ openid: 'test_openid' });
    
    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
  });
});
```

### 测试覆盖率

- 关键业务逻辑测试覆盖率应达到 80% 以上
- 工具函数测试覆盖率应达到 90% 以上

## 安全规范

1. **输入验证**: 所有用户输入都必须验证
2. **SQL 注入防护**: 使用 ORM（Sequelize）的参数化查询
3. **XSS 防护**: 对输出进行适当转义
4. **敏感信息**: 不要在代码中硬编码密码、密钥等敏感信息
5. **依赖安全**: 定期更新依赖包，修复已知漏洞

## 性能优化

1. **数据库查询优化**
   - 为常用查询字段添加索引
   - 避免 N+1 查询问题
   - 使用分页查询大数据集

2. **缓存策略**
   - 对不常变化的数据使用缓存
   - 合理设置缓存过期时间

3. **日志记录**
   - 生产环境关闭详细的 SQL 日志
   - 使用合适的日志级别

## 代码审查清单

提交代码前请检查：

- [ ] 代码符合命名规范
- [ ] 添加了必要的注释
- [ ] 进行了错误处理
- [ ] 完成了参数验证
- [ ] 测试通过
- [ ] 没有遗留的 console.log
- [ ] 没有硬编码的配置信息
- [ ] API 响应格式统一
- [ ] 提交信息符合规范

---

本文档会随项目发展持续更新，请定期查阅最新版本。
