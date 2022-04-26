const fs = require('fs');
const path = require('path');
const formidable = require('formidable'); //上传文件
const formatTime = require('silly-datetime'); //格式化数据


module.exports = (req,res) => {
  let form = new formidable.IncomingForm({
    encoding:"utf-8",
    uploadDir:path.join(__dirname,'../static/music'),//set upload dir
    keepExtensions:true,
    maxFieldsSize:20*1024*1024 //file size
  });

  form.parse(req,(err,fields,files) => {
    let {filepath,size,mimetype} = files.someExpressFiles;
    if(err) {
      return res.status(500).json({status:500,msg:"服务器内部错误"});
    }
    if(size > form.maxFieldsSize){
      fs.unlink(filepath);
      return res.status(412).json({status:412,msg:"音频不能超过20M"});
    }
    let extName = '';
    switch(mimetype){
      case 'audio/mpeg':
        extName = 'mp3';
        break;
    }
    if(extName.length === 0){
      fs.unlink(filepath,()=>{});
      return res.status(412).json({status:412,msg:"只支持mp3格式音频"});
    }
    let time =  formatTime.format(new Date(),'YYYYMMDDHHmmss');
    let num = Math.floor(Math.random()*8999 + 10000);
    let songName = `${time}_${num}.${extName}`;
    let newPath = form.uploadDir + "/" + songName;
    let oldPath = filepath;
    console.log(newPath,oldPath);
    fs.rename(oldPath,newPath,(err)=>{
      if(err){
        return res.status(500).json({status:500,msg:"音频上传失败"});
      }else{
        res.send({status:200,msg:"上传成功",data:{src:songName}})
      }
    })
  })
}