# Home Gateway 管理系统

一个基于 Next.js 和 Notion 数据库的家庭网关服务管理系统，提供直观的界面来管理和监控家庭网络中的各种服务。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![HeroUI](https://img.shields.io/badge/HeroUI-v2-purple)

## 项目特性

- 🏠 **家庭网关服务管理**：集中管理家庭网络中的各种服务
- 📊 **双视图模式**：支持卡片和表格两种展示方式
- 🔍 **搜索与过滤**：快速定位所需服务
- 🌐 **网络切换**：支持内网/外网访问地址切换
- 📱 **响应式设计**：完美适配桌面和移动设备
- 🌙 **暗色模式**：内置明暗主题切换
- 🔗 **Notion 集成**：使用 Notion 作为后端数据库，无需服务器
- ⚡ **实时更新**：支持手动刷新获取最新数据

## 技术栈

- **前端框架**：[Next.js 15](https://nextjs.org/) (App Router)
- **UI 组件库**：[HeroUI v2](https://heroui.com/)
- **样式框架**：[Tailwind CSS](https://tailwindcss.com/)
- **类型系统**：[TypeScript](https://www.typescriptlang.org/)
- **动画库**：[Framer Motion](https://www.framer.com/motion/)
- **主题系统**：[next-themes](https://github.com/pacocoursey/next-themes)
- **后端集成**：[Notion API](https://developers.notion.com/) (通过 react-notion-x)
- **图标库**：[Lucide React](https://lucide.dev/)
- **开发工具**：ESLint, Prettier

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd next-hero-nav
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.local.example .env.local
   ```
   
   编辑 `.env.local` 文件，添加你的 Notion 页面 ID：
   ```env
   NOTION_PAGE_ID=your-notion-page-id-here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### pnpm 配置（可选）

如果你使用 `pnpm`，需要在 `.npmrc` 文件中添加以下内容：

```bash
public-hoist-pattern[]=*@heroui/*
```

修改后需要重新运行 `pnpm install` 确保依赖正确安装。

## 项目结构

```
next-hero-nav/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── notion/        # Notion 数据 API
│   ├── layout.tsx         # 根布局组件
│   ├── page.tsx           # 主页面
│   ├── providers.tsx      # 全局提供者
│   └── error.tsx          # 错误页面
├── components/            # React 组件
│   ├── navbar.tsx         # 导航栏组件
│   ├── theme-switch.tsx   # 主题切换组件
│   └── ...                # 其他 UI 组件
├── contexts/              # React Context
│   └── NetworkContext.tsx # 网络类型上下文
├── config/                # 配置文件
│   ├── fonts.ts           # 字体配置
│   └── site.ts            # 网站配置
├── types/                 # TypeScript 类型定义
│   ├── homegateway.ts     # 网关服务类型
│   └── index.ts           # 通用类型
├── styles/                # 样式文件
│   └── globals.css        # 全局样式
├── public/                # 静态资源
├── .env.local.example     # 环境变量示例
├── NOTION_SETUP.md        # Notion 配置指南
└── README.md              # 项目说明
```

## 功能特性详解

### 🏠 服务管理

系统通过 Notion 数据库管理家庭网关服务，支持以下信息：

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| Name | Title | 服务名称 | mihomo |
| IP | Text | IP 地址 | 10.0.0.1 |
| Internet | URL/Text | 互联网访问地址 | https://mihomo.home.ueyeseas.com:8443 |
| localAddr | URL/Text | 本地访问地址 | http://10.0.0.1:9090 |
| BasicAuth | Checkbox | 是否需要基础认证 | false |
| Status | Select | 服务状态 | 启用/禁用 |
| Virtualization | Select | 虚拟化类型 | Immortal/Docker/VM |
| Hardware | Select | 硬件平台 | PVE/ESXI/X86 |

### 📊 视图模式

- **卡片视图**：以卡片形式展示服务信息，直观显示关键信息
- **表格视图**：以表格形式展示所有字段，支持排序功能

### 🔍 搜索与过滤

- 支持按服务名称、IP地址、硬件平台搜索
- 实时过滤，无需点击搜索按钮
- 显示过滤结果数量

### 🌐 网络切换

- **外网模式**：显示并使用互联网访问地址
- **内网模式**：显示并使用本地访问地址
- 根据网络环境自动选择合适的访问方式

## API 文档

### 获取 Notion 数据

**端点**：`GET /api/notion`

**参数**：
- `pageId` (可选): Notion 页面 ID，如果不提供则使用环境变量中的值

**请求示例**：
```bash
# 使用环境变量中的默认页面 ID
GET /api/notion

# 指定页面 ID
GET /api/notion?pageId=067dd719a912471ea9a3ac10710e7fdf

# 使用完整 URL
GET /api/notion?pageId=https://www.notion.so/Your-Page-Name-067dd719a912471ea9a3ac10710e7fdf
```

**响应格式**：
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
  "count": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**：
```json
{
  "error": "Page ID is required",
  "details": "Pass ?pageId=xxx or set NOTION_PAGE_ID in .env"
}
```

### 数据库配置

详细的 Notion 数据库配置说明请参考 [NOTION_SETUP.md](./NOTION_SETUP.md) 文档。

## 开发指南

### 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
NOTION_PAGE_ID=your-notion-page-id-here
```

### 构建和部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 代码规范

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 检查代码规范
npm run lint

# 自动修复代码格式
npm run lint -- --fix
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
