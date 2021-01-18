<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" :inline="true" class="demo-form-inline">
      <el-form-item label="属性名称(En)">
        <el-input v-model="searchForm.searchName" width="30px"></el-input>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="queryAttrData(1,2)">搜索</el-button>
        <el-button type="success" icon="el-icon-circle-plus" @click="showAddFlag=true"></el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="属性名称(En)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="nameCH"
        label="属性中文名称"
        width="120">
      </el-table-column>

      <el-table-column
        prop="typeId"
        label="所属分类"
        width="120"
        :formatter="chuliType">
      </el-table-column>

      <el-table-column
        prop="type"
        label="属性类型"
        width="120"
        :formatter="fmt">
      </el-table-column>

      <el-table-column
        prop="isSKU"
        label="是否是SKU属性"
        width="120">
        <template slot-scope="scope">{{ scope.row.isSKU==1?"是":"否"}}</template>
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
            type="success"
            @click="attrValue(scope.row)">属性值维护</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteAttr(scope.row.id)">删除</el-button>
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
      title="属性信息录入"
      :visible.sync="showAddFlag"
      width="35%">
      <el-form ref="addForm" :model="addForm"  label-width="80px">
        <el-form-item label="所属分类">
          <el-select v-model="addForm.typeId" placeholder="请选择分类">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="item in childrenNode" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称(En)" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="属性中文名称" prop="nameCH">
          <el-input v-model="addForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-radio-group v-model="addForm.type">
            <el-radio label="0">下拉框</el-radio>
            <el-radio label="1">单选框</el-radio>
            <el-radio label="2">复选框</el-radio>
            <el-radio label="3">输入框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否SKU">
          <el-switch v-model="addForm.isSKU"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddFlag = false">取消</el-button>
        <el-button @click="resetUpdateForm('addForm')">重置</el-button>
        <el-button type="primary" @click="addAttrForm">新增</el-button>
      </div>
    </el-dialog>

    <!-- 修改弹框 -->
    <el-dialog
      title="属性信息录入"
      :visible.sync="showUpdateFlag"
      width="35%">
      <el-form ref="updateForm" :model="updateForm"  label-width="80px">
        <el-form-item hidden label="id" prop="id">
          <el-input v-model="updateForm.id"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="updateForm.typeId" placeholder="请选择分类">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="item in childrenNode" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称(En)" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="属性中文名称" prop="nameCH">
          <el-input v-model="updateForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-radio-group v-model="updateForm.type">
            <el-radio label="0">下拉框</el-radio>
            <el-radio label="1">单选框</el-radio>
            <el-radio label="2">复选框</el-radio>
            <el-radio label="3">输入框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否SKU">
          <el-switch v-model="updateForm.isSKU"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdateFlag = false">取消</el-button>
        <el-button @click="resetUpdateForm('addForm')">重置</el-button>
        <el-button type="primary" @click="updateAttrForm">新增</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showAttrValue"
      :title="attrValueTitle"
      width="35%">
      <el-button type="success" round @click="showValueFrom">新增</el-button>
      <el-table :data="attrValueTableData" v-if="!showValueFormTable">
        <el-table-column property="id" label="序号"></el-table-column>
        <el-table-column property="nameCH" label="属性值名称"></el-table-column>
        <el-table-column property="name" label="属性值"></el-table-column>
        <el-table-column property="isDel" label="是否删除"></el-table-column>
        <el-table-column property="id" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="toUpdateValue(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增属性值 -->
      <div>
        <el-form :model="addValueForm"   label-width="150px" v-if="showValueFormTable">
          <el-form-item label="选项中文名称" prop="nameCH">
            <el-input v-model="addValueForm.nameCH"></el-input>
          </el-form-item>
          <el-form-item label="选项值" prop="name">
            <el-input v-model="addValueForm.name"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addAttrValue">添加</el-button>
            <el-button @click="showValueFormTable=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 修改属性值 -->
      <el-form :model="updateValueForm"   label-width="180px" v-if="showUpdateValueFormTable">
        <el-form-item label="选项中文名称" prop="nameCH">
          <el-input v-model="updateValueForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="选项值" prop="name">
          <el-input v-model="updateValueForm.name"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateAttrValue">修改</el-button>
          <el-button @click="showUpdateValueFormTable=false">取消</el-button>
        </el-form-item>
      </el-form>


    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "Attr",
        data(){
          return{
            childrenNode:[],//分类子节点数据
            showAddFlag:false,
            showUpdateFlag:false,
            tableData:"",
            typess:[], //接收所有分类数据的变量
            nameStr:"",//处理分类下拉框name值的变量
            count:"",
            sizes:[2,3,4],
            types:[
              {"id":5,name:"分类/数码/手机"},
              {"id":6,name:"分类/数码/单反相机"},
              {"id":7,name:"分类/衣服/上衣"},
              {"id":8,name:"分类/服装/裤子"},
              {"id":16,name:"分类/家电/洗衣机"},
              {"id":10,name:"分类/家具/餐桌"}
            ],
            searchForm:{
              searchName: "",
              limit:2,
              page:1
            },
            addForm:{
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            updateForm:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            /* 属性值相关*/
            attrValueTitle:"",
            showAttrValue:false, //属性值列表弹框标识
            showValueFormTable:false,   // 显示新增属性值表单标识
            showUpdateValueFormTable:false, //显示修改属性值表单标识
            attrValueTableData:[],
            addValueForm:{
              attrId:"",
              name:"",
              nameCH:""
            },
            updateValueForm:{
              id:"",
              name:"",
              nameCH:""
            }
          }
        },
        created:function () {
          this.queryAttrData();
          this.queryTypeData();
        },
        methods:{
            queryTypeData:function(){
              this.$axios.get("http://localhost:8082/api/type/getData").then(res=>{
                this.typess = res.data.data;
                this.getChildrenType();
                this.chuliTypeSelect();
              }).catch(rs=>{
                alert("获取类型数据失败")
              })
            },
            //获取分类数据中的所有子节点
            getChildrenType:function(){
              console.log(this.typess)
              for (let i = 0; i < this.typess.length; i++) {
                let type = this.typess[i];
                this.isParent(type);
              }
            },
            isParent:function(type){
              let flag = true;
              for (let i = 0; i < this.typess.length; i++) {
                if (type.id == this.typess[i].pid){
                  flag = false;
                  break;
                }
              }
              if(flag){
                this.childrenNode.push(type);
              }
            },
            //处理分类下拉框数据
            chuliTypeSelect:function(){

              for (let i = 0; i < this.childrenNode.length; i++) {
                  this.nameStr="";
                  let node = this.childrenNode[i];
                  this.typeSelectName(node);
                  let a = this.nameStr.split("/").reverse().join("/");
                  this.childrenNode[i].name = a.substr(0,a.length-1);
              }
            },
            typeSelectName:function(node){
              if (node.pid != 0){
                this.nameStr += "/"+ node.name;
                for (let i = 0; i < this.typess.length; i++) {
                  if (node.pid == this.typess[i].id){
                    this.typeSelectName(this.typess[i]);
                    break;
                  }
                }
              }else{
                this.nameStr += "/"+ node.name;
              }
            },
            queryAttrData:function (page,limit) {
              if (page != null && limit != null){
                this.searchForm.page = page;
                this.searchForm.limit = limit;
              }
              this.$axios.get("http://localhost:8082/api/attr/queryAttrData?"+this.$qs.stringify(this.searchForm)).then(res=>{
                this.tableData = res.data.data.list;
                this.count = res.data.data.count;
              }).catch(rs=>console.log(rs))
            },
            //条数改变事件
            handleSizeChange:function (val) {
              this.searchForm.limit = val;
              this.queryAttrData()
            },
            //页数改变事件
            handleCurrentChange:function (val) {
              this.searchForm.page = val;
              this.queryAttrData()
            },
            resetUpdateForm:function (form) {
              this.$refs[form].resetFields();
            },
            fmt:function(a,b,c,d){
              if(c==0){
                return "下拉框";
              }
              if(c==1){
                return "单选框";
              }if(c==2){
                return "复选框";
              }if(c==3){
                return "输入框";
              }
            },
            chuliType:function(a,b,c,d){
              for (let i = 0; i <this.typess.length ; i++) {
                let type = this.typess[i];
                if(c==type.id){
                  return type.name;
                }
              }
            },
            toUpdate:function (id) {

              this.showUpdateFlag = true;
              this.$axios.get("http://localhost:8082/api/attr/queryAttrById?id="+id).then(res=>{
                console.log(res);
                this.updateForm = res.data.data;
                this.updateForm.isSKU = res.data.data.isSKU==1?true:false;
              }).catch(rs=>{
                alert("回显失败")
              })
            },
            //新增属性提交
          addAttrForm:function(){
              console.log(this.addForm);
              this.addForm.isSKU = this.addForm.isSKU?1:0;
              this.$axios.post("http://localhost:8082/api/attr/addAttr",this.$qs.stringify(this.addForm)).then(res=>{
                if (res.data.code==200){
                  this.addForm = '';
                  this.showAddFlag = false;
                  location.reload();
                }
              }).catch(rs=>{
                alert("新增异常")
              })
            },
            //修改属性
            updateAttrForm:function () {
              this.$axios.post("http://localhost:8082/api/attr/updateAttrById",this.$qs.stringify(this.updateForm)).then(res=>{
                if (res.data.code==200){
                  this.resetUpdateForm('updateForm');
                  this.showUpdateFlag = false;
                  this.queryAttrData(1,2);
                }
              }).catch(rs=>{
                alert("修改异常")
              })
            },
          //删除属性
            deleteAttr:function (id) {
              this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$axios.delete("http://localhost:8082/api/attr/deleteAttrById?id="+id).then(res=>{
                  alert("删除成功")
                  location.reload()
                }).catch(rs=>{
                  console.log(rs)
                })
              })
            },
          //属性值维护
          attrValue:function(attr){
              this.attrValueTitle = attr.name+"属性选项";
              this.addValueForm.attrId = attr.id;
              this.showAttrValue = true;
              this.queryAttrValueData();
          },
          //查询当前属性的所有属性值
          queryAttrValueData:function () {
              debugger
              let attrId = this.addValueForm.attrId;
              this.$axios.get("http://localhost:8082/api/avc/queryAttrValueData?attrId="+attrId).then(res=>{
                this.attrValueTableData = res.data.data;
              }).catch(rs=>console.log(rs))
          },
          //显示新增属性值表单
          showValueFrom:function(){
            this.showValueFormTable=true;
          },
          //新增属性值
          addAttrValue:function () {
              this.$axios.post("http://localhost:8082/api/avc/addAttrValue",this.$qs.stringify(this.addValueForm)).then(res=>{
                  if (res.data.code==200){
                    this.showValueFormTable = false;
                  }
              }).catch(rs=>console.log(rs))
          },
          toUpdateValue:function (id) {
            this.$axios.get("http://localhost:8082/api/avc/queryAttrValueById?id="+id).then(res=>{
              if (res.data.code==200){
                this.showUpdateValueFormTable=true;
                this.updateValueForm = res.data.data;
              }
            }).catch(rs=>console.log(rs))
          },
          updateAttrValue:function () {
              this.$axios.post("http://localhost:8082/api/avc/updateAttrValueById",this.$qs.stringify(this.updateValueForm)).then(res=>{
                  if (res.data.code ==200){
                    this.showUpdateValueFormTable=false;
                    this.updateValueForm = res.data.data;
                  }
              }).catch(rs=>console.log(rs))
          }
        },

    }
</script>

<style scoped>

</style>
