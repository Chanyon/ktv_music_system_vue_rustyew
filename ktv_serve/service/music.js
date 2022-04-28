/**
 * music 相关api
 */
const router = require('express').Router(),
  fs = require('fs'),
  path = require('path'),
  passport = require('passport');

const Music = require('../dbModel/music');
const AdminLike = require('../dbModel/adminLike');
const isBadAccount = require('../config/isBadAccount');

//获取所有歌曲
router.get('/all', async (req, res) => {
  try {
    const musicAll = await Music.find();
    if (musicAll.length > 0) {
      return res.send({
        status: 200,
        data: musicAll,
        msg: "获取成功"
      });
    }
    return res.json({
      status: 201,
      data: "",
      msg: "获取失败"
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      data: "",
      msg: "Error Serve"
    });
  }
});

// 通过歌名搜索歌曲
router.post("/search/byname", async (req, res) => {
  const songName = req.body.searchName.trim();
  try {
    const getSong = await Music.find({
      songName: {
        $regex: songName,
        $options: 'i'
      }
    });
    if (getSong) {
      return res.send({
        status: 200,
        msg: "获取成功",
        data: getSong
      });
    } else {
      Music.find({
          artist: {
            $regex: songName,
            $options: "i"
          }
        })
        .then(artist => {
          res.send({
            status: 200,
            msg: "获取成功",
            data: artist
          })
        })
    }
  } catch (error) {

  }
})
// 根据ID获取歌曲
router.get("/nowmusic", async (req, res) => {
  try {
    const _id = req.query.id;
    const getMusicById = await Music.findOne({
      _id
    });
    if (getMusicById) {
      res.sendFile(path.resolve(__dirname, "../static/music/" + getMusicById.src));
      const sum = parseInt(getMusicById.playcount) + 1;
      const count = {
        playcount: sum
      };
      await Music.findOneAndUpdate({
        _id: _id
      }, {
        $set: count
      }, {
        new: true
      });
    } else {
      return res.sendFile(path.resolve(__dirname, "../static/view/404.html"));
    }
  } catch (error) {

  }
})
// 获取歌曲海报封面
router.get("/poster", (req, res) => {
  // const exists = fs.existsSync(path.resolve(__dirname,"../static/poster/"+req.query.song))
  return res.sendFile(path.resolve(__dirname, "../static/poster/" + req.query.img));
})

// user操作
// 获取热歌
router.post("/hot", passport.authenticate("jwt", {
  session: false
}), async (req, res) => {
  try {
    const isBad = await isBadAccount(req.body);
    if (isBad) {
      const music = await Music.find();
      if (music) {
        music = music.sort((a, b) => {
          return b.playcount - a.playcount;
        });
        return res.send({
          status: 200,
          msg: "获取成功",
          data: music
        });
      }
    } else {
      return res.send({
        status: 400,
        msg: "账号过期，请联系前台",
        data: ""
      });
    }
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，请联系前台",
      data: ""
    });
  }
})

// 获取收藏歌曲
router.post("/user/adminlike", passport.authenticate("jwt", {
  session: false
}), async (req, res) => {
  try {
    if (isBadAccount(req.body)) {
      const musics = await Music.find();
      const adminLike = AdminLike.find();
      let result = [];
      musics.forEach(music => {
        adminLike.forEach(like_music => {
          if (music._id === like_music.s_id) {
            result.push(music);
          }
        });
      });
      return res.send({
        status: 200,
        msg: "获取成功",
        data: result
      });
    }else{
      return res.send({
        status: 400,
        msg: "账号过期，联系管理员",
        data: ""
      });
    }
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，联系管理员",
      data: ""
    });
  }
})

// 根据语种点歌
router.post("/language",passport.authenticate("jwt",{session:false}),async (req, res)=>{
  try {
    if(isBadAccount(req.body)){
      const language = req.body.language;
      const music = await Music.find({language});
      return res.send({status:200,msg:"获取成功",data:music});    
    }else{
      return res.send({status:400,msg:"账号过期，联系管理员",data:""});
    }
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，联系管理员",
      data: ""
    });
  }
})

// 根据风格点歌
router.post("/style", passport.authenticate("jwt",{session:false}),async (req, res)=>{
  try {
    if(isBadAccount(req.body)){
      const {style} = req.body;
      const music = await Music.find({style});
      return res.send({status:200,msg:"获取成功",data:music});
    }else{
      return res.send({status:400,msg:"账号过期，联系管理员",data:""});
    }
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，联系管理员",
      data: ""
    });
  }
})

// 根据明星点歌
router.post("/artist", passport.authenticate("jwt",{session:false}),async (req, res)=>{
  try {
    if(isBadAccount(req.body)){
      const {artist} = req.body;
      const music = await Music.find({artist});
      return res.send({status:200,msg:"获取成功",data:music});
    }else{
      return res.send({status:400,msg:"账号过期，联系管理员",data:""});
    }
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，联系管理员",
      data: ""
    });
  }
})
// 搜索歌曲
router.post("/search",passport.authenticate("jwt",{session:false}), async (req, res) => {
  try {
    const songName = req.body.searchName.trim();
    if(isBadAccount(req.body)){
      const getSong = await Music.find({
        songName: {
          $regex: songName,
          $options: 'i'
        }
      });
      if (getSong) {
        return res.send({
          status: 200,
          msg: "获取成功",
          data: getSong
        });
      } else {
        Music.find({
            artist: {
              $regex: songName,
              $options: "i"
            }
          })
          .then(artist => {
            res.send({
              status: 200,
              msg: "获取成功",
              data: artist
            })
          });
      }
    }else{
      return res.send({status:400,msg:"账号过期，联系管理员",data:""});
    }
    
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，联系管理员",
      data: ""
    });
  }
})

//用户获取所有歌曲
router.post("/all",passport.authenticate("jwt",{session:false}),async (req, res)=>{
  try {
    const musics = await Music.find();
    if(isBadAccount(req.body)){
      return res.send({status:200,msg:"获取成功",data:musics});
    }else{
      return res.send({status:400,msg:"账号过期，联系管理员",data:""});
    }
  } catch (error) {
    return res.send({
      status: 500,
      msg: "账号过期，联系管理员",
      data: ""
    });
  }
}) 

module.exports = router;