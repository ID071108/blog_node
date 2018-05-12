= blog
>这是一个博客, 基于jquery, node, express, swig, mongoDB, mongoose等.

## 项目结构
+ db 数据库
+ models 数据库模型
    - Category.js 博客类别
    - Content.js 博客文章
    - User.js 博客用户
+ public 静态文件夹
    - css 样式
    - fontAwesome 字体文件
    - fontFamily 字体文件
    - images
    - js
+ routes 路由配置
    - admin.js 管理员路由配置
    - api.js 接口路由
    - main.js 首页路由配置
+ schemas 表文件
    - Category.js 博客类别
    - Content.js 博客文章
    - User.js 博客用户
+ view 页面文件夹
    - admin 管理员界面
    - components 公共组件
    - main 博客首页
+ webpack 
    - basic 公共配置
    - dev 开发环境
    - prod 生产环境
+ app.js 入口文件
+ package.json 配置信息

## 启动项目
1. 启动服务器
> cd 到mongod所在的bin目录
>> $ cd D:\MongoDB\Server\3.6\bin
>> $ .\mongod --dbpath=E:\git\blog\db --port=27018
2. 连接服务器
> 可以通过robomongo这个工具软件来建立连接
3. 启动项目
> $ node app.js

## 当前效果图
homePage: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "homepage")
#项目尚不完整！！！
