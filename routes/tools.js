const express = require("express");
const { paginate, fail } = require("../utils/response");

const router = express.Router();

// 工具列表占位：返回空列表，等待业务接入
router.get("/", (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 50);

  paginate(res, [], 0, page, pageSize);
});

// 其他未实现的工具接口统一提示未实现
router.all("*", (req, res) => {
  fail(res, "工具模块尚未实现，请在 routes/tools.js 中补充业务逻辑", 501, 501);
});

module.exports = router;
