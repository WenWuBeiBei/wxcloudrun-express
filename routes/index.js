const express = require("express");
const { success, fail } = require("../utils/response");

const router = express.Router();

const SERVICE_NAME = process.env.SERVICE_NAME || "文武贝贝工具集";
const SERVICE_VERSION = process.env.SERVICE_VERSION || process.env.npm_package_version || "0.1.0";

// 健康检查
router.get("/health", (req, res) => {
  success(res, {
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    timestamp: new Date().toISOString(),
  }, "服务正常运行");
});

// 获取微信 OpenID（仅小程序内请求可用）
router.get("/wx/openid", (req, res) => {
  const source = req.headers["x-wx-source"];
  const openid = req.headers["x-wx-openid"];

  if (!source || !openid) {
    return fail(res, "仅支持微信小程序内调用", 400, 400);
  }

  success(res, { openid, source }, "获取成功");
});

// 工具模块路由占位
router.use("/tools", require("./tools"));

module.exports = router;
