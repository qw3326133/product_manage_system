<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" :inline="true" class="demo-form-inline">
      <el-form-item label="品牌名称">
        <el-input v-model="searchForm.searchName" width="30px"></el-input>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="queryBrandData(1,2)">搜索</el-button>
        <el-button type="success" icon="el-icon-circle-plus" @click="showAddFlag=true"></el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="品牌名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="brandE"
        label="品牌首字母"
        width="120">
      </el-table-column>
      <el-table-column
        prop="filePath"
        label="图片"
        width="120">
        <template slot-scope="scope"><img :src="scope.row.imgPath"  width="50px"></template>
      </el-table-column>
      <el-table-column
        prop="ord"
        label="排名"
        width="120">
      </el-table-column>

      <el-table-column
        prop="author"
        label="操作人"
        width="120">

      </el-table-column>

      <el-table-column
        label="创建日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.createDate}}</template>
      </el-table-column>
      <el-table-column
        label="修改日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.updateDate}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="toUpdate(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteBrand(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page = searchForm.page
        :page-sizes = sizes
        :page-size = searchForm.limit
        layout="total, sizes, prev, pager, next, jumper"
        :total=count>
      </el-pagination>

    <!-- 新增弹框 -->
    <el-dialog
      title="品牌信息录入"
      :visible.sync="showAddFlag"
      width="35%">
      <el-form ref="addForm" :model="addForm"  label-width="80px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母" prop="brandE">
          <el-input v-model="addForm.brandE"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="ord">
          <el-input-number v-model="addForm.ord"  :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:8082/api/brand/upload"
            :on-success="uploadSuccessAdd"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌描述">
          <el-input type="textarea" v-model="addForm.brandDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddFlag = false">取消</el-button>
        <el-button @click="resetUpdateForm('addForm')">重置</el-button>
        <el-button type="primary" @click="addBrandForm">新增</el-button>
      </div>
    </el-dialog>

    <!-- 修改弹框 -->
    <el-dialog
      title="品牌信息录入"
      :visible.sync="showUpdateFlag"
      width="35%">
      <el-form ref="updateForm" :model="updateForm"  label-width="80px">
        <el-form-item hidden label="id" prop="id">
          <el-input v-model="updateForm.id"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母" prop="brandE">
          <el-input v-model="updateForm.brandE"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="ord">
          <el-input-number v-model="updateForm.ord"  :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:8082/api/brand/upload"
            :on-success="uploadSuccessUpdate"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-image :src="updateForm.imgPath"></el-image>
        </el-form-item>
        <el-form-item label="品牌描述">
          <el-input type="textarea" v-model="updateForm.brandDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdateFlag = false">取消</el-button>
        <el-button @click="resetUpdateForm('updateForm')">重置</el-button>
        <el-button type="primary" @click="updateBrandForm">修改</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
    export default {
        name: "Brand",
        data(){
          return{
            showAddFlag:false,
            showUpdateFlag:false,
            count:"",
            sizes:[2,3,4],
            searchForm:{
              searchName:"",
              limit:2,
              page:1
            },
            tableData:[],
            addForm:{
              name:"",
              brandE:"",
              imgPath:"",
              brandDesc:"",
              ord:""
            },
            updateForm:{
              id:"",
              name:"",
              brandE:"",
              imgPath:"",
              brandDesc:"",
              ord:""
            },

          }
        },
        created:function () {
            this.queryBrandData();
        },
        methods:{
            queryBrandData:function (page,limit) {
              if (page != null && limit != null){
                this.searchForm.page = page;
                this.searchForm.limit = limit;
              }
              this.$axios.get("http://localhost:8082/api/brand/queryBrandData?"+this.$qs.stringify(this.searchForm)).then(res=>{
                this.tableData = res.data.data.list;
                this.count = res.data.data.count;
              }).catch(rs=>console.log(rs))
            },
          //条数改变事件
          handleSizeChange:function (val) {
            this.searchForm.limit = val;
            this.queryBrandData()
          },
          //页数改变事件
          handleCurrentChange:function (val) {
            this.searchForm.page = val;
            this.queryBrandData()
          },
          //上传成功回调
          uploadSuccessAdd:function (response, file, fileList) {
            console.log(response)
            this.addForm.imgPath = response.data;
          },
          uploadSuccessUpdate:function (response, file, fileList) {
            console.log(response)
            this.updateForm.imgPath = response.data;
          },
          resetUpdateForm:function (form) {
            this.$refs[form].resetFields();
          },
          toUpdate:function (id) {
            this.showUpdateFlag = true;
            this.$axios.get("http://localhost:8082/api/brand/queryBrandById?id="+id).then(res=>{
              console.log(res);
              this.updateForm = res.data.data;
            }).catch(rs=>{
              alert("回显失败")
            })
          },
          //新增提交
          addBrandForm:function(){
            console.log(this.addForm);
            this.$axios.post("http://localhost:8082/api/brand/addBrand",this.$qs.stringify(this.addForm)).then(res=>{
              if (res.data.code==200){
                this.addForm = '';
                this.showAddFlag = false;
                location.reload();
              }
            }).catch(rs=>{
              alert("新增异常")
            })
          },
          //修改
          updateBrandForm:function () {
            this.$axios.post("http://localhost:8082/api/brand/updateBrandById",this.$qs.stringify(this.updateForm)).then(res=>{
              if (res.data.code==200){
                this.resetUpdateForm('updateForm');
                this.showUpdateFlag = false;
                this.queryBrandData(1,2);
              }
            }).catch(rs=>{
              alert("修改异常")
            })
          },
          deleteBrand:function (id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.delete("http://localhost:8082/api/brand/deleteBrandById?id="+id).then(res=>{
                alert("删除成功")
                location.reload()
              }).catch(rs=>{
                console.log(rs)
              })
            })
          }
        }
    }
</script>

<style scoped>

</style>
