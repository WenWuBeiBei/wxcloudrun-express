# API 接口文档

面向微信小程序的后端接口规范与示例。

## 通用约定

- Base URL：部署域名或云托管默认域名
- 传输协议：HTTPS（小程序必需）
- 数据格式：`application/json; charset=utf-8`
- 微信云托管会自动注入：`x-wx-source`、`x-wx-openid`

### 响应格式

成功：
```json
{ "code": 0, "message": "操作成功", "data": {} }
```

错误：
```json
{ "code": 400, "message": "缺少参数" }
```

分页：
```json
{ "code": 0, "message": "查询成功", "data": { "items": [], "total": 0, "page": 1, "pageSize": 10 } }
```

### 错误码

| code | 说明 |
| --- | --- |
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/未登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 501 | 功能未实现（占位路由） |

## 已内置接口

### 健康检查
- 路径：`GET /api/v1/health`
- 说明：检查服务可用性与版本
- 返回：`service`、`version`、`timestamp`
- 示例：
```bash
curl https://your-domain.com/api/v1/health
```

### 获取 OpenID
- 路径：`GET /api/v1/wx/openid`
- 说明：仅在小程序环境可用，读取云托管注入头获取用户 OpenID
- 请求头：`x-wx-source`、`x-wx-openid`（云托管自动注入）
- 异常：缺少头信息时返回 400

### 工具列表占位
- 路径：`GET /api/v1/tools`
- 说明：返回空列表，等待接入业务逻辑
- 查询参数：`page`（默认 1）、`pageSize`（默认 10，最大 50）
- 返回：空数组与分页元数据

## 扩展新接口的流程

1) 在 `routes/` 中创建/补充对应路由文件，并在 `routes/index.js` 中挂载
2) 使用 `middleware/validator.js` 进行参数校验
3) 使用 `utils/response.js` 统一返回格式
4) 若涉及数据，先在 `models/` 定义 Sequelize 模型并在 `db.js` 初始化时加载
5) 更新本文件与 README，补充请求/响应示例

## 小程序端调用示例

```javascript
// 健康检查
wx.request({ url: 'https://your-domain.com/api/v1/health' });

// 获取 OpenID（需在小程序内调用）
wx.request({
  url: 'https://your-domain.com/api/v1/wx/openid',
  success(res) {
    if (res.data.code === 0) {
      const openid = res.data.data.openid;
      wx.setStorageSync('openid', openid);
    }
  }
});
```

## 设计建议（接入新工具时）

- 遵循 RESTful，路径使用复数资源名：`/api/v1/tools`、`/api/v1/tools/:id`
- 返回体保持统一字段：`code`、`message`、`data`
- 分页接口固定参数：`page`、`pageSize`，返回 `items`、`total`
- 需要鉴权的接口，预留 Token 或会话方案（如结合小程序登录态）
- 对外暴露前在此文档补充：请求参数、示例响应、错误码说明
    const { name, description, category } = req.body;
    
    const tool = await Tool.create({
      name,
      description,
      category
    });
    
    res.json({
      code: 0,
      message: '创建成功',
      data: tool
    });
  } catch (error) {
    console.error('创建工具失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: error.message
    });
  }
});
```

## 测试指南

### 使用 cURL 测试

```bash
# 测试健康检查
curl -X GET https://your-domain.com/api/health

# 测试 POST 接口
curl -X POST https://your-domain.com/api/tools \
  -H "Content-Type: application/json" \
  -d '{"name":"测试工具","category":"utility"}'
```

### 使用 Postman 测试

1. 导入接口集合
2. 配置环境变量 `baseUrl`
3. 执行测试请求

## 版本历史

### v1.0.0 (2026-01-04)

- 初始版本
- 添加健康检查接口
- 添加获取 OpenID 接口

---

## 相关文档

- [开发规范](./DEVELOPMENT.md)
- [升级指南](./UPGRADE.md)
- [变更日志](./CHANGELOG.md)

---

最后更新时间：2026-01-04
