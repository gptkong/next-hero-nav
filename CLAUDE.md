# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
# 开发环境运行（使用 Turbopack）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查和自动修复
npm run lint
```

## 项目架构

这是一个基于 Next.js 15 (App Router) 的家庭网关管理系统，使用 Notion 作为无服务器后端数据库。

### 核心技术栈
- **前端**: Next.js 15 + TypeScript + HeroUI v2 + Tailwind CSS
- **后端**: Next.js API Routes + Notion API (通过 react-notion-x)
- **状态管理**: React Context (网络类型切换)
- **主题**: next-themes (明暗主题切换)

### 数据流架构
1. **数据源**: Notion 数据库作为后端存储
2. **API层**: `/api/notion` 路由处理 Notion 数据获取和转换
3. **组件层**: 主页面 (`app/page.tsx`) 负责数据展示和交互
4. **状态管理**: `NetworkContext` 管理内网/外网切换状态

### 关键设计模式

**Notion 数据处理** (`app/api/notion/route.ts`):
- 使用 `notion-client` 库无需 API 密钥访问公开 Notion 页面
- 动态解析 Notion 数据库结构并转换为 `HomeGatewayItem` 类型
- 实现缓存控制以获取实时数据

**双视图渲染** (`app/page.tsx`):
- 卡片视图：适合移动设备，显示核心信息
- 表格视图：适合桌面设备，显示完整字段和排序功能
- 基于 `LayoutType` 状态动态切换渲染模式

**网络类型感知**:
- 通过 `NetworkContext` 全局管理内网/外网访问偏好
- 根据网络类型自动选择合适的访问地址 (Internet vs localAddr)

### 环境配置

必需的环境变量：
```env
NOTION_PAGE_ID=your_notion_page_id_here
```

从 Notion URL 中提取页面 ID：`https://www.notion.so/Your-Page-Name-{PAGE_ID}`

### Notion 数据库结构

系统期望 Notion 数据库包含以下字段：
- `Name` (Title): 服务名称
- `IP` (Text): IP 地址
- `Internet` (URL/Text): 互联网访问地址
- `localAddr` (URL/Text): 本地访问地址
- `BasicAuth` (Checkbox): 是否需要基础认证
- `Status` (Select): 服务状态 (启用/禁用)
- `Virtualization` (Select): 虚拟化类型
- `Hardware` (Select): 硬件平台

### 组件结构

主要组件：
- `app/page.tsx`: 主页面，包含完整的业务逻辑
- `contexts/NetworkContext.tsx`: 网络类型状态管理
- `components/navbar.tsx`: 顶部导航栏
- `components/theme-switch.tsx`: 主题切换组件

### 数据类型定义

`types/homegateway.ts` 定义了核心数据结构：
- `HomeGatewayItem`: 网关服务项接口
- `NotionDatabaseResponse`: Notion API 响应类型

### 开发注意事项

1. **pnpm 用户**: 需要在 `.npmrc` 中添加 `public-hoist-pattern[]=*@heroui/*`
2. **Notion 集成**: 使用公开 Notion 页面，无需 API 密钥
3. **实时数据**: API 路由禁用缓存确保数据实时性
4. **响应式设计**: 支持桌面和移动设备的自适应布局