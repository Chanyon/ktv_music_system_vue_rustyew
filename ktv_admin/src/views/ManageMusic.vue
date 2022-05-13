<template>
  <div class="manage-music">
    <!-- <audio ref="musicPlayer" :src="toListenSrc" @ended="ended" autoplay preload="load"></audio> -->
    <Row style="padding: 20px 60px 20px 40px">
      <Col :span="5">
        <Input
          prefix="ios-musical-notes"
          clearable
          v-model="searchName"
          @keypress.enter.native="searchSong"
          placeholder="按歌名、歌手、搜索歌曲..."
          style="width: auto"
        />
      </Col>
      <Col :span="3">
        <Button type="primary" 
        style="margin-left:5px;"
        @click="getAllSong">
        所有歌曲
        </Button>
      </Col>
    <!-- <Col :span="4">
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
      </Col>  -->
    </Row>
    <!-- 所有歌曲数据 -->
    <div style="width: 100vw; background-color: yellowgreen">
      <el-table :data="allSongs" class="song-table" style="width: 100%" border>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="_id"
          label="歌曲id"
          align="center"
          width="240"
        ></el-table-column>
        <el-table-column
          prop="songName"
          label="歌曲名"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="artist"
          label="歌手"
          align="center"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="src"
          label="歌曲地址"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="歌曲封面" align="center" width="120">
          <template slot-scope="scope">
            <Avatar
              :src="`http://localhost:3000/api/music/poster?img=${scope.row.poster}`"
              size="large"
            ></Avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="style"
          label="歌曲风格"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="playcount"
          label="播放次数"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="date"
          label="更新日期"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              circle
              icon="el-icon-star-off"
              @click="linkSongs(scope.row)"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              circle
              icon="el-icon-edit"
              @click="onEditSong(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              circle
              icon="el-icon-delete"
              @click="onDeleteSong(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <Row>
      <Col span="24" style="text-align: right; padding: 10px">
        <el-pagination
          v-if="'paginations.total > 0'"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          page_sizes="[8,15,20,25]"
          :page_size="paginations.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginations.total"
          :current-page.sync="paginations.page_index"
        >
        </el-pagination>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getAllSongRoute, searchMusicByName } from "@/network/manage_music.js";
export default {
  name: "ManageMusic",
  data() {
    return {
      toListenSrc: "",
      searchName: "",
      toListen: false,
      toListenPoster: "",
      toListenPoster: "",
      allSongs: [],
      allTableData: [],
      paginations: {
        //分页
        page_index: 1,
        total: 0,
        page_size: 10,
        page_sizes: [8, 15, 20, 25],
        layout: "total,sizes,prev,pager,next,jumper",
      },
    };
  },
  created() {
    this.getAllSong();
  },
  methods: {
    async getAllSong() {
      const { data: res } = await getAllSongRoute("music/all");
      this.allSongs = res.data.filter((item) => delete item.__v);
      this.allTableData = res.data;
      this.setPagination();
    },
    // 歌曲搜索
    async searchSong() {
      if (this.searchName.trim().length === 0) {
        return this.$message.error("歌名不能为空!");
      } else {
        const {data:ret}= await searchMusicByName("music/search/byname", {
          searchName: this.searchName,
        });
        if(ret.status === 200) {
          this.allSongs = this.allTableData = ret.data;
          this.setPagination();
        }else{
        return this.$message.error(ret.msg);
        }
      }
    },
    handleCurrentChange(page) {
      let sort_num = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, idx) => {
        return idx >= sort_num;
      });
      this.allSongs = table.filter(
        (item, idx) => idx < this.paginations.page_size
      );
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      // this.allSongs = this.allSongs.filter((item, idx) => idx < page_size);
      this.setPagination();
    },
    setPagination() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.allSongs = this.allTableData.filter(
        (item, idx) => idx < this.paginations.page_size
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.managemusic {
  width: 100%;
  height: 100%;
  padding: 20px 60px;

  .listen-poster {
    cursor: pointer;
    animation: poster 15s linear infinite;
  }
  @keyframes poster {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.toListen-link {
  cursor: pointer;
  &:hover {
    color: rgb(223, 107, 72);
  }
}
</style>