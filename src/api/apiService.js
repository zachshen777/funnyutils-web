import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080/api', // 后端接口地址
    timeout: 5000
});

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            switch (status) {
                case 429: // 处理限流异常
                    alert(`访问过于频繁，请在 ${data.retryAfter / 1000} 秒后再试`);
                    break;
                default:
                    alert(data.message || '请求发生错误，请稍后再试');
            }
        } else {
            alert('网络连接错误，请检查网络设置');
        }
        return Promise.reject(error);
    }
);

// 示例请求
export const convertImageToAscii = async (file, paramJson) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageParam', paramJson);
    try {
        const response = await instance.post('/image-to-ascii', formData);
        return response.data;
    } catch (error) {
        // 异常已在拦截器中处理
        return null;
    }
};