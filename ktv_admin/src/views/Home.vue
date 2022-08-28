<template>
  <div class="home">
    <div class="nav"> 
      <Nav></Nav> 
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue'
export default {
  name: 'Home',
  components: {
    Nav
  }
}
</script>

<style lang="scss" scoped>
  .home{
    display:flex;
    width:100vw;
    height:100vh;
    overflow:hidden;
    flex-direction: column;
    .nav{
      widows: 100%;
    }
    .content{
      flex:1;
      width:100%;
      height:100%;
      /* overflow-y:scroll; */
    }
  }
</style>
