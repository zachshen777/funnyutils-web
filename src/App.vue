<template>
  <div id="app">
    <!-- 导航栏 -->
    <header class="navbar">
      <h1 class="site-title">图片转换字符画-Image To Ascii Art</h1>
    </header>
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="1">图片转换字符画</el-menu-item>
      </el-menu>
    </aside>
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 左侧操作区 -->
        <div class="operation-area">
          <div class="upload-section">
            <el-upload
              action="#"
              :show-file-list="false"
              ref="uploadRef"
              :before-upload="beforeUpload"
              drag
              class="drag-upload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <!-- 图片预览区域 -->
            <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="preview-image" />
          </div>
          <div class="dimensions">
            <label>宽度: <input type="number" v-model="width" min="10" max="500" /></label>
            <label>高度: <input type="number" v-model="height" min="10" max="300" /></label>
          </div>
          <!-- 添加拖拉条控件 -->
          <div class="scale-section">
            <label>输出比例: [ {{ scale }} ]</label>
            <el-slider v-model="scale" :min="0" :max="5" step="0.1"></el-slider>
          </div>
          <div class="button-section">
            <el-button type="primary" @click="convertImage">确认转换</el-button>
          </div>
          <!-- 样式切换开关 -->
          <div class="style-toggle">
            <el-switch
              v-model="useStyle1"
              active-text="样式 1"
              inactive-text="样式 2"
            ></el-switch>
          </div>
        </div>
        <!-- 右侧结果展示区 -->
        <div :class="[useStyle1 ? 'result-area1' : 'result-area2']">
          <pre v-if="asciiResult">{{ asciiResult }}</pre>
        </div>
        <div class="result-title-container">
            <h3 class="result-title-vertical">效果展示区</h3>
          </div>
      </div>
    </main>
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p class="copyright">&copy; 2024 图片转换工具. 保留所有权利.</p>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系我们</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const uploadRef = ref(null);
const activeTab = ref('1');
const selectedFile = ref(null);
const asciiResult = ref('');
const previewUrl = ref('');
const width = ref(0);  // 默认宽度为空
const height = ref(0); // 默认高度为空
const scale = ref(1);   // 默认比例值为 1
const useStyle1 = ref(true); // 默认使用样式1

const handleSelect = (key) => {
  activeTab.value = key;
};

const beforeUpload = (file) => {
  selectedFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
  return false;
};

const convertImage = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先上传图片');
    return;
  }
  const formData = new FormData();
  // 初始化 imageParam 对象
  const imageParam = {
    width: width.value,
    height: height.value,
    scale: scale.value
  };

  // 将 imageParam 对象转换为 JSON 字符串
  const imageParamJson = JSON.stringify(imageParam);
  formData.append('image', selectedFile.value);
  formData.append('imageParam', imageParamJson);
  try {
    const response = await axios.post('/api/image-to-ascii', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    asciiResult.value = response.data;
    ElMessage.success('转换成功');
  } catch (error) {
    console.error('转换失败:', error);
    ElMessage.error('转换失败，请稍后重试');
  }
};
</script>

<style scoped>
/* 全局样式 */
body {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
}

/* 导航栏样式 */
.navbar {
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.site-title {
  font-size: 1.5em;
  margin: 0;
}

/* 侧边栏样式 */
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
}

/* 主内容区样式 */
.main-content {
  margin-left: 200px;
  padding: 20px;
  min-height: calc(100vh - 100px);
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.operation-area {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-title {
  color: rgb(0, 183, 255);  /* 颜色 */
  text-align: center;     /* 居中显示 */
  margin: 1px 0 1px 0; 
  padding-bottom: 10px;   /* 底部内边距 */
  border-bottom: 1px solid #eee; /* 底部边框 */
}

.result-area1 {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-area2 {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: monospace;
  line-height: 1; /* 减少行高 */
  white-space: pre;
  letter-spacing: 0.2em; /* 增加字符间距 */
}

.drag-upload {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
}

.drag-upload:hover {
  border-color: #646cff;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
}

/* 按钮样式 */
.el-button {
  transition: background-color 0.3s, transform 0.3s;
}

.el-button:hover {
  transform: scale(1.05);
}

/* 页脚样式 */
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 15px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-left: 200px;
  box-sizing: border-box;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}

.copyright {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer a {
  color: white;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

/* 新增比例输入区域样式 */
.scale-section {
  margin-top: 10px;
}
/* 展示区样式 */
.pre-ascii-art {
    font-family: monospace;
    line-height: 1; /* 减少行高 */
    white-space: pre;
    letter-spacing: 0.5em; /* 增加字符间距 */
}

.result-display-wrapper {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.result-title-container {
  width: 30px;
  background-color: #f9f9f9;
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.result-title-vertical {
  writing-mode: vertical-rl;
  margin: 100px 0; 
  padding: 10px 0;
  color: #646cff;  /* 颜色 */
}
</style>