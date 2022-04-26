<template>
  <div class="login">
    <div class="login-title">
      后台管理系统
    </div>
    <div class="form-box">
      <el-form class="login-form" label-position="top" size="small" :inline-message="inlinemessages" :model="loginForm"
        :rules="loginRule" ref="loginForm" label-width="100px">
        <el-form-item label="Email address" prop="email">
          <el-input type="text" v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="Security Code" prop="inputCaptcha">
          <div class="yzm">
            <el-input style="width:150px;" v-model="inputCaptcha" placeholder="验证码"></el-input>
            <img width="80" style="background:#EEE9E9;margin-left:30px;" ref="captcha" height="32" :src="captchaVal"
              @click="refreshCaptcha">
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="submitForm('loginForm')">Sign in</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode"
export default {
  name: "Login",
  data() {
    const validateCaptcha = (rule, value, callback) => {
      if (!this.inputCaptcha.trim().length === 0) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    }
    return {
      inline: true,
      inlinemessages: false,
      loginForm: {
        email: "",
        password: ""
      },
      loginRule: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6-16之间", trigger: "blur" }
        ],
        inputCaptcha: [
          { required: true, validator: validateCaptcha, trigger: "blur" }
        ]
      },
      inputCaptcha: "",
      captchaVal: "",
    }
  },
  created() {
    this.getCapt();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {

        }
        setTimeout(async () => {
          if (this.inputCaptcha.toLowerCase() === this.getCookie("captcha")) {
            const { data: ret } = await this.$http.post("http://localhost:3000/api/admin/account/login", this.loginForm);
            const token = ret.token;
            const decoded = jwt_decode(token);
            window.localStorage.setItem("adminToken", token);
            this.$store.dispatch("setAdminInfo", decoded);
            this.$store.dispatch("isAdminAuthorization", true);
            this.$message.success(`${decoded.username}登录成功`);
            this.$router.push("/");
          } else {
            this.$alert('验证码错误，', '验证失败', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${action}`
                });
              }
            });
          }
        }, 900);
      })
    },
    getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },
    refreshCaptcha() {
      this.getCapt();
    },
    async getCapt() {
      const { data: ret } = await this.$http.get("http://localhost:3000/api/safecode/test");
      // this.captchaVal = ret;
      console.log(ret);
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  cursor: default;
  padding: 40px 0px;
  color: red;
  // background-image: url(../assets/image/login-bg.jpg);
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;

  .login-title {
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
    font-size: 40px;
    color: skyblue;
    font-family: "隶书";
  }

  .form-box {
    width: 100%;
    margin: 0px auto;
    padding: 10px 5px;
    background-color: rgba(255, 255, 255, .9);
    border: 1px solid #cdcdcd;
    border-radius: 5px;

    .login-btn {
      width: 100%;
      background: linear-gradient(to bottom, rgba(47, 228, 89, 0.9), #26a744);
      font-weight: 600;
    }

    .login-btn:hover {
      background-color: rgb(94, 255, 132);
    }

    .yzm {
      display: flex;
      align-content: center;

      input {
        width: 160px;
        height: 32px;
        outline: none;
        border: 1px solid #eee;
        padding: 2px 15px;
        border-radius: 5px;
        font-size: 13px;
      }
      ::-webkit-input-placeholder{
        color: #bbb;
      }
      img:hover{
        cursor: pointer;
      }
    }
  }
}
</style>
