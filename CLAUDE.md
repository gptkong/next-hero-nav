# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 变更记录 (Changelog)

- 2025-10-16: 更新架构文档，补充ESLint配置、Tailwind CSS细节、组件结构说明
- 2025-10-16: 添加包管理器配置和构建环境说明
- 2025-10-16: 完善Notion API集成的技术细节

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
- **前端**: Next.js 15 + TypeScript + HeroUI v2 + Tailwind CSS 4.1.11
- **后端**: Next.js API Routes + Notion API (通过 react-notion-x)
- **状态管理**: React Context (网络类型切换)
- **主题**: next-themes (明暗主题切换)
- **图标**: Lucide React
- **代码质量**: ESLint + Prettier + TypeScript

### 开发环境配置

**包管理器配置** (`.npmrc`):
```
package-lock=true
```

**ESLint 配置** (`eslint.config.mjs`):
- 使用 TypeScript ESLint 解析器
- 集成 React、JSX A11y、Prettier 插件
- 支持未使用导入检查和自动清理
- 自定义排序和格式化规则

**Tailwind CSS 配置**:
- 使用 HeroUI 主题插件
- 支持明暗主题切换 (`darkMode: "class"`)
- 自定义字体配置 (font-sans, font-mono)
- 包含 HeroUI 组件库样式

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
- 支持时区配置 (`Asia/Shanghai`)

**双视图渲染** (`app/page.tsx`):
- 卡片视图：适合移动设备，显示核心信息
- 表格视图：适合桌面设备，显示完整字段和排序功能
- 基于 `LayoutType` 状态动态切换渲染模式
- 集成搜索、过滤、排序功能

**网络类型感知**:
- 通过 `NetworkContext` 全局管理内网/外网访问偏好
- 根据网络类型自动选择合适的访问地址 (Internet vs localAddr)

### 组件结构

**主要组件**:
- `app/page.tsx`: 主页面，包含完整的业务逻辑
- `contexts/NetworkContext.tsx`: 网络类型状态管理
- `components/navbar.tsx`: 顶部导航栏
- `components/theme-switch.tsx`: 主题切换组件
- `components/primitives.ts`: UI 样式基元和工具函数
- `components/icons.tsx`: 自定义图标组件
- `components/counter.tsx`: 计数器组件

**数据类型定义** (`types/homegateway.ts`):
- `HomeGatewayItem`: 网关服务项接口
- `NotionDatabaseResponse`: Notion API 响应类型

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

### 构建配置

**Next.js 配置** (`next.config.js`):
- 使用默认配置，无特殊定制
- 支持 App Router 和 Server Components

**TypeScript 配置**:
- 目标版本：ES5
- 模块解析：Node
- 路径别名：`@/*` 映射到项目根目录
- 严格模式开启

### 开发注意事项

1. **pnpm 用户**: 需要在 `.npmrc` 中添加 `public-hoist-pattern[]=*@heroui/*`
2. **Notion 集成**: 使用公开 Notion 页面，无需 API 密钥
3. **实时数据**: API 路由禁用缓存确保数据实时性
4. **响应式设计**: 支持桌面和移动设备的自适应布局
5. **代码质量**: ESLint 会自动修复代码格式和未使用导入
6. **主题系统**: 默认使用暗色主题，支持明暗切换

### AI 使用指引

**代码生成建议**：
1. 遵循现有的 TypeScript 接口定义
2. 使用 HeroUI 组件库保持 UI 一致性
3. 利用 Tailwind CSS 进行样式开发
4. 遵循 ESLint 规则保持代码质量
5. 使用 Lucide React 图标库

**开发最佳实践**：
1. 组件应支持暗色主题
2. 响应式设计优先考虑移动端
3. 错误处理应包含用户友好的提示
4. 数据加载状态使用 Skeleton 或 Spinner
5. 遵循现有的文件命名和组织结构