/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 * @param {Object} res - Express response 对象
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 */
function success(res, data = null, message = '操作成功') {
  return res.json({
    code: 0,
    message,
    data
  });
}

/**
 * 失败响应
 * @param {Object} res - Express response 对象
 * @param {string} message - 错误消息
 * @param {number} code - 错误码
 * @param {number} status - HTTP 状态码
 */
function fail(res, message = '操作失败', code = -1, status = 400) {
  return res.status(status).json({
    code,
    message
  });
}

/**
 * 分页响应
 * @param {Object} res - Express response 对象
 * @param {Array} items - 数据列表
 * @param {number} total - 总数
 * @param {number} page - 当前页
 * @param {number} pageSize - 每页数量
 */
function paginate(res, items, total, page, pageSize) {
  return res.json({
    code: 0,
    message: '查询成功',
    data: {
      items,
      total,
      page,
      pageSize
    }
  });
}

module.exports = {
  success,
  fail,
  paginate
};
