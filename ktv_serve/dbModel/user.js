const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = mongoose.Schema({
  order_id:{
    require:true,
    type:String
  },
  startTime:{
    require:true,
    type:String
  },
  endTime:{
    require:true,
    type:String
  },
  totalMoney: {
    require:true,
    type:String
  },
  account: {
    require:true,
    type:String
  },
  password: {
    require:true,
    type:String,
    set(val){
      return bcrypt.hashSync(val,10);
    }
  },
  publicpwd: {//明文，防止忘记密码
    require:true,
    type:String
  }
});

module.exports = mongoose.model('user_and_orders',userModel);