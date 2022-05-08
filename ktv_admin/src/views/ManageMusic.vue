<template>
  <div class="manage-music">
    <audio ref="musicPlayer" :src="toListenSrc" @ended="ended" autoplay preload="load"></audio>
    <Row style="padding:20px 60px 20px 40px;">
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
    <div style="width:100%;background-color:yellowgreen;">
      <el-table :data="allSongs" class="song-table" style="width:100%;" border>
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="_id" label="歌曲id" align="center" width="240"></el-table-column>
        <el-table-column prop="songName" label="歌曲名" align="center" width="200"></el-table-column>
        <el-table-column prop="artist" label="歌手" align="center" width="170"></el-table-column>
        <el-table-column prop="src" label="歌曲地址" align="center" width="200"></el-table-column>
        <el-table-column  label="歌曲封面" align="center" width="120">
          <template slot-scope="scope"> 
            <Avatar :src="`http://localhost:3000/api/music/poster?img=${scope.row.poster}`" size="large"></Avatar>
          </template>
        </el-table-column>
        <el-table-column prop="style" label="歌曲风格" align="center" width="120"></el-table-column>
        <el-table-column prop="playcount" label="播放次数" align="center" width="80"></el-table-column>
        <el-table-column prop="date" label="更新日期" align="center" width="200"></el-table-column>
        <el-table-column  label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="warning" size="small" circle icon="el-icon-star-off" @click="linkSongs(scope.row)"></el-button>
            <el-button type="primary" size="small" circle icon="el-icon-edit" @click="onEditSong(scope.row)"></el-button>
            <el-button type="danger" size="small" circle icon="el-icon-delete" @click="onDeleteSong(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getAllSongRoute} from "@/network/manage_music.js";
export default {
  name:"",
  data(){
    return{
      toListenSrc:"",
      searchName:"",
      toListen:false,
      toListenPoster:"",
      toListenPoster:"",
      allSongs:[{},{}],
    }
  }, 
  created(){
    this.getAllSong();
  },
  methods:{
      async getAllSong(){
      const {data:res} = await getAllSongRoute('music/all');

          this.allSongs = res.data.filter(item => delete item.__v);
        
      }
  }
}
</script>

<style>

</style>