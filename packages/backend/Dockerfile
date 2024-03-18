# 使用官方的 Node.js 作为基础镜像
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 18411

RUN npx prisma generate

# 启动后端应用
CMD ["npm", "run", "start"]
