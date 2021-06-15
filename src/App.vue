<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
.input-b-border input {
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  color: #8c939d;
  width: 72px;
  height: 72px;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.avatar {
  width: 72px;
  height: 72px;
  display: block;
}
.el-dialog__body {
  padding: 20px 20px 0 20px;
}
</style>
