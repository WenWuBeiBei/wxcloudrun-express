const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

// 数据库名称
const DB_NAME = "wenwubeibei";

// 创建 Sequelize 实例
const sequelize = new Sequelize(DB_NAME, MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql",
  logging: false, // 生产环境建议关闭SQL日志
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00' // 设置时区为北京时间
});

// 数据库初始化方法
async function init() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log("数据库连接成功");
    
    // 同步所有模型（开发环境使用，生产环境建议使用迁移）
    // await sequelize.sync({ alter: true });
    
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
