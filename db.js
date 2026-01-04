const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const hasDBConfig = Boolean(MYSQL_USERNAME && MYSQL_PASSWORD && MYSQL_ADDRESS);
const [host, port] = MYSQL_ADDRESS.split(":");

// 数据库名称
const DB_NAME = "wenwubeibei";

// 当未提供数据库配置时跳过实例化，方便本地快速启动
const sequelize = hasDBConfig
  ? new Sequelize(DB_NAME, MYSQL_USERNAME, MYSQL_PASSWORD, {
      host,
      port,
      dialect: "mysql",
      logging: false, // 生产环境建议关闭 SQL 日志
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      timezone: "+08:00", // 设置时区为北京时间
    })
  : null;

// 数据库初始化方法
async function init() {
  if (!sequelize) {
    console.warn("未配置数据库连接信息，已跳过数据库初始化");
    return;
  }

  try {
    await sequelize.authenticate();
    console.log("数据库连接成功");
  } catch (error) {
    console.error("数据库连接失败:", error);
    throw error;
  }
}

// 导出数据库实例和初始化方法
module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  init,
};
