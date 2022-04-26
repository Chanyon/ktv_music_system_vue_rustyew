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
  req.session = captcha.text.toLowerCase();
  res.cookie('captcha', req.session);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(String(captcha.data));
  res.end();
})

module.exports = router;