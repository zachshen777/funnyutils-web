<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
          <el-menu-item index="1">图片转换字符画</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="图片转换字符画" name="1">
            <div class="image-conversion">
              <div class="upload-section">
                <el-upload
                  action="#"
                  :show-file-list="false"
                  ref="uploadRef"
                  :before-upload="beforeUpload"
                >
                  <el-button type="primary">上传图片</el-button>
                </el-upload>
                <!-- 图片预览区域 -->
                <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="preview-image" />
              </div>
              <div class="dimensions">
                <label>宽度: <input type="number" v-model="width" min="10" max="500" /></label>
                <label>高度: <input type="number" v-model="height" min="10" max="300" /></label>
              </div>
              <div class="button-section">
                <el-button type="primary" @click="convertImage">确认转换</el-button>
              </div>
              <div class="result-section">
                <pre v-if="asciiResult">{{ asciiResult }}</pre>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const uploadRef = ref(null);
const activeTab = ref('1');
const selectedFile = ref(null);
const asciiResult = ref('');
const previewUrl = ref('');
const width = ref(80);  // 默认宽度
const height = ref(40); // 默认高度

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
    return;
  }
  const formData = new FormData();
  formData.append('image', selectedFile.value);
  // 添加宽度和高度参数
  formData.append('width', width.value);
  formData.append('height', height.value);
  try {
    const response = await axios.post('/api/image-to-ascii', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    asciiResult.value = response.data;
  } catch (error) {
    console.error('转换失败:', error);
  }
};
</script>

<style scoped>
.image-conversion {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.upload-section,
.button-section,
.result-section {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
}
</style>