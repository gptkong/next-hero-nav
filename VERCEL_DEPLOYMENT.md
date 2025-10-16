# Vercel 部署指南

本指南将帮助您将 Next Hero Nav 项目部署到 Vercel 平台。

## 前置条件

1. 一个 [Vercel](https://vercel.com/) 账户
2. 一个 [GitHub](https://github.com/) 账户
3. 项目代码已推送到 GitHub 仓库
4. 一个已配置好的 Notion 数据库页面

## 部署步骤

### 1. 准备 Notion 模板和数据

1. 复制 Notion 模板：
   - 访问：https://flower-hide-2a1.notion.site/28ea6d8650b4802b8dd8de251b6db52e?v=28ea6d8650b4818cbb0f000c4b3335d9&source=copy_link
   - 点击右上角的"复制"按钮，将模板复制到您的 Notion 工作区

2. 获取 Notion 页面 ID：
   - 打开您复制的 Notion 页面
   - 从浏览器地址栏中复制页面 ID（32 位字符串）
   - 例如：`https://www.notion.so/Your-Page-Name-289a6d8650b480ee8fc8e16a38edf204` 中的 `289a6d8650b480ee8fc8e16a38edf204`

3. 确保页面已公开分享：
   - 点击右上角的"Share"按钮
   - 启用"Share to web"或"发布到网络"
   - 确保页面是公开可访问的

### 2. 准备 GitHub 仓库

1. 复制项目代码：
   - 访问：https://github.com/gptkong/next-hero-nav
   - Fork 该仓库到您的 GitHub 账户
   - 或者克隆该仓库并推送到您的新仓库

2. 如果您选择克隆并推送到新仓库：
   ```bash
   git clone https://github.com/gptkong/next-hero-nav.git
   cd next-hero-nav
   git remote set-url origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

### 3. 部署到 Vercel

#### 方法一：通过 Vercel 网站部署

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)

2. 点击"Add New..."按钮，选择"Project"

3. 导入 GitHub 仓库：
   - 在"Import Git Repository"部分找到您的仓库
   - 点击"Import"按钮

4. 配置项目：
   - **Project Name**: 输入您的项目名称（可选）
   - **Framework**: Vercel 会自动检测为 Next.js
   - **Root Directory**: 保持默认（根目录）
   - **Build Command**: 保持默认（`npm run build`）
   - **Output Directory**: 保持默认（`.next`）
   - **Install Command**: 保持默认（`npm install`）

5. 配置环境变量：
   - 在"Environment Variables"部分添加以下变量：
   - **Name**: `NOTION_PAGE_ID`
   - **Value**: 您在步骤 1 中获取的 Notion 页面 ID
   - 点击"Add"按钮添加环境变量

6. 部署项目：
   - 点击"Deploy"按钮开始部署
   - 等待部署完成（通常需要 1-2 分钟）

#### 方法二：通过 Vercel CLI 部署

1. 安装 Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 登录 Vercel：
   ```bash
   vercel login
   ```

3. 在项目目录中运行：
   ```bash
   cd next-hero-nav
   vercel
   ```

4. 按照提示配置项目：
   - 选择链接到现有项目或创建新项目
   - 确认设置
   - 添加环境变量 `NOTION_PAGE_ID`

5. 部署生产版本：
   ```bash
   vercel --prod
   ```

### 4. 配置环境变量（重要）

在 Vercel 项目设置中配置环境变量：

1. 在 Vercel Dashboard 中进入您的项目

2. 点击"Settings"选项卡

3. 在左侧菜单中选择"Environment Variables"

4. 添加以下环境变量：
   - **Key**: `NOTION_PAGE_ID`
   - **Value**: 您的 Notion 页面 ID
   - **Environments**: 选择 Production, Preview, Development

5. 点击"Save"保存

6. 重新部署项目以应用环境变量：
   - 进入"Deployments"选项卡
   - 点击最新部署右侧的三个点
   - 选择"Redeploy"

### 5. 验证部署

1. 访问 Vercel 提供的 URL（格式为 `https://your-project-name.vercel.app`）

2. 检查页面是否正常加载 Notion 数据

3. 如果数据未显示：
   - 检查环境变量是否正确设置
   - 确认 Notion 页面已公开分享
   - 查看 Vercel 的函数日志以排查问题

## 常见问题排查

### 问题 1：页面显示"Page not found"或"Unauthorized"

**解决方案**：
1. 确认 Notion 页面已公开分享
2. 检查环境变量 `NOTION_PAGE_ID` 是否正确
3. 确认页面 ID 格式正确（32 位字符串）

### 问题 2：部署成功但页面空白

**解决方案**：
1. 检查 Vercel 的函数日志
2. 确认所有依赖都正确安装
3. 检查环境变量是否在部署后生效

### 问题 3：数据加载缓慢

**解决方案**：
1. Notion API 有一定的速率限制
2. 考虑添加缓存机制
3. 优化 Notion 数据库结构

## 自动部署设置

设置 GitHub 与 Vercel 的集成，实现自动部署：

1. 在 Vercel 项目中，进入"Settings" > "Git Integration"

2. 确保已连接到正确的 GitHub 仓库

3. 在"Deploy Hooks"部分可以创建部署钩子

4. 配置分支规则：
   - 主分支（main/master）自动部署到 Production
   - 其他分支自动部署到 Preview

## 自定义域名

1. 在 Vercel 项目中，进入"Settings" > "Domains"

2. 添加您的自定义域名

3. 按照提示配置 DNS 记录

4. 等待 SSL 证书自动生成

## 性能优化建议

1. 启用 Vercel Analytics 监控性能
2. 配置图片优化
3. 使用 Vercel Edge Functions 优化 API 响应
4. 考虑添加 Vercel KV 进行数据缓存

## 总结

通过以上步骤，您已成功将 Next Hero Nav 项目部署到 Vercel。主要步骤包括：

1. 准备 Notion 数据库并获取页面 ID
2. 将代码推送到 GitHub
3. 在 Vercel 中导入项目并配置环境变量
4. 部署并验证应用

如需进一步帮助，请参考：
- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [项目 Notion 配置指南](./NOTION_SETUP.md)