<template>
  <div class="manage-music">
    <audio ref="musicPlayer" :src="toListenSrc" @ended="ended" autoplay preload="load"></audio>
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
        <Button type="primary" style="margin-left: 5px" @click="getAllSong">
          所有歌曲
        </Button>
      </Col>
      <Col :span="4">
        <Button
          type="success"
          style="margin-left: 5px"
          @click="toListen = true"
        >
          试听歌曲
        </Button>
      </Col>
      <Col :span="12" style="text-align: right">
        <Avatar
          id="music-poster"
          class="listen-poster"
          :src="toListenPoster"
          v-if="toListenPoster"
          @click.native="operaMusic"
          size="lager"
          style="margin-right: 40px"
        ></Avatar>
        <Button type="primary" @click="addDialog.show = true">
          添加歌曲
        </Button>
      </Col>
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
    <!-- 编辑歌曲 -->
    <el-dialog
      :title="editDialog.title"
      :visible.sync="editDialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="addForm_rules"
          label-width="120px"
        >
          <el-form-item label="歌曲ID:" prop="_id">
            <el-input type="id" disabled v-model="editForm._id"></el-input>
          </el-form-item>
          <el-form-item label="歌曲:" prop="songName">
            <el-input type="text" v-model="editForm.songName"></el-input>
          </el-form-item>
          <el-form-item label="歌手:" prop="artist">
            <el-input type="text" v-model="editForm.artist"></el-input>
          </el-form-item>
          <el-form-item label="歌曲地址:" prop="src">
            <!-- <Upload
              action="http://127.0.0.1:3000/api/admin/upload/music"
              :on-success="handleEditSongSuccess"
              ref="edit_music"
              :format="['map3']"
            >
              <Button icon="ios-cloud-upload-outline">重新选择</Button>
            </Upload> -->
            <el-upload
              action="http://127.0.0.1:3000/api/admin/upload/music"
              :on-success="handleMusicSuccess"
            >
              <el-button type="primary" size="small">重新选择</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="歌曲封面:" prop="poster">
            <!-- <Upload
              action="http://127.0.0.1:3000/api/admin/upload/poster"
              :format="['jpg', 'jpeg', 'png']"
              :max-size="50000"
              type="drag"
              :on-success="handleEditPosterSuccess"
              style="display: block; width: 44px"
            >
              <span style="float: left">
                <Avatar
                  :src="`http://localhost:3000/api/music/poster?img=${editForm.poster}`"
                  size="large"
                ></Avatar>
              </span>
            </Upload> -->
            <el-upload
              :action="uploadURL"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button type="primary" size="small">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="语种:" prop="language">
            <Select v-model="editForm.language" clearable style="width: 200px">
              <Option v-for="item in Languages" :key="item" :value="item">
                {{ item }}
              </Option>
            </Select>
          </el-form-item>
          <el-form-item label="风格:" prop="style">
            <Select v-model="editForm.style" clearable style="width: 200px">
              <Option v-for="item in songStyle" :key="item" :value="item">
                {{ item }}
              </Option>
            </Select>
          </el-form-item>
          <el-form-item class="text_right">
            <el-button @click="editDialog.show = false">取 消</el-button>
            <el-button type="primary" @click="okEditBtn('editForm')"
              >提 交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 添加歌曲 -->
    <el-dialog
      title="添加歌曲"
      :visible.sync="addDialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addForm_rules"
          label-width="120px"
          style="margin: 10px; width: auto"
        >
          <el-form-item prop="songName" label="歌曲名">
            <el-input type="songName" v-model="addForm.songName"></el-input>
          </el-form-item>
          <el-form-item label="歌手:" prop="artist">
            <el-input type="text" v-model="addForm.artist"></el-input>
          </el-form-item>
          <el-form-item label="歌曲地址:" prop="src">
            <el-upload
              action="http://127.0.0.1:3000/api/admin/upload/music"
              :on-success="handleAddMusicSuccess"
            >
              <el-button type="primary" size="small">重新选择</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="歌曲封面:" prop="poster">
            <Upload
              action="http://127.0.0.1:3000/api/admin/upload/poster"
              :format="['jpg', 'jpeg', 'png']"
              :max-size="50000"
              type="drag"
              :on-success="handleAddPosterSuccess"
              style="display: block; width: 44px"
            >
              <span style="float: left">
                <Avatar
                  :src="`http://localhost:3000/api/music/poster?img=${addForm.poster}`"
                  size="large"
                ></Avatar>
              </span>
            </Upload>
            <!-- <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :on-success="handleSuccess">
            <el-button type="primary" size="small">点击上传</el-button> 
          </el-upload> -->
          </el-form-item>
          <el-form-item label="语种:" prop="language">
            <Select v-model="editForm.language" clearable style="width: 200px">
              <Option v-for="item in Languages" :key="item" :value="item">
                {{ item }}
              </Option>
            </Select>
          </el-form-item>
          <el-form-item label="风格:" prop="style">
            <Select v-model="editForm.style" clearable style="width: 200px">
              <Option v-for="item in songStyle" :key="item" :value="item">
                {{ item }}
              </Option>
            </Select>
          </el-form-item>
          <el-form-item class="text_right">
            <el-button @click="addDialog.show = false">取 消</el-button>
            <el-button type="primary" @click="addSong('addForm')"
              >添 加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- toListen music-->
    <el-dialog
      title="试听歌曲"
      :visible.sync="toListen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      width="700px"
    >
      <p slot="header">
        <Icon type="ios-musical-notes"></Icon>
        <span>点击试听</span>
      </p>
      <div v-if="toListen">
        <div style="width: 100%">
          <el-table :data="allSongs" height="300" style="width: 100%">
            <el-table-column
              prop="songName"
              align="center"
              width="200"
              label="歌名"
            >
            </el-table-column>
            <el-table-column
              prop="artist"
              align="center"
              width="200"
              label="歌手"
            >
            </el-table-column>
            <el-table-column align="center" width="200" label="试听">
              <template slot-scope="scope">
                <span class="to-listen-link" @click="listenMusic(scope.row)"
                  >播放</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllSongRoute,
  searchMusicByName,
  linkMusic,
  delMusic,
  editMusic,
  addMusic,
} from "@/network/manage_music.js";
export default {
  name: "ManageMusic",
  data() {
    return {
      searchName: "",
      toListenSrc: "",
      // 试听歌曲
      toListen: false,
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
      editDialog: {
        title: "编辑歌曲",
        show: false,
      },
      addDialog: {
        show: false,
      },
      editForm: {
        _id: "",
        songName: "",
        src: "",
        artist: "",
        poster: "",
        language: "",
        style: "",
      },
      Languages: ["汉语", "韩语", "日语", "英语", "粤语"], //语种
      songStyle: ["传统", "民歌", "摇滚", "伴奏", "古风", "流行"], // 歌曲风格
      addForm_rules: {
        // 添加或者编辑歌曲规则
        songName: [{ required: true, message: "歌曲名不能为空" }],
        artist: [{ required: true, message: "歌手不能为空" }],
        src: [{ required: true, message: "歌曲不能为空" }],
        poster: [{ required: true, message: "歌曲封面不能为空" }],
      },
      uploadURL: "http://127.0.0.1:3000/api/admin/upload/poster",
      addForm: {
        songName: "",
        artist: "",
        src: "",
        poster: "",
        language: "",
        style: "",
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
      // console.log(this.allSongs);
      this.allTableData = res.data;
      this.setPagination();
    },
    // 歌曲搜索
    async searchSong() {
      if (this.searchName.trim().length === 0) {
        return this.$message.error("歌名不能为空!");
      } else {
        const { data: ret } = await searchMusicByName("music/search/byname", {
          searchName: this.searchName,
        });
        if (ret.status === 200) {
          this.allSongs = this.allTableData = ret.data;
          this.setPagination();
        } else {
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
    // linkSongs
    linkSongs(row) {
      this.$confirm(
        `添加 ${row.songName} (${row.artist}) 歌曲到KTV推荐歌曲里吗? `,
        "操作提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const { data: ret } = await linkMusic({ s_id: row._id });
        if (ret.status === 200) {
          this.$message.success(ret.msg);
        } else {
          this.$message.error(ret.msg);
        }
      });
    },
    // onDeleteSong
    onDeleteSong(row) {
      this.$confirm(
        `确定删除 ${row.songName} (${row.artist}) 歌曲吗?不可撤销,是否继续? `,
        "风险提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const { data: ret } = await delMusic(row._id);
        if (ret.status === 200) {
          this.$message.success(ret.msg);
          this.getAllSong();
        } else {
          this.$message.error(ret.msg);
        }
      });
    },
    // onEditSong
    onEditSong(song) {
      this.editForm = { ...song };
      this.editDialog.show = true;
      // this.clearFiles();
    },
    //upload music
    // handleEditSongSuccess(res) {
    //   console.log(res);
    //   this.editForm.src = res.data.src;
    // },
    // handleEditPosterSuccess(res) {
    //   console.log(res);
    //   this.editForm.poster = res.data.poster;
    // },
    handleSuccess(response) {
      this.editForm.poster = response.data.poster;
    },
    handleMusicSuccess(res) {
      this.editForm.src = res.data.src;
    },
    okEditBtn(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.editDialog.show = false;
          const { data: ret } = await editMusic(this.editForm);
          if (ret.status === 200) {
            this.$message.success(ret.msg);
            this.getAllSong();
          }
        }
      });
    },
    //add music
    // handlePreview() {},
    // handleRemove() {},
    handleAddMusicSuccess(res) {
      this.addForm.src = res.data.src;
    },
    handleAddPosterSuccess(res) {
      this.addForm.poster = res.data.poster;
    },
    addSong(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.addDialog.show = false;
          const { data: ret } = await addMusic(this.addForm);
          if (ret.status === 200) {
            this.$message.success(ret.msg);
            this.getAllSong();
          } else {
            return this.$message.error(ret.msg);
          }
        }
      });
    },
    listenMusic(song) {
      this.toListenSrc = `http://localhost:3000/api/music/nowmusic?id=${song._id}`;
      this.toListenPoster = `http://localhost:3000/api/music/poster?img=${song.poster}`;
    },
    operaMusic() {
      if(this.$refs.musicPlayer.paused) {
        this.$refs.musicPlayer.play();
      }else {
        this.$refs.musicPlayer.pause();
      }
    }, 
    ended(){
      this.$refs.musicPlayer.play();
    }
    // 
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
.to-listen-link {
  cursor: pointer;
  &:hover {
    color: rgb(223, 107, 72);
  }
}
</style>