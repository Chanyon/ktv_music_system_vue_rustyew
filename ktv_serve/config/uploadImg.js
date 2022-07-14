const fs = require('fs');
const path = require('path');
const formidable = require('formidable'); //上传文件
const formatTime = require('silly-datetime'); //格式化数据

module.exports = (req,res) => {
  let form = new formidable.IncomingForm({
    encoding:"utf-8",
    uploadDir:path.join(__dirname,'../static/poster'),//set upload dir
    keepExtensions:true,
    maxFieldsSize:20*1024*1024 //file size
  });

  form.parse(req,(err,fields,files) => {
    let {filepath,size,mimetype} = files.file;
    // console.log(files.file.filepath);
    if(err) {
      return res.status(500).json({status:500,msg:"服务器内部错误"});
    }
    if(size > form.maxFieldsSize){
      fs.unlink(filepath);
      return res.status(500).json({status:500,msg:"图片不能超过5M"});
    }
    let extName = "";
    switch(mimetype) {
      case "image/png":
        extName = "png";
        break;
      case "image/x-png":
        extName = "png";
        break;
      case "image/jpg":
        extName = "jpg";
        break;
      case "image/jpeg":
        extName = "jpeg";
        break;
    }
    if(extName.length === 0){
      return res.status(412).json({status:412,msg:"仅支持jpg和png格式图片"});
    }
    let time = formatTime.format(new Date(),"YYYYMMDDHHmmss");
    let num = Math.floor(Math.random()*8999 + 10000);
    let imageName = `${time}_${num}.${extName}`;
    let newPath = form.uploadDir + "/" + imageName;
    fs.rename(filepath,newPath,(err)=>{
      if(err){
        return res.status(412).json({status:412,msg:"上传图片失败"});
      }else{
        return res.send({status:200,msg:"上传图片成功",data:{poster:imageName}});
      }
    });
  })
}