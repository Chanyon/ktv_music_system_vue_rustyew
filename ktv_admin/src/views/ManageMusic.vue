<template>
  <div class="manage-music">
    <audio ref="musicPlayer" :src="toListenSrc" @ended="ended" autoplay preload="load"></audio>
    <Row style="padding:20px 60px 20px 40px">
      <Col :span="5">
        <Input prefix="ios-musical-notes" 
        clearable 
        v-model="searchName"
        @keypress.enter.native="searchSong"
        placeholder="按歌名、歌手、搜索歌曲..."
        style="width:auto"/>
      </Col>
      <Col :span="3">
        <Button type="primary" 
        style="margin-left:5px;"
        @click="getAllSong">
        所有歌曲
        </Button>
      </Col>
      <Col :span="4">
        <Button type="success" 
        style="margin-left:5px;"
        @click="toListen=true">
        试听歌曲
        </Button>
      </Col>
      <Col :span="12" style="text-align:right;">
        <Avatar id="music-poster" 
        class="listen-poster" 
        :src="toListenPoster" 
        v-if="toListenPoster"
        @click.native="operaMusic"
        size="lager"
        style="margin-right:40px;"></Avatar>
        <Button type="primary" 
        @click="showAddSongBtn">
        添加歌曲
        </Button>
      </Col>
    </Row>
    <!-- 所有歌曲数据 -->
    <div style="width:100vw;height:100vh;background-color:yellowgreen;">
    </div>
  </div>
</template>

<script>
export default {
  name:"",
  data(){
    return{
      toListenSrc:"",
      searchName:"",
      toListen:false,
      toListenPoster:"",
      toListenPoster:"",
    }
  }
}
</script>

<style>

</style>