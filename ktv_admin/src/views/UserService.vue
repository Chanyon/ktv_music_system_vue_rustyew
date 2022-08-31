<template>
  <div class="user-service">
    <el-form :model="ruleForm" status-icon label-width="120px" class="rule-form">
      <el-form-item label="时长:" required>
        <el-select v-model="timeLong" clearable placeholder="请选择时长">
          <el-option v-for="item in timeOptions" :key="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总金额：">
        <span>{{ timeLong ? ruleForm.totalMoney : 0 }}元</span>
      </el-form-item>
      <el-form-item style="" label="开户：">
        <el-button type="primary" @click="submitForm()">开户</el-button>
      </el-form-item>
      <el-form-item label="">
        <Row class="order-current" v-if="card.flag">
          <Card style="width: 350px">
            <h3>
              <Icon type="ios-checkmark-circle" style="color:green;">
              </Icon>
              开户成功
            </h3>
            <span>
              <Icon type="ios-loop-strong" style="color:green;">
              </Icon>
              创建时间：{{ card.currentTime }}
            </span>
            <div>
              <Icon type="ios-contact" />
              账号：<span style="padding: 0px 2px;color:#19be6b;font-weight:700;">{{ card.account }}</span>
            </div>
            <div>
              <Icon type="ios-key" />
              密码：<span style="padding: 0px 2px;color:#19be6b;font-weight:700;">{{ card.password }}</span>
            </div>
            <div>
              <Icon type="logo-bitcoin" />
              金额：<span style="padding: 0px 2px;color:#19be6b;font-weight:700;">{{ card.totalMoney }}</span>
            </div>
            <div>
              <Icon type="ios-copy" />
              订单编号：<span style="padding: 0px 2px;color:#19be6b;font-weight:700;">{{ card.order_id }}</span>
            </div>
          </Card>
        </Row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createAccount } from '../network/userService';
export default {
  name: "UserService",
  data() {
    return {
      ruleForm: {
        order_id: "",
        startTime: "",
        endTime: "",
        totalMoney: "30",
      },
      card: {
        account: "11111",
        password: "",
        totalMoney: 0,
        order_id: "",
        currentTime: "",
        flag: false,
      },
      timeLong: 1,
      timeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 23, 24],
    }
  },
  methods: {
    async submitForm() {
      // 略过密码验证
      const time = new Date();
      this.ruleForm.order_id = time.getTime() + `${Math.floor(Math.random() * 10000)}`;
      this.ruleForm.startTime = time.toLocaleString();
      this.ruleForm.endTime = new Date(this.timeLong * 60 * 60 * 1000 + new Date(time).getTime()).toLocaleString();

      const { data: ret } = await createAccount("admin/account/new", this.ruleForm);
      if (ret.status !== 200) {
        this.$message.error(ret.msg)
      }
      this.card = { ...ret.data };
      this.card.flag = true;
      this.card.currentTime = time;
      // this.$nextTick(()=>{
      //   // todo
      // })
      this.$message.success(ret.msg)
    }
  },
  watch: {
    timeLong(val) {
      this.ruleForm.totalMoney = Number(val * 30);
    }
  }
}
</script>

<style lang="scss" scoped>
.user-service {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background: darkgray;

  .rule-form {
    width: 600px;
    height: auto;
    margin-top: 20px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 900;
    padding: 10px 20px;
    background: #fff;
  }
  /* .order-current {
  } */
}
</style>