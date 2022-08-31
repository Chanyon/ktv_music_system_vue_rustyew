// 管理员管理模块

const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_key = require('../secret/jwtkey').KEYORSECRET;
const passport = require('passport');
const fs = require('fs');
const path = require('path');

//dbModel
const Admin = require('../dbModel/admin');
const Music = require('../dbModel/music');
const UserOrOrders = require('../dbModel/user');
const AdminLike = require('../dbModel/adminLike');

// 
const uploadMusic = require("../config/uploadMusic");
const uploadImg = require("../config/uploadImg");
const account = require("../config/newaccount");
const { route } = require("./music");


// 歌曲上传
router.post("/upload/music", (req, res) => {
  uploadMusic(req, res);
})

// 上传海报
router.post("/upload/poster", (req, res) => {
  uploadImg(req, res);
})
// 添加音乐,有bug待解决
router.post("/music/add", (req, res) => {
  let flag = false;
  Music.findOne({
      songName: req.body.songName
    })
    .then(hasOne => {
      if (hasOne) {
        console.log(hasOne);
        let ar1 = hasOne.artist === req.body.artist;
        let ar2 = hasOne.songName === req.body.songName;
        console.log(ar1, ar2);
        ar1 && ar2 ? flag = true : flag = false;
        console.log(flag);
        if (flag) {
          return res.status(422).json({
            status: 422,
            msg: "歌曲存在，请勿重复添加"
          });
        } else {
          const song = {
            songName: req.body.songName,
            artist: req.body.artist,
            poster: req.body.poster,
            src: req.body.src,
            language: req.body.language ? req.body.language : "",
            style: req.body.style,
            playcount: 0,
            date: new Date().toLocaleString('en-GB', {
              timeZone: "UTC"
            })
          };
          const newSong = new Music(song);
          newSong.save().then((ret) => {
            res.send({
              status: 200,
              msg: "添加成功",
              data: ret
            });
          }).catch(err => {
            res.status(500).json({
              status: 500,
              msg: "添加失败"
            });
          });
        }
      } else {
        const song = {
          songName: req.body.songName,
          artist: req.body.artist,
          poster: req.body.poster,
          src: req.body.src,
          language: req.body.language ? req.body.language : "",
          style: req.body.style,
          playcount: 0,
          date: new Date().toLocaleString('en-GB', {
            timeZone: "UTC"
          })
        };
        const newSong = new Music(song);
        newSong.save().then((ret) => {
          res.send({
            status: 200,
            msg: "添加成功",
            data: ret
          });
        }).catch(err => {
          res.status(500).json({
            status: 500,
            msg: "添加失败"
          });
        });
      }
    })
});
// 编辑歌曲,passport.authenticate("jwt",{session:false}),
router.post('/music/edit',async (req, res) => {
  const {
    _id,
    songName,
    artist,
    src,
    poster,
    language,
    style
  } = req.body;
  const newSong = {
    _id,
    songName,
    artist,
    src,
    poster,
    language,
    style
  };
  try {
    const uploadMusic = await Music.findOneAndUpdate({
      _id: _id
    }, {
      $set: newSong
    }, {
      new: true
    });
    if (uploadMusic) {
      res.send({status: 200, msg:"歌曲更新成功",data:uploadMusic});
    }
  } catch (error) {
    res.send({status: 500, msg:"歌曲更新失败"});
  }
})

router.post("/music/delete",async (req, res)=>{
  try {
    const {id} = req.body;
    const remove = await Music.findOneAndRemove({_id:id});
    if(remove !== null){
      res.send({status:200,msg:"删除成功"});
    }else{
      res.send({status:412,msg:"删除失败"});
    }
  } catch (error) {
    res.send({status:500,msg:"服务器未知错误"});
  }
})
// admin收藏歌曲
router.post("/adminlike/add",async (req, res)=>{
  try {
    const {s_id:id} = req.body;
    const isLike = await AdminLike.findOne({s_id:id});
    if(isLike !== null) {
      return res.send({status:412,msg:"收藏已存在"})
    }else{
      const likeSongId = {
        s_id:id,
      }
      const newLike = await AdminLike.create(likeSongId);
      if(newLike !== null){
        return res.send({status:200,msg:"收藏成功"});
      }
    }
  } catch (error) {
    return res.send({status:500,msg:"未知错误"});
  }
})

