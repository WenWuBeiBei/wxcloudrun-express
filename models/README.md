# 数据模型目录

此目录用于存放 Sequelize 数据模型定义。

## 创建新模型

在此目录下创建新的模型文件，例如 `user.js`:

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

/**
 * 用户模型
 */
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
    comment: '用户头像URL'
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

## 使用模型

在路由或控制器中导入并使用模型：

```javascript
const User = require('../models/user');

// 创建用户
const user = await User.create({
  openid: 'xxx',
  nickname: '张三'
});

// 查询用户
const user = await User.findOne({
  where: { openid: 'xxx' }
});

// 更新用户
await User.update(
  { nickname: '李四' },
  { where: { id: 1 } }
);

// 删除用户
await User.destroy({
  where: { id: 1 }
});
```

## 数据库同步

在 `db.js` 中已经提供了数据库初始化方法。开发环境可以使用 `sync()` 方法同步模型到数据库：

```javascript
// 在 db.js 的 init() 函数中
await sequelize.sync({ alter: true });
```

**注意**：生产环境建议使用数据库迁移工具，而不是直接使用 `sync()`。

## 参考资料

- [Sequelize 官方文档](https://sequelize.org/docs/v6/)
- [Sequelize 模型定义](https://sequelize.org/docs/v6/core-concepts/model-basics/)
- [Sequelize 数据类型](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)
