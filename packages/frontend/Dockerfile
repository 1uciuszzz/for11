# 使用官方的 Node.js 作为基础镜像
FROM node:latest AS builder

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将所有文件复制到工作目录
COPY . .

# 构建前端应用
RUN npm run build

# 使用 Nginx 作为运行时镜像
FROM nginx:latest

# 将前端应用的静态文件复制到 Nginx 默认的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 默认的端口
EXPOSE 90

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
