/**
 * 歌名，歌手，封面，地址，
 * 语种，风格，播放次数，更新时间
 */

const mongoose = require('mongoose');

const musicModel = mongoose.Schema({
  songName: {
    require:true,
    type:String
  },
  artist: {
    require:true,
    type:String
  },
  poster:{
    require:true,
    type:String
  },
  src:{
    require:true,
    type:String
  },
  language: {
    require:true,
    type:String
  },
  style: {
    require:true,
    type:String
  },
  playcount: {
    type:String
  },
  date:{
    require:true,
    type:String
  }
});

module.exports = mongoose.model("Music",musicModel);