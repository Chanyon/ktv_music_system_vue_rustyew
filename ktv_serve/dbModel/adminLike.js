// ktv推荐歌曲管理员操作

const mongoose = require('mongoose');
const adminLikeModel = mongoose.Schema({
  s_id:{
    require:true,
    type:String
  }
})

module.exports = mongoose.model("AdminLike",adminLikeModel);