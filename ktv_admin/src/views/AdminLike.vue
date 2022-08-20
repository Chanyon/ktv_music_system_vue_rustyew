<template>
  <div class="adminlike">
    <Row style="padding: 20px;">
      <Col :span="4">
      <Input prefix="ios-musical-notes" clearable @keypress.enter.native="searchSong" v-model="searchName"
        placeholder="按 歌名, 歌手 搜索歌曲..." style="width: auto"></Input>
      </Col>
      <Col :span="4" style="text-align: center;">
      <Button type="primary" @click="getAdminLikes">所有歌曲</Button>
      </Col>
    </Row>
    <div style="width:100%;background-color:#f40;">
      <el-table :data="adminLikes" border class="song-table" style="width:100%">
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="_id" label="歌曲ID" align="center" width="240">
        </el-table-column>
        <el-table-column prop="songName" label="歌曲名" align="center" width="200">
        </el-table-column>
        <el-table-column prop="artist" label="歌手" align="center" width="170">
        </el-table-column>
        <el-table-column prop="src" label="歌曲地址" align="center" width="200">
        </el-table-column>
        <el-table-column label="歌曲封面" align="center" width="120">
          <template slot-scope="scope">
            <Avatar :src="`${songImage}?img=${scope.row.poster}`" size="lager"></Avatar>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="language" width="120" label="语种">
        </el-table-column>
        <el-table-column align="center" prop="style" width="120" label="风格">
        </el-table-column>
        <el-table-column align="center" prop="playcount" width="80" label="播放次数">
        </el-table-column>
        <el-table-column align="center" prop="date" width="200" label="最近更新时间">
        </el-table-column>
        <el-table-column prop="operation" align='center' label="操作" fixed="right" min-width="100">
          <template slot-scope='scope'>
            <el-button type="danger" icon='el-icon-delete' size="small" circle @click='onDeleteSong(scope.row)'>
            </el-button>
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
import { getAdminLikeSong,searchLikeSong,deleteLikeSong } from '../network/adminLike';
export default {
  name: 'AdminLike',
  data() {
    return {
      songImage: 'http://localhost:3000/api/music/poster',
      searchName: '',
      adminLikes: [],
      allTableData: [],
      paginations: {
        //分页
        page_index: 1,
        total: 0,
        page_size: 10,
        page_sizes: [8, 15, 20, 25],
        layout: "total,sizes,prev,pager,next,jumper",
      },
    }
  },
  created() {
    this.getAdminLikes();
  },
  methods: {
    async getAdminLikes() {
      const { data: ret } = await getAdminLikeSong(`admin/adminlike/all`);
      if (ret.status !== 200) {
        this.$message.error(ret.message);
      }
      this.adminLikes = this.allTableData = ret.data;
      this.setPagination();
    },
    async searchSong() {
      if (this.searchName.trim().length > 0) {
        const {data:ret} = await searchLikeSong(`admin/adminlike/search`,{
          searchName: this.searchName,
        });
        this.adminLikes = ret.data;
        this.setPagination();
      } else {
        this.$message.error('搜索内容不能为空！');
      }
    },
    async onDeleteSong(song){
      const {data:ret} = await deleteLikeSong(`admin/adminlike/del`,{
        _id: song._id,
      });
      if(ret.status !== 200) {
        this.$message.error(ret.msg);
      }
      this.$message.success(ret.msg);
      this.getAdminLikes();
    
    },
    handleCurrentChange(page) {
      let sort_num = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, idx) => {
        return idx >= sort_num;
      });
      this.adminLikes = table.filter(
        (item, idx) => idx < this.paginations.page_size
      );
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.setPagination();
    },
    setPagination() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.adminLikes = this.allTableData.filter(
        (item, idx) => idx < this.paginations.page_size
      );
    },
  },
}
</script>

<style lang="scss" scoped>
</style>