// 获取所有歌曲
// passport.authenticate("jwt",{session:false}),
router.get("/adminlike/all",async (req, res)=>{
  try {
    const allMusic = await Music.find();
    const allAdminLikeMusic = await AdminLike.find();
    let ret = [];
    allMusic.forEach(music =>{
      allAdminLikeMusic.forEach(like_music =>{
        if(music['_id'] == like_music['s_id']){
          ret.push(music);
        }
      });
    });
    return res.send({status:200,msg:"获取成功",data:ret});
  } catch (error) {
    return res.send({status:500,msg:"获取失败",data:""});
  }
})
// 通过id删除收藏的歌曲
router.post("/adminlike/del",async (req, res)=>{
  try {
    const delAdLike = await AdminLike.findOneAndRemove({s_id: req.body['_id']});
    if(delAdLike){
      return res.send({status:200,msg:"删除成功"});
    }else{
      return res.send({status:412,msg:"删除失败"});
    }
  } catch (error) {
    console.log(error);
    return res.send({status:500,msg:"删除失败"});
  }
})
// search music by id,待优化
// passport.authenticate("jwt",{session:false}),
router.post("/adminlike/search",async (req, res)=>{
  try {
    const songName = req.body.searchName.toLowerCase().trim();
    const searchMusicAll = await Music.find();
    const adminlikeMusic = await AdminLike.find();
    let ret = [],flag=false;
    if(searchMusicAll.length === 0 || adminlikeMusic.length === 0){
      return res.send({status:412,msg:"查询失败",data:""});
    }
    searchMusicAll.forEach(music=>{
      adminlikeMusic.forEach(like_music=>{
        if(music._id == like_music.s_id){
          !music.songName.toLowerCase().includes(songName) ? flag = true : ret.push(music);
          if(flag){
            !music.artist.includes(songName) ? flag=false : ret.push(music);
          }
        }
      })
    });
    return res.send({status:200,msg:"查询成功",data:ret});
  } catch (error) {
    return res.send({status:500,msg:"查询失败",data:""});
  }  
})

// 创建用户账号和密码
router.post("/account/new",async (req, res)=>{
  const newaccount = account();
  const orderInfo = {
    account:newaccount.account,
    password:newaccount.password,
    order_id:req.body.order_id,
    totalMoney: req.body.totalMoney
  };
  const user = {
    order_id:req.body.order_id,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    totalMoney: req.body.totalMoney,
    account:orderInfo.account,
    password:orderInfo.password,
    publicpwd:orderInfo.password
  };
  try {
    const newUser = await UserOrOrders.create(user);
    if(newUser){
      res.send({status:200,msg:"开户成功",data:orderInfo});
    }else{
      res.send({status:412,msg:"创建失败",data:""});
    }
  }catch (error) {
    console.log(error);
    res.send({status:500,msg:"创建失败",data:""});
  }
})
// 获取订单
router.get("/orders/all", async(req, res) => {
  try {
    const userOrOrders = await UserOrOrders.find();
    if(userOrOrders){
      return res.send({status:200,msg:"获取成功",data:userOrOrders});
    }else{
      return res.send({status:412,msg:"获取失败",data:""});
    }
  } catch (error) {
    return res.send({status:500,msg:"获取失败",data:""});
  }
})

// 删除订单
router.post("/orders/del", async (req, res)=>{
  try {
    const {_id} = req.body;
    const del = await UserOrOrders.findByIdAndRemove({_id});
    if(!del) return res.send({status:412,msg:"删除失败",data:""});
    return res.send({status:200,msg:"删除成功",data:""})
  } catch (error) {
    return res.send({status:500,msg:"删除失败",data:""});
  }
})

/**
 * 管理员注册
 */
router.post("/account/register", async (req, res)=>{
  try {
    const {email,username,password,identity} = req.body;
    const adminAcc = await Admin.findOne({email});
    if(adminAcc){
      return res.send({status:200,msg:"邮箱被占用",data:""});
    }else{
      const date = new Date().toLocaleString();
      const newAdminAcc = await Admin.create({email,username,password,identity,date});
      if(newAdminAcc) return res.send({status:200,msg:"注册成功"});
      return res.send({status:412,msg:"注册失败"});
    }
  } catch (error) {
    return res.send({status:500,msg:"注册失败"});
  }
})
router.post("/account/login", async (req, res)=>{
  try {
    const {email,password} = req.body;
    const isAdmin = await Admin.findOne({email});
    if(!isAdmin) return res.send({status:406,mas:"用户名错误或密码错误"});
    const isValidPwd = bcrypt.compareSync(password,isAdmin.password);
    if(!isValidPwd) return res.send({status:406,msg:"用户名错误或密码错误"});
    //set token 
    const rule = {
      id:String(isAdmin._id),
      email:isAdmin.email,
      username:isAdmin.username,
      date:isAdmin.date,
      identity:isAdmin.identity
    };
    // validate
    jwt.sign(rule,jwt_key,{expiresIn:36000},(err,token)=>{
      if(err){
        return res.status(500).json({status:500,msg:"未知错误"});
      }else{
        return res.send({status:200,msg:"登录成功",data:rule,token:token});
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:500,msg:"未知错误"});
  }
})

module.exports = router;