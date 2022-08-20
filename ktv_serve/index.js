/**
 * @description 系统入口
 * @Date:2022/04/25
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();

// 配置
require('./mongodb/db');//数据库链接
require('./config/passportVlidate')(passport);

// 中间件
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());
// 路由
const user = require('./service/user');
app.use("/api/user", user);   // 用户相关路由
const musicRouters = require('./service/music');
app.use("/api/music", musicRouters);
const adminRouters = require('./service/admin');
app.use("/api/admin", adminRouters);
const safecodeRoute = require('./service/safecode');
app.use("/api/safecode",safecodeRoute);

// 404
app.get("*",(req, res) =>{
  res.sendFile(path.resolve(__dirname,"static/view/404.html"));
})

app.listen(3000,err => {
  console.log(err);
  console.log("Serve is running on port 3000.");
})