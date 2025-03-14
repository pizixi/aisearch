# 聚合搜索

一个优雅的聚合搜索页面，支持传统搜索、AI搜索、社交搜索、网盘搜索和影视搜索等多个搜索分类。支持快捷键呼出，深色模式，以及搜索历史记录功能。

## 特性

- 🎯 一站式搜索：支持多个搜索引擎和平台
- 🎨 优雅的界面：现代化设计，支持深色模式
- 📝 搜索历史：自动保存搜索记录，方便重复查询
- 🖱️ 右键选择：右键点击可选择默认搜索引擎
- 📱 响应式设计：完美支持各种设备尺寸
- 🚀 极速部署：一键部署到 Vercel

## 快速部署

### 部署到 Vercel

1. Fork 本项目到你的 GitHub 账号

2. 访问 [Vercel](https://vercel.com/) 并登录（如果没有账号，可以使用 GitHub 账号注册）

3. 点击 "New Project"

4. 从 "Import Git Repository" 列表中找到并选择你 fork 的项目

5. 保持默认设置，直接点击 "Deploy"

部署完成后，Vercel 会自动生成一个域名供你访问。你也可以在项目设置中绑定自己的自定义域名。

# 图标下载器

这个Go程序用于下载HTML页面中的所有图标到本地，并替换HTML中的图标URL为本地路径。

## 功能

- 解析HTML文件提取所有图标URL
- 创建本地ico目录（如果不存在）
- 下载所有图标到本地
- 修改HTML文件，将图标URL替换为本地路径

## 使用方法

1. 确保已安装Go环境
2. 安装依赖：`go get golang.org/x/net/html`
3. 将HTML文件命名为`index.html`并放在与程序相同的目录下
4. 运行程序：`go run icon_downloader.go`
5. 程序会创建`ico`目录并下载所有图标
6. HTML文件会被更新，图标URL会被替换为本地路径

## 注意事项

- 程序会尝试下载所有包含`favicon`、`icon`或`logo`的图片URL
- 如果下载失败，程序会跳过该图标并继续处理其他图标
- 程序使用并发下载，默认最大并发数为10

