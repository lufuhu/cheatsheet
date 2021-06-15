<template>
  <div>
    <div class="w-screen h-screen flex">
      <div class="flex-none w-64 flex flex-col h-full">
        <div class="border-b flex-none h-10 px-3 flex items-center justify-center">
          <router-link to="/" class="flex-1 flex items-center">
            <img class="w-6 h-6" src="../assets/logo.png">
            <div class="font-bold text-sm">速查表</div>
          </router-link>
          <router-link to="/edit">
            <el-button size="mini" type="text" round><i class="el-icon-plus"></i>新增</el-button>
          </router-link>
        </div>
        <div class="flex-1 overflow-y-auto overflow-x-hidden h-0">
          <el-input
              class="input-b-border"
              placeholder="请输入关键字"
              v-model="params.keyword">
            <i @click="onSearch()" slot="suffix" class="el-input__icon el-icon-search cursor-pointer"></i>
          </el-input>
          <div
              v-for="(item, index) in list"
              :key="index"
              :class="form.id === item.id ? 'item-active':''"
              class="flex items-center justify-between px-3 border-b cursor-pointer">
            <router-link class="flex-1 truncate py-3 text-sm" :to="'/edit/'+item.id">
              {{ item.title }}
            </router-link>
            <div class="px-2">
              <el-dropdown trigger="click">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <a :href="'/articles/'+item.title +'.html'" target="_blank">查看</a>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="clickDel(item)">删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="h-12 flex-none">
          <el-pagination
              class="mt-2"
              :background="true"
              :hide-on-single-page="true"
              layout="prev, pager, next"
              :current-page="params.page"
              :total="total"
              :page-size="per_page"
              @current-change="paginationChange">
          </el-pagination>
        </div>
      </div>
      <div
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(225, 225, 225, 0.8)"
          class="flex-1 flex flex-col w-full h-full">
        <div class="flex-none flex items-center">
          <el-input v-model="form.title" class="input-b-border" placeholder="标题"></el-input>
          <el-button class="mx-1" size="small" type="primary" @click="showDialog()">保存</el-button>
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
        title="其他"
        :visible.sync="dialogVisible"
        width="60vh">
      <el-form ref="form" size="small" :model="form" label-width="45px">
        <el-tabs v-model="form.type" @tab-click="handleClick">
          <el-tab-pane label="默认" name="0"></el-tab-pane>
          <el-tab-pane label="博客文章" name="1">
            <el-form-item label="话题">
              <el-select
                  class="w-full"
                  v-model="form.topic"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择">
                <el-option
                    v-for="(item, index) in enumTopic"
                    :key="index"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select
                  class="w-full"
                  v-model="form.tag"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择">
                <el-option
                    v-for="(item, index) in enumTag"
                    :key="index"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="开源项目" name="2">
            <el-form-item label="图片">
              <el-upload
                  class="avatar-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess">
                <img v-if="form.pic" :src="form.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="轮播图" name="3">
            <el-form-item label="图片">
              <el-upload
                  class="avatar-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess">
                <img v-if="form.pic" :src="form.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item label="简介">
          <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="请输入内容"
              v-model="form.summary">
          </el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-link"
              v-model="form.url">
          </el-input>
        </el-form-item>
        <div class="flex">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                  v-for="(item, index) in enumStatus"
                  :key="index"
                  :label="item.value"
                  :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="ml-2" label="排序">
            <el-input-number v-model="form.sort" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </div>
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
        title: "",
        type: '1',
        pic: "",
        url: "",
        topic: "",
        tag: [],
        sort: 0,
        content: "",
        summary: "",
        status: 1,
      },
      enumStatus: {},
      enumType: {},
      enumTag: [],
      enumTopic: [],
      edIframeWin: {},
      isIframeOnload: false,
      isDetailsData: false,
      dialogVisible: false,
      list: [],
      current_page: 0,
      per_page: 0,
      total: 0,
      params: {
        keyword: '',
      },
      loading: false,
    }
  },
  watch: {
    articleGetEnumData: function (val) {
      this.enumStatus = val.data.enumStatus
      this.enumType = val.data.enumType
    },
    articleGetSelectData: function (val) {
      this.enumTag = val.data.tag
      this.enumTopic = val.data.topic
    },
    articleViewData: function (val) {
      this.form = val.data
      this.isDetailsData = true;
      this.form.type = this.form.type.toString();
      this.setContent();
      this.loading = false
    },
    articleAddData: function (val) {
      this.onSaveSuccess(val.data)
    },
    articleEditData: function (val) {
      this.onSaveSuccess(val.data)
    },
    articleListData: function (val) {
      this.list = val.data.data
      this.per_page = val.data.per_page
      this.total = val.data.total
    },
    articleDelData: function () {
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.articleList(this.params);
    },
    $route() {
      this.getDetails();
    }
  },
  mounted() {
    this.edIframeWin = this.$refs.editormd.contentWindow;
    this.articleGetEnum();
    this.articleGetSelect();
    this.articleList(this.params);
    this.getDetails();
    let that = this;
    window.addEventListener("message", function (event) {
      let data = event.data;
      switch (data.method) {
        case 'onLoad': //初始化完成
          that.isIframeOnload = true;
          that.setContent();
          break;
        case 'onChange': //内容改变事件
          that.form.content = data.content;
          break;
      }
    }, false);
  },
  methods: {
    ...mapActions([
      'articleGetSelect', 'articleGetEnum', 'articleView', 'articleList', 'articleAdd', 'articleEdit', 'articleDel'
    ]),
    onSearch(){
      this.params.page = 1;
      this.params.cache = false;
      this.articleList(this.params)
    },
    paginationChange(page){
      this.params.page = page;
      this.params.cache = false;
      this.articleList(this.params)
    },
    showDialog(){
      this.dialogVisible = true;
    },
    handleClick(tab) {
      this.form.type = tab.name;
    },
    getDetails() {
      this.loading = false;
      if (this.$route.params.id) {
        this.form.id = this.$route.params.id;
        this.loading = true;
        this.articleView({id: this.form.id});
      } else {
        this.form = this.$options.data().form;
        this.setContent();
      }
    },
    onSubmit() {
      if (this.form.id) {
        this.articleEdit(this.form);
      } else {
        this.articleAdd(this.form);
      }
    },
    onSaveSuccess(val) {
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
      this.dialogVisible = false;
      this.articleList(this.params);
      if (val) {
        this.$router.push('/edit/' + val)
      }
    },
    setContent() {
      if (this.isDetailsData && this.isIframeOnload) {
        this.edIframeWin.postMessage({
          method: 'setContent',
          content: this.form.content
        }, "*");
      }
    },
    clickDel(item) {
      this.$confirm("是否删除此文章（" + item.title + "）", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.articleDel({id: item.id});
        if (parseInt(this.$route.params.id) === item.id) {
          this.$router.push('/edit');
        }
      });
    },
    handleAvatarSuccess(res) {
      console.log(res)
      this.form.pic = res.data;
    },
  },
  computed: {
    ...mapGetters([
      'articleGetSelectData', 'articleGetEnumData', 'articleViewData', 'articleListData', 'articleAddData', 'articleEditData', 'articleDelData'
    ])
  }
}
</script>

<style scoped>
.item-active {
  background-color: #f2f7fa;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>