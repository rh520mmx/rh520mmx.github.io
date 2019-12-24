from node:lts as builder
WORKDIR /src
# 构建缓存
COPY package.json ./
RUN yarn

COPY . . 
RUN  yarn build:prod


from nginx:stable
COPY --from=builder /src/dist /usr/share/nginx/html
