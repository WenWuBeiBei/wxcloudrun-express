# 配置文件目录

此目录用于存放应用配置文件。

## 配置管理

配置文件应该根据不同的功能模块进行划分，例如：

- `database.js` - 数据库配置
- `app.js` - 应用配置
- `logger.js` - 日志配置
- `wechat.js` - 微信相关配置

## 示例：数据库配置

创建 `config/database.js`:

```javascript
module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'wenwubeibei_dev',
    host: process.env.MYSQL_ADDRESS?.split(':')[0],
    port: process.env.MYSQL_ADDRESS?.split(':')[1] || 3306,
    dialect: 'mysql',
    logging: console.log,
    timezone: '+08:00'
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'wenwubeibei',
    host: process.env.MYSQL_ADDRESS?.split(':')[0],
    port: process.env.MYSQL_ADDRESS?.split(':')[1] || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

## 示例：应用配置

创建 `config/app.js`:

```javascript
module.exports = {
  // 应用端口
  port: process.env.PORT || 80,
  
  // 环境
  env: process.env.NODE_ENV || 'development',
  
  // 跨域配置
  cors: {
    origin: '*',
    credentials: true
  },
  
  // 日志配置
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined'
  }
};
```

## 使用配置

在代码中引入配置：

```javascript
const dbConfig = require('./config/database');
const appConfig = require('./config/app');

// 使用配置
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];
```

## 最佳实践

1. **环境变量优先**: 敏感信息从环境变量读取
2. **分环境配置**: 区分开发、测试、生产环境
3. **不提交敏感信息**: 不要将密码等敏感信息提交到版本控制
4. **使用默认值**: 为配置项提供合理的默认值
5. **文档化**: 为每个配置项添加清晰的注释

## 注意事项

- 配置文件中不要包含密码、密钥等敏感信息
- 使用 `.env` 文件存储敏感配置（已在 .gitignore 中排除）
- 不同环境使用不同的配置
