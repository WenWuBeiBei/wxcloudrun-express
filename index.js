const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, sequelize } = require("./db");
const apiRouter = require("./routes");
const { fail } = require("./utils/response");

const app = express();

const SERVICE_NAME = process.env.SERVICE_NAME || "文武贝贝工具集";
const SERVICE_VERSION = process.env.SERVICE_VERSION || process.env.npm_package_version || "0.1.0";
const port = process.env.PORT || 80;

// 基础中间件配置
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// 静态文件与首页
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API 路由入口
app.use("/api/v1", apiRouter);

// 统一 404 处理
app.use((req, res) => fail(res, "接口不存在", 404, 404));

// 统一错误处理
app.use((err, req, res, next) => {
  console.error(err);
  fail(res, "服务器内部错误", 500, 500);
});

async function bootstrap() {
  try {
    await initDB();

    if (!sequelize) {
      console.warn("未检测到数据库配置，已跳过连接检测");
    } else {
      console.log("数据库初始化完成");
    }

    app.listen(port, () => {
      console.log(`${SERVICE_NAME} 已启动，端口: ${port}，版本: ${SERVICE_VERSION}`);
    });
  } catch (error) {
    console.error("服务启动失败:", error);
    process.exit(1);
  }
}

bootstrap();
