// 获取验证码

const svgCaptcha = require('svg-captcha');
const router = require("express").Router();

router.get('/',(req, res) => {
  const captcha = svgCaptcha.create({
    inverse: false,
    fontSize:38,
    noise:3,
    width:80,
    height:32
  });
  // req.session = captcha.text.toLowerCase();
  // res.cookie('captcha', req.session);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.cookie('captcha',captcha.text.toLowerCase(),{
    expires:8 * 3600000
  });
  res.send(String(captcha.data));
  // res.end();
})
// res
//   .status(201)
//   .cookie('access_token', 'Bearer ' + token, {
//     expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
//   })
//   .cookie('test', 'test')
router.get('/test',(req, res) => {
  res.cookie('test', "aaa");
  res.send({status: 200,msg: 'test'})
})

module.exports = router;