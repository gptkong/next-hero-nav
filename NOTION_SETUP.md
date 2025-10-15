# Notion 集成设置指南（使用 react-notion-x）

本项目使用 `react-notion-x` 和 `notion-client`，可以直接通过 **Page ID** 获取 Notion 页面中的 Database 数据。

## 优势

- **无需 API Key**：使用 Notion 的公开 API，无需创建 Integration
- **简单配置**：只需要页面的分享链接或 Page ID
- **直接访问**：可以读取公开分享的 Notion 页面

## 前置条件

1. 一个 Notion 账户
2. 创建一个包含 Database 的 Notion 页面，字段结构如下：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| Name | Title | 服务名称 |
| IP | Text | IP 地址 |
| Internet | URL 或 Text | 互联网访问地址 |
| localAddr | URL 或 Text | 本地访问地址 |
| BasicAuth | Text | 是否需要基础认证（TRUE/FALSE） |
| Status | Text 或 Select | 服务状态（启用/禁用） |
| Virtualization | Text 或 Select | 虚拟化类型 |
| Hardware | Text 或 Select | 硬件平台 |

## 配置步骤

### 1. 创建或准备 Notion Database 页面

1. 在 Notion 中创建一个新页面
2. 在页面中添加一个 Database（Table/Board/List 等任意视图）
3. 确保 Database 包含上述字段

### 2. 分享页面（重要）

1. 打开包含 Database 的 Notion 页面
2. 点击右上角的 "Share" 按钮
3. 点击 "Share to web" 或 "发布到网络"
4. 启用公开访问（这样才能通过 API 读取）

### 3. 获取 Page ID

从 Notion 页面 URL 中获取 Page ID：

```
https://www.notion.so/Your-Page-Name-067dd719a912471ea9a3ac10710e7fdf
                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                      这就是 Page ID
```

或者使用完整 URL 也可以，系统会自动解析。

### 4. 配置环境变量

1. 复制 `.env.local.example` 为 `.env.local`：
   ```bash
   cp .env.local.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的 Page ID：
   ```env
   NOTION_PAGE_ID=067dd719a912471ea9a3ac10710e7fdf
   ```

   或者使用完整 URL：
   ```env
   NOTION_PAGE_ID=https://www.notion.so/Your-Page-Name-067dd719a912471ea9a3ac10710e7fdf
   ```

### 5. 启动开发服务器

```bash
npm run dev
```

### 6. 访问页面

在浏览器中打开：
```
http://localhost:3000/gateway
```

你也可以在页面上直接输入 Page ID 来动态加载不同的数据库。

## API 使用

### 获取数据

```typescript
// 使用环境变量中的默认 Page ID
GET /api/notion

// 或指定 Page ID
GET /api/notion?pageId=067dd719a912471ea9a3ac10710e7fdf

// 或使用完整 URL
GET /api/notion?pageId=https://www.notion.so/Your-Page-Name-067dd719a912471ea9a3ac10710e7fdf
```

### 响应格式

```json
{
  "success": true,
  "data": [
    {
      "Name": "mihomo",
      "IP": "10.0.0.1",
      "Internet": "https://mihomo.home.ueyeseas.com:8443",
      "localAddr": "http://10.0.0.1:9090",
      "BasicAuth": false,
      "Status": "启用",
      "Virtualization": "Immortal",
      "Hardware": "PVE"
    }
  ],
  "count": 1
}
```

## 功能特性

- 实时从 Notion Database 获取数据
- 美观的表格展示，使用 HeroUI 组件
- 支持刷新按钮手动更新数据
- 状态标签彩色显示
- 链接可直接跳转访问
- 响应式设计，支持移动端

## 动态使用（无需配置环境变量）

你也可以不配置环境变量，直接在页面上输入 Page ID：

1. 访问 `http://localhost:3000/gateway`
2. 在页面顶部的输入框中输入你的 Page ID
3. 点击"加载数据"按钮

或者通过 URL 参数传递：
```
http://localhost:3000/gateway?pageId=067dd719a912471ea9a3ac10710e7fdf
```

## 故障排查

### 错误：Page not found 或 Unauthorized

**原因**：页面未公开分享

**解决方案**：
1. 打开你的 Notion 页面
2. 点击右上角的 "Share"
3. 启用 "Share to web" / "发布到网络"
4. 确保页面是公开可访问的

### 错误：No database found in this page

**原因**：页面中没有 Database，或 Page ID 指向的不是包含 Database 的页面

**解决方案**：
1. 确保 Page ID 指向的页面包含一个 Database（Table/Board/List 等）
2. 如果 Database 是内嵌在页面中的，确保它在页面的顶层，不要嵌套太深

### 错误：Invalid page ID format

**原因**：Page ID 格式不正确

**解决方案**：
1. 从 URL 中复制完整的 Page ID（32 位字符串）
2. 或直接使用完整的 Notion URL

### 数据显示为空

**检查**：
1. Database 中是否有数据
2. 字段名称是否与配置一致（区分大小写）：Name, IP, Internet, localAddr, BasicAuth, Status, Virtualization, Hardware
3. 页面是否已公开分享
4. 查看浏览器控制台和终端的错误信息

### CORS 错误

**原因**：浏览器跨域限制

**解决方案**：
这个项目使用服务端 API 路由，不应该遇到 CORS 问题。如果遇到，检查：
1. 是否正确使用了 `/api/notion` 端点
2. Next.js 开发服务器是否正常运行

## 技术栈

- Next.js 15（App Router）
- react-notion-x（Notion 内容渲染）
- notion-client（Notion API 客户端）
- notion-utils（工具函数）
- HeroUI（React UI 组件库）
- TypeScript
- Tailwind CSS

## 与官方 SDK 的区别

| 特性 | react-notion-x | @notionhq/client (官方) |
|------|----------------|------------------------|
| API Key | 不需要 | 需要 |
| Integration | 不需要 | 需要创建 |
| 页面权限 | 公开分享即可 | 需要明确授权 |
| 使用方式 | 通过 Page ID | 通过 Database ID |
| 访问限制 | 仅公开页面 | 可访问私有内容 |
| 适用场景 | 公开展示、快速原型 | 生产环境、私有数据 |

## 高级用法

### 在代码中直接使用

```typescript
import { NotionAPI } from 'notion-client';
import { parsePageId } from 'notion-utils';

const notion = new NotionAPI();

async function fetchNotionData(pageUrl: string) {
  const pageId = parsePageId(pageUrl);
  const recordMap = await notion.getPage(pageId);

  // 处理 recordMap 中的数据
  console.log(recordMap.collection);
  console.log(recordMap.block);
}
```

### 支持的 Notion 元素

- Tables（表格）
- Boards（看板）
- Lists（列表）
- Galleries（画廊）
- Calendars（日历）
- Timeline（时间线）

所有这些视图类型都可以被正确读取和解析。
