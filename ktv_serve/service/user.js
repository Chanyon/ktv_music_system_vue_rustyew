/**
 * 用户登录
 */

const router = require("express").Router();
const path = require("path"),
fs = require("fs"),
bcrypt = require("bcrypt"),
jwt = require("jsonwebtoken"),
passport = require("passport");

const UserOrOrders = require("../dbModel/user");
const jwt_key = require("../secret/jwtkey").KEYORSECRET;
const isBadAccount = require("../config/isBadAccount");

router.post("/login",async (req, res)=>{
  try {
    const account = req.body.account;
    const userAcc = await UserOrOrders.findOne({account});
    if(!userAcc) return res.status(406).json({status:406,msg:"账号或密码错误"});
    let flag = await isBadAccount(req.body);
    if(flag){
      const password = req.body.password;
      const isValidPwd = bcrypt.compareSync(password,userAcc.password);
      if(!isValidPwd){
        return res.send({status:406,msg:"账号或密码错误"});
      }else{
        const rule = {
          id:userAcc._id,
          account:userAcc.account,
          startTime:userAcc.startTime,
          endTime:userAcc.endTime,
          order_id:userAcc.order_id,
          money:userAcc.money
        };
        jwt.sign(rule,jwt_key,(err,token)=>{
          if(err){
              return res.send({status:500,msg:"账号或密码错误"});            
          }else{
            return res.send({status:200,msg:"登录成功",token:token});
          }
        })
      }
    }else{
      return res.send({status:401,msg:"账号过期，请联系管理员"});
    }

  } catch (error) {
    return res.send({status:500,msg:"服务器内部错误"});
  }
})

module.exports = router;

