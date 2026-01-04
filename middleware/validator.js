/**
 * 参数验证中间件示例
 */

/**
 * 验证必填参数
 * @param {Array<string>} fields - 必填字段列表
 */
function validateRequired(fields) {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 400,
        message: `缺少必填参数: ${missingFields.join(', ')}`
      });
    }
    
    next();
  };
}

/**
 * 验证字符串类型参数
 * @param {string} field - 字段名
 * @param {Object} options - 验证选项
 */
function validateString(field, options = {}) {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined && typeof value !== 'string') {
      return res.status(400).json({
        code: 400,
        message: `参数 ${field} 必须是字符串类型`
      });
    }
    
    if (options.minLength && value.length < options.minLength) {
      return res.status(400).json({
        code: 400,
        message: `参数 ${field} 长度不能少于 ${options.minLength} 个字符`
      });
    }
    
    if (options.maxLength && value.length > options.maxLength) {
      return res.status(400).json({
        code: 400,
        message: `参数 ${field} 长度不能超过 ${options.maxLength} 个字符`
      });
    }
    
    next();
  };
}

/**
 * 验证数字类型参数
 * @param {string} field - 字段名
 * @param {Object} options - 验证选项
 */
function validateNumber(field, options = {}) {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined) {
      const num = Number(value);
      
      if (isNaN(num)) {
        return res.status(400).json({
          code: 400,
          message: `参数 ${field} 必须是数字类型`
        });
      }
      
      if (options.min !== undefined && num < options.min) {
        return res.status(400).json({
          code: 400,
          message: `参数 ${field} 不能小于 ${options.min}`
        });
      }
      
      if (options.max !== undefined && num > options.max) {
        return res.status(400).json({
          code: 400,
          message: `参数 ${field} 不能大于 ${options.max}`
        });
      }
    }
    
    next();
  };
}

module.exports = {
  validateRequired,
  validateString,
  validateNumber
};
