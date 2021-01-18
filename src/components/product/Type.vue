<template>
      <div>
        <h1>商品分类管理</h1>
        <el-tree
          :data="typeData"
          :props="props"
          show-checkbox
          accordion
          :render-content="renderContent"
          :expand-on-click-node="false"
          >
        </el-tree>

        <!-- 新增弹框 -->
        <el-dialog
          title="新增分类"
          :visible.sync="showAddFalg"
          width="30%">
          <el-form ref="addForm" :model="addForm"  label-width="80px">
            <el-form-item label="父类名称" prop="pname">
              <el-input disabled v-model="addForm.pname"></el-input>
            </el-form-item>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddFalg = false">取消</el-button>
            <el-button type="primary" @click="addTypeForm">新增</el-button>
          </div>
        </el-dialog>


        <!-- 修改弹框 -->
        <el-dialog
          title="修改分类"
          :visible.sync="showUpdateFalg"
          width="30%">
          <el-form ref="updateForm" :model="updateForm"  label-width="80px">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="updateForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showUpdateFalg = false">取消</el-button>
            <el-button type="primary" @click="updateTypeForm">修改</el-button>
          </div>
        </el-dialog>

      </div>
</template>

<script>
    export default {
        name: "Type",
      data(){
          return {
            typeData:[],
            typess:[],
            jsonStr:"",
            props: {
              label:"name",
              children:"children",
              pid:"pid"
            },
            showAddFalg:false,//新增弹框显示标识
            showUpdateFalg:false,//修改弹框显示标识
            addForm:{
              pname:"",
              name:"",
              pid:""
            },
            updateForm:{
              id:"",
              name:""
            }
          }
      },
      created:function () {
          this.$axios.get("http://localhost:8082/api/type/getData").then(res=>{
              this.typess = res.data.data;
              this.chuliTypes()
          }).catch(rs=>{
              alert("获取数据失败")
          })

      },
      methods:{
          chuliTypes(){
            var types = this.typess;
            for (let i = 0; i <types.length ; i++) {
              var type = types[i];
              if (type.pid == 0){
                this.diguiTypes(type);
                break
              }
            }
            console.log(this.jsonStr);
            var jsonD = JSON.parse(this.jsonStr);
            console.log(jsonD);
            this.typeData.push(jsonD)
          },
          diguiTypes:function (type) {
              var isPar = this.isParents(type)
              if(isPar){
                this.jsonStr+='{"id":'+type.id+',"name":"'+type.name+'","pid":'+type.pid+',"children":[';
                let temp = 0;
                for (let i = 0; i <this.typess.length ; i++) {
                    var data = this.typess[i];
                    if (type.id == data.pid){
                      temp++;
                      this.diguiTypes(data);
                      this.jsonStr+=',';
                    }
                }
                if(temp>0){
                    this.jsonStr = this.jsonStr.substr(0,this.jsonStr.length-1);
                }
                this.jsonStr+=']}';
              }else{
                this.jsonStr+='{"id":'+type.id+',"name":"'+type.name+'","pid":'+type.pid+'}';
              }
          },
          isParents:function (type) {
            var types = this.typess;
            for (let i = 0; i <types.length ; i++) {
                if (types[i].pid == type.id){
                    return true;
                }
            }
            return false;
          },
          append(data) {
            console.log(data)
            this.showAddFalg = true;
            this.addForm.pname = data.name;
            this.addForm.pid = data.id;
          },
          remove(node, data) {
            console.log(data);
            this.$axios.delete("http://localhost:8082/api/type/deleteTypeById?id="+data.id).then(res=>{
              location.reload();
            }).catch(rs=>{console.log(rs)})
          },
          update(data){
            console.log(data);
            this.showUpdateFalg = true;
            this.updateForm.name = data.name;
          },
          renderContent(h, { node, data, store }) {
            return (
              <span class="custom-tree-node">
                <span>{node.label}</span>
                <span>
                  <el-button size="mini" type="text" on-click={ () => this.append(data) }>增加</el-button>
                  <el-button size="mini" type="text" on-click={ () => this.update(data) }>修改</el-button>
                  <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
                </span>
              </span>);
          },
          addTypeForm(){
            this.$axios.post("http://localhost:8082/api/type/add",this.$qs.stringify(this.addForm)).then(res=>{
              console.log(res)
              if(res.status == 200){
                this.addForm = "";
                this.showAddFalg = false;
                location.reload();
              }
            }).catch(rs=>{console.log(rs)})
          },
          updateTypeForm(){
            this.$axios.post("http://localhost:8082/api/type/updateTypeById",this.$qs.stringify(this.updateForm)).then(res=>{
              if(res.status == 200){
                this.updateForm = "";
                this.showUpdateFalg = false;
                location.reload();
              }
            }).catch(rs=>{console.log(rs)})
          }
      }
    }
</script>

<style scoped>

</style>
