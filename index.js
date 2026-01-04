const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB } = require("./db");

const logger = morgan("tiny");

const app = express();

// 中间件配置
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 静态文件服务
app.use(express.static(path.join(__dirname, "public")));

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 健康检查接口
app.get("/api/health", async (req, res) => {
  res.send({
    code: 0,
    message: "服务正常运行",
    data: {
      service: "文武贝贝工具集",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    }
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send({
      code: 0,
      data: {
        openid: req.headers["x-wx-openid"]
      }
    });
  } else {
    res.status(400).send({
      code: -1,
      message: "非微信小程序调用"
    });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).send({
    code: 404,
    message: "接口不存在"
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    code: 500,
    message: "服务器内部错误"
  });
});

const port = process.env.PORT || 80;

async function bootstrap() {
  try {
    // 初始化数据库
    await initDB();
    console.log("数据库初始化成功");
    
    // 启动服务器
    app.listen(port, () => {
      console.log(`文武贝贝工具集服务启动成功，端口: ${port}`);
    });
  } catch (error) {
    console.error("服务启动失败:", error);
    process.exit(1);
  }
}

bootstrap();
