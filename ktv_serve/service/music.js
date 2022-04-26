const router = require('express').Router(),
fs = require('fs'),
path = require('path'),
passport = require('passport');

const Music = require('../dbModel/music');

//获取所有歌曲
router.get('/all',async(req,res) => {
  try {
    const musicAll = await Music.find();
    if(musicAll.length > 0){
      return res.send({status:200,data:musicAll,msg:"获取成功"});
    }
    return res.json({status:201,data:"",msg:"获取失败"});
  } catch (error) {
    console.log(error);
    return res.json({status:500,data:"",msg:"Error Serve"});
  }
});

// 通过歌名搜索歌曲
router.post("/search/byname",async(req,res) => {
  const songName = req.body.searchName.trim();
  try {
    const getSong = await Music.find({songName:{$regex:songName,$options:'i'}});
    if(getSong){
      return res.send({status:200,msg:"获取成功",data:getSong});
    }else{
      Music.find({artist:{$regex:songName,$options:"i"}})
      .then(artist =>{
        res.send({status:200,msg:"获取成功",data:artist})
      })
    }
  } catch (error) {
    
  }
})

// user操作




module.exports = router;