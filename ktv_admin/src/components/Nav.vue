<template>
  <div class="nav">
    <Menu mode="horizontal" :theme="theme">
      <MenuItem name="0">
      <div class="nav-logo" style="height:60px">后台管理系统</div>
      </MenuItem>
      <MenuItem name="2">
      <div class="nav-current__time">{{ nowTime }}</div>
      </MenuItem>
      <MenuItem class="opera-btn" name="1">
      <Dropdown trigger="click">
        <a href="javascript:void(0)">
          <Avatar src="../assets/logo.png" />
          <Icon type="ios-arrow-down" style="margin-left:5px;color:#bbb;"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="goIndex">你好，{{ adminInfo.username }}</DropdownItem>
          <DropdownItem @click.native="goManageMusic">歌曲管理</DropdownItem>
          <DropdownItem @click.native="goAdminLikes">推荐歌曲</DropdownItem>
          <DropdownItem @click.native="goUserService">开机服务</DropdownItem>
          <DropdownItem @click.native="allorders">订单查询</DropdownItem>
          <DropdownItem @click.native="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </MenuItem>
    </Menu>
  </div>
</template>

<script>

export default {
  name: 'Nav',
  data() {
    return {
      theme: "dark",
      nowTime: "",
      avatar: "../assets/logo.png",
      adminInfo:{
        username: "admin",
      }
    }
  },
  computed: {
  },
  created() {
    this.getAdminInfo();
    this.currentTime();
  },
  methods: {
    goIndex() {
      this.$router.push("/admin/index");
    },
    allorders() {
      this.$router.push("/admin/allorders");
    },
    goUserService() {
      this.$router.push("/admin/user/service");
    },
    goManageMusic() {
      this.$router.push("/admin/manage/music");
    },
    goAdminLikes() {
      this.$router.push("/admin/music/likes");
    },
    currentTime() {
      setInterval(() => {
        this.nowTime = new Date().toUTCString();
      }, 1000);
    },
    logout() {
      this.$confirm('确定退出吗？每一片贫瘠的土地都需要坚定的挖掘者！', '退出提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch("clearAdminAuthorization");
        this.$router.push("/login");
      }).catch(() => { })
    },
    getAdminInfo() {
      this.adminInfo = this.$store.getters.adminInfo;
    }
  }
}
</script>

<style scoped lang="scss">
.nav {
  .opera-btn {
    position: absolute;
    right: 120px;
  }

  .nav-current__time {
    font-size: 16px;
    color: rgb(173, 160, 160);
    text-align: right;
  }

  .nav-logo {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: rgb(192, 190, 190);
    font-size: 30px;
    text-align: center;
    font-family: "微软雅黑";
  }
}
</style>
