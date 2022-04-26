// 判断用户是否过期
const UserOrOrders = require("../dbModel/user");
module.exports = async (params)=>{
  let flag = false;
  try {
    const account = params.account;
    const user = await UserOrOrders.findOne({account});
    if(user){
      if(new Date().getTime() > new Date(`${user.endTime}`).getTime()){
        return flag;
      }else{
        // 合法用户
        return !flag;
      }
    }else{
      return flag;
    }
  } catch (error) {
    console.error(error);
    return flag;
  }
}