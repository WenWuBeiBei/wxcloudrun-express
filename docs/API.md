# API 接口文档

文武贝贝工具集 API 接口文档。

## 基础信息

- **Base URL**: `https://your-domain.com`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用说明

### 请求头

所有 API 请求建议包含以下请求头：

```http
Content-Type: application/json
Accept: application/json
```

微信小程序调用时会自动包含：

```http
X-WX-SOURCE: <来源标识>
X-WX-OPENID: <用户OpenID>
```

### 响应格式

所有接口统一使用以下响应格式：

#### 成功响应

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    // 响应数据
  }
}
```

#### 错误响应

```json
{
  "code": -1,
  "message": "错误描述",
  "error": "详细错误信息（可选）"
}
```

#### 分页响应

```json
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

### 错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 0 | 成功 | - |
| -1 | 通用错误 | 查看 message 字段了解详情 |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 需要登录或重新授权 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 资源不存在 | 检查请求路径 |
| 500 | 服务器内部错误 | 联系技术支持 |

## API 接口列表

### 1. 健康检查

检查服务运行状态。

**接口地址**: `GET /api/health`

**请求参数**: 无

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

**调用示例**:

```bash
curl -X GET https://your-domain.com/api/health
```

```javascript
// 微信小程序调用
wx.request({
  url: 'https://your-domain.com/api/health',
  method: 'GET',
  success(res) {
    console.log('服务状态:', res.data);
  }
});
```

---

### 2. 获取微信 OpenID

获取当前小程序用户的 OpenID。

**接口地址**: `GET /api/wx_openid`

**请求说明**: 
- 仅支持微信小程序调用
- 需要包含微信云托管自动注入的请求头

**请求参数**: 无

**响应示例**:

成功响应：
```json
{
  "code": 0,
  "data": {
    "openid": "oABC123xyz456"
  }
}
```

失败响应（非小程序调用）：
```json
{
  "code": -1,
  "message": "非微信小程序调用"
}
```

**调用示例**:

```javascript
// 微信小程序调用
wx.request({
  url: 'https://your-domain.com/api/wx_openid',
  method: 'GET',
  success(res) {
    if (res.data.code === 0) {
      const openid = res.data.data.openid;
      console.log('OpenID:', openid);
      // 保存到本地存储
      wx.setStorageSync('openid', openid);
    }
  }
});
```

---

## 工具接口模板

以下是添加新工具接口的模板，供开发时参考。

### 模板：创建工具项

**接口地址**: `POST /api/tools`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 工具名称 |
| description | string | 否 | 工具描述 |
| category | string | 是 | 工具分类 |

**请求示例**:

```json
{
  "name": "示例工具",
  "description": "这是一个示例工具",
  "category": "utility"
}
```

**响应示例**:

```json
{
  "code": 0,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "示例工具",
    "description": "这是一个示例工具",
    "category": "utility",
    "createdAt": "2026-01-04T11:20:00.000Z"
  }
}
```

---

### 模板：获取工具列表

**接口地址**: `GET /api/tools`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10 |
| category | string | 否 | 工具分类筛选 |

**请求示例**:

```
GET /api/tools?page=1&pageSize=10&category=utility
```

**响应示例**:

```json
{
  "code": 0,
  "message": "查询成功",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "示例工具",
        "description": "这是一个示例工具",
        "category": "utility",
        "createdAt": "2026-01-04T11:20:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 模板：获取工具详情

**接口地址**: `GET /api/tools/:id`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 工具 ID |

**响应示例**:

```json
{
  "code": 0,
  "message": "查询成功",
  "data": {
    "id": 1,
    "name": "示例工具",
    "description": "这是一个示例工具",
    "category": "utility",
    "createdAt": "2026-01-04T11:20:00.000Z",
    "updatedAt": "2026-01-04T11:20:00.000Z"
  }
}
```

---

### 模板：更新工具

**接口地址**: `PUT /api/tools/:id`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 工具 ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 否 | 工具名称 |
| description | string | 否 | 工具描述 |
| category | string | 否 | 工具分类 |

**请求示例**:

```json
{
  "name": "更新后的工具名称",
  "description": "更新后的描述"
}
```

**响应示例**:

```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "更新后的工具名称",
    "description": "更新后的描述",
    "category": "utility",
    "updatedAt": "2026-01-04T12:00:00.000Z"
  }
}
```

---

### 模板：删除工具

**接口地址**: `DELETE /api/tools/:id`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 工具 ID |

**响应示例**:

```json
{
  "code": 0,
  "message": "删除成功"
}
```

---

## 开发指南

### 添加新接口

1. 在 `routes/` 目录下创建或编辑对应的路由文件
2. 实现接口逻辑
3. 添加参数验证
4. 更新本文档
5. 编写单元测试

### 参数验证示例

```javascript
// middleware/validator.js
const validateToolCreate = (req, res, next) => {
  const { name, category } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      code: 400,
      message: 'name 参数无效'
    });
  }
  
  if (!category || typeof category !== 'string') {
    return res.status(400).json({
      code: 400,
      message: 'category 参数无效'
    });
  }
  
  next();
};
```

### 错误处理示例

```javascript
// routes/tools.js
app.post('/api/tools', validateToolCreate, async (req, res) => {
  try {
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
