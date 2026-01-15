# 使用轻量级的 Node.js 20 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 先拷贝 package.json 和 package-lock.json（如果有）
# 这样在代码变动但依赖没变时，可以利用 Docker 缓存跳过 npm install
COPY package*.json ./

# 安装生产环境依赖
RUN npm install --omit=dev

# 拷贝源代码目录
# 注意：这里拷贝的是整个 src 文件夹
COPY src/ ./src/

# 暴露端口（从环境变量获取，默认 3000）
EXPOSE 3000

# 启动命令：指向 src 里的入口文件
# 或者使用 "npm start"，但前提是你在 package.json 里配置了 start 脚本
CMD ["node", "src/index.js"]