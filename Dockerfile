# 构建阶段
FROM node:24.2.0 as builder
WORKDIR /www/wwwroot/funnyutils-web
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:1.25
COPY --from=builder /www/wwwroot/funnyutils-web/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]