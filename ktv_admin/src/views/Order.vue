<template>
  <div>
    <Row style="padding:20px 60px 20px 40px;">
      <Col :span="20">
      <el-date-picker v-model="selectDate" size="small" type="datetimerange" :picker-options="pickerOptions"
        range-separator="至" start-placeholder="开始日期" format="yy/MM/dd hh:mm:ss" end-placeholder="结束日期" align="right">
      </el-date-picker>
      <Button type="primary" v-if="selectDate" style="margin-left:10px" @click="findOrders">查询</Button>
      </Col>
      <Col :span="4">
      <Button type="primary" @click="getOrders">所有订单</Button>
      </Col>
    </Row>
    <!-- 订单数据表 -->
    <div style="width:100%;background-color:#f40;">
      <el-table :data="allorders" class="order-table" style="width:100%" border>
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="order_id" label="订单编号" align="center" width="200">
        </el-table-column>
        <el-table-column prop="totalMoney" label="金额" align="center" width="150">
        </el-table-column>
        <el-table-column prop="account" label="账号" align="center" width="200">
        </el-table-column>
        <el-table-column prop="publicpwd" label="明文密码" align="center" width="200">
        </el-table-column>
        <el-table-column prop="password" label="密文" align="center" width="300">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" width="150">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center" width="150">
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button type="danger" icon='el-icon-delete' size="small" circle 
              @click="onDeleted(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
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
  </div>
</template>

<script>
import { getAllOrder, deleteOrderById} from '../network/order';
export default {
  name: "Order",
  data() {
    return {
      selectDate: "",
      allorders: [],
      allTableData: [],
      noChangeData: [],
      paginations: {
        //分页
        page_index: 1,
        total: 0,
        page_size: 10,
        page_sizes: [8, 15, 20, 25],
        layout: "total,sizes,prev,pager,next,jumper",
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      const { data: ret } = await getAllOrder("admin/orders/all");
      if(ret.status !== 200) {
        this.$message.error(ret.msg);
      }
      this.allorders = ret.data;
      this.allTableData = ret.data;
      this.noChangeData = ret.data;
      this.setPagination();
    },
    async onDeleted(row) {
      const {date: ret} = await deleteOrderById(`admin/orders/del`,{
        _id: row._id,
      });
      if(ret.status !== 200) {
        this.$message.error(ret.msg);
      }
      this.$message.success(ret.msg);
      await this.getOrders();
    },
    findOrders() {
      const startTime = new Date(this.selectDate[0]).getTime();
      const endTime = new Date(this.selectDate[1]).getTime();
      const result = [];
      this.noChangeData.forEach(item => {
        const time = new Date(item.startTime).getTime();
        if(time >= startTime && time <= endTime) {
          result.push(item);
        }
      });
      this.allorders = result;
      this.allTableData = result;
      this.setPagination();
    },

    handleCurrentChange(page) {
      let sort_num = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, idx) => {
        return idx >= sort_num;
      });
      this.allorders = table.filter(
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
      this.allorders = this.allTableData.filter(
        (item, idx) => idx < this.paginations.page_size
      );
    },
  }
}
</script>

<style lang="scss" scoped>
.allorders{
    width: 100%;
    height: 100%;
    padding: 20px 60px;
}
</style>