<template>
  <div>
    <div class="w-screen h-screen flex">
      <div class="flex-none w-64 flex flex-col h-full border-r">
        <div class="border-b flex-none h-10 px-3 flex items-center justify-center">
          <a href="/" class="flex-1 flex items-center">
            <img class="w-6 h-6" src="../assets/logo.png">
            <div class="font-bold text-sm">速查表</div>
          </a>
          <el-button @click="add()" size="mini" type="text" round><i class="el-icon-plus"></i>新增</el-button>
        </div>
        <div class="flex-1 overflow-y-auto overflow-x-hidden h-0">
          <div
              v-for="(item, index) in list"
              :key="index"
              :class="pid === item.id ? 'item-active':''"
              class="flex items-center justify-between px-3 border-b cursor-pointer">
            <router-link class="flex-1 truncate py-3 text-sm" :to="'/edit/'+item.id">
              <p class="font-bold leading-6">{{ item.name }}</p>
              <p class="text-xs text-gray-400 ">({{item.name_en}})</p>
            </router-link>
            <div class="px-2">
              <el-dropdown trigger="click">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <a :href="'/'+item.name_en +'.html'" target="_blank">查看</a>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="add(item)">编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="clickBuild(item.id)">构建</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="clickDel(item)">删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-none w-64 flex flex-col h-full border-r">
        <div class="border-b flex-none h-10 px-3 flex items-center justify-end">
          <router-link :to="'/edit/'+pid">
            <el-button size="mini" type="text" round><i class="el-icon-plus"></i>新增</el-button>
          </router-link>
        </div>
        <div class="flex-1 overflow-y-auto overflow-x-hidden h-0">
          <div
              v-for="(item, index) in listMd"
              :key="index"
              :class="id === item.id ? 'item-active':''"
              class="flex items-center justify-between px-3 border-b cursor-pointer">
            <router-link class="flex-1 truncate py-3 text-sm" :to="'/edit/'+pid+'/'+item.id">
              {{ item.title }}
            </router-link>
            <div class="px-2">
              <el-dropdown trigger="click">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="clickMdDel(item)">删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(225, 225, 225, 0.8)"
          class="flex-1 flex flex-col w-full h-full">
        <div class="flex-none flex items-center">
          <el-input v-model="formMd.title" class="input-b-border" placeholder="标题"></el-input>
          <el-button class="mx-1" size="small" type="primary" @click="onMdSubmit()">保存</el-button>
        </div>
        <div class="flex-1">
          <iframe
              class="w-full h-full"
              ref="editormd"
              src="https://www.lufuhu.com/tools/editor.md/index.html"
              frameborder="no"
              border="0"
              marginwidth="0"
              marginheight="0"
              scrolling="no"
              allowtransparency="yes">
          </iframe>
        </div>
      </div>
    </div>

    <el-dialog
        title="速查表"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="70vh">
      <el-form ref="form" size="small" :model="form" label-width="55px">
        <el-form-item label="名称">
          <el-input placeholder="请输入名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input placeholder="请输入英文名称" v-model="form.name_en"></el-input>
        </el-form-item>
        <div class="flex">
          <el-form-item label="图标">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                       :on-success="handleAvatarSuccess">
              <img v-if="form.icon" :src="form.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item class="ml-2 flex-1" label="简介">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入内容" v-model="form.summary">
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="地址">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-link" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="100"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "editArticle",
  data() {
    return {
      form: {
        id: '',
        name: "",
        name_en: "",
        summary: "",
        icon: "",
        url: "",
        sort: 0,
      },
      formMd: {
        id: '',
        pid: "",
        title: "",
        content: "",
        sort: 0,
      },
      edIframeWin: {},
      isIframeOnload: false,
      isDetailsData: false,
      dialogVisible: false,
      list: [],
      listMd: [],
      loading: false,
      pid: '',
      id: '',
    }
  },
  watch: {
    $route() {
      this.getData();
    },
    cheatsheetAddData() {
      this.onSaveSuccess()
    },
    cheatsheetEditData() {
      this.onSaveSuccess()
    },
    cheatsheetMdAddData(val) {
      this.onSaveMdSuccess(val.data)
    },
    cheatsheetDelData(val) {
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.cheatsheetList();
      if (this.pid === parseInt(val.data)) {
        this.$router.push('/edit');
      }
    },
    cheatsheetMdDelData(val) {
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.cheatsheetMdList({pid:this.pid});
      if (this.id === parseInt(val.data)) {
        this.$router.push('/edit/'+this.pid);
      }
    },
    cheatsheetMdEditData(val) {
      this.onSaveMdSuccess(val.data)
    },
    cheatsheetListData(val) {
      this.list = val.data;
    },
    cheatsheetMdListData(val) {
      this.listMd = val.data;
    },
    cheatsheetMdViewData(val) {
      this.formMd = val.data
      this.isDetailsData = true;
      this.setContent();
      this.loading = false
    },
    cheatsheetBuildData(){
      this.$message({
        type: 'success',
        message: '构建成功!'
      });
    }
  },
  mounted() {
    this.edIframeWin = this.$refs.editormd.contentWindow;
    this.cheatsheetList();
    this.getData();
    let that = this;
    window.addEventListener("message", function (event) {
      let data = event.data;
      switch (data.method) {
        case 'onLoad': //初始化完成
          that.isIframeOnload = true;
          that.setContent();
          break;
        case 'onChange': //内容改变事件
          that.formMd.content = data.content;
          break;
      }
    }, false);
  },
  methods: {
    ...mapActions([
      'cheatsheetList',
      'cheatsheetAdd',
      'cheatsheetEdit',
      'cheatsheetDel',
      'cheatsheetBuild',
      'cheatsheetMdList',
      'cheatsheetMdView',
      'cheatsheetMdAdd',
      'cheatsheetMdEdit',
      'cheatsheetMdDel'
    ]),
    clickBuild(id){
      this.cheatsheetBuild({id:id});
    },
    getData() {
      if (this.$route.params.pid){
        if (parseInt(this.$route.params.pid) !== this.pid){
          this.pid = parseInt(this.$route.params.pid)
          this.cheatsheetMdList({pid: this.pid});
        }
        if (this.$route.params.id){
          if (parseInt(this.$route.params.id) !== this.id) {
            this.id = parseInt(this.$route.params.id)
            this.cheatsheetMdView({pid: this.pid, id: this.id});
          }
        } else {
          this.id = '';
          this.formMd = {id: '', pid: "", title: "", content: "", sort: 0};
          this.setContent();
        }
      }
    },
    onSubmit() {
      if (this.form.id) {
        this.cheatsheetEdit(this.form);
      } else {
        this.cheatsheetAdd(this.form);
      }
    },
    onMdSubmit() {
      if (this.formMd.id) {
        this.cheatsheetMdEdit(this.formMd);
      } else {
        this.formMd.pid = this.pid
        this.cheatsheetMdAdd(this.formMd);
      }
    },
    setContent() {
      if (this.isDetailsData && this.isIframeOnload) {
        this.edIframeWin.postMessage({
          method: 'setContent',
          content: this.formMd.content
        }, "*");
      }
    },
    clickDel(item) {
      this.$confirm("是否删除此速查表（" + item.title + "）", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cheatsheetDel({id: item.id});
      });
    },
    clickMdDel(item) {
      this.$confirm("是否删除此MD文件（" + item.title + "）", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cheatsheetMdDel({id: item.id});
      });
    },
    add(item) {
      if (item) {
        this.form = item;
      } else {
        this.form = {
          id: '',
          name: "",
          name_en: "",
          summary: "",
          icon: "https://element.faas.ele.me/favicon.ico",
          url: "",
          sort: 0,
        }
      }
      this.dialogVisible = true;
    },
    onSaveSuccess() {
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
      this.dialogVisible = false;
      this.cheatsheetList();
    },
    onSaveMdSuccess(id) {
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
      this.cheatsheetMdList({pid: this.pid});
      if (id) {
        this.$router.push('/edit/' + this.pid + '/' + id)
      }
    },
    handleAvatarSuccess(res) {
      this.form.icon = res.data;
    },
  },
  computed: {
    ...mapGetters([
      'cheatsheetListData',
      'cheatsheetAddData',
      'cheatsheetEditData',
      'cheatsheetDelData',
      'cheatsheetBuildData',
      'cheatsheetMdListData',
      'cheatsheetMdViewData',
      'cheatsheetMdAddData',
      'cheatsheetMdEditData',
      'cheatsheetMdDelData'
    ])
  }
}
</script>

<style scoped>
.item-active {
  background-color: #f2f7fa;
}
</style>