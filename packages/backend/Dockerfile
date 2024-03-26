# 使用官方的 Node.js 作为基础镜像
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate

RUN npx prisma migrate

# 启动后端应用
CMD ["npm", "run", "start"]
