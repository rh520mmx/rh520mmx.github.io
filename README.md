## 1、目录结构说明
```
├── build                      # 构建相关
├── mock                       # 项目mock 模拟数据
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体 图片等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── icons                  # 项目所有 svg icons
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
├── tests                      # 测试
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── ..eslintignore.js          # eslint 配置项忽略配置
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```

## 2、项目生成服务

```bash
# 进入项目目录
cd earth

# 安装依赖
npm install 或者 yarn

# 建议使用yarn 不要直接使用 cnpm/npm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev 或者 yarn dev
```

#### 本地浏览器访问 [http://localhost:9528](http://localhost:9528)

## 3、发布

```bash
# 构建测试环境 
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 4、其它命令

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
## 5、开发过程中遇到的坑总结
```
1 el-scrollbar设置overflow-x: hidden 会导致el-select纵向显示不全
2 router-link 如果直接以模板字符串的形式 (`<router-link></router-link>`)不会被解析成a标签
   
```
