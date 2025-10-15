# Next.js & HeroUI Template

This is a template for creating applications using Next.js 14 (app directory) and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/heroui/next-app-template)

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## Database Schema

本项目使用 Notion 作为数据库，用于存储家庭网关服务信息。数据库包含以下字段：

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

### 数据库配置

详细的数据库配置说明请参考 [NOTION_SETUP.md](./NOTION_SETUP.md) 文档。

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
