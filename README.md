# Medusa Next SQLite Monolith

基于 **Next.js + Tailwind CSS + SQLite 文件数据库** 的单体全栈模板，并用 **`@medusajs/framework` workflows** 作为业务编排层。

> 说明：你要求的是「SQLite + 不分前后端」方案，因此这里没有采用官方 Medusa backend + storefront 的 PostgreSQL 双应用结构，而是采用 **一个 Next.js 应用承载页面、表单、API、业务 workflow 和 SQLite 持久化** 的方式。

## 技术栈

- **Next.js 16**：App Router + Server Components + Route Handlers
- **Tailwind CSS 4**：页面样式
- **SQLite**：本地文件数据库，默认位于 `data/medusa-monolith.sqlite`
- **Drizzle ORM**：类型安全的数据访问
- **@medusajs/framework/workflows-sdk**：商品 CRUD 的 workflow 编排
- **Zod**：表单与 API 请求校验

## 页面与能力

- `/`：项目首页，展示架构说明和精选商品
- `/products`：前台商品列表页
- `/dashboard`：后台控制台，可创建商品、切换发布状态、设为推荐
- `/dashboard/products/[id]`：商品编辑页
- `/api/products`：商品 JSON API
- `/api/products/[id]`：单商品 JSON API

## 快速开始

```bash
pnpm install
pnpm db:init
pnpm dev
```

然后访问：

- http://localhost:3000
- http://localhost:3000/dashboard
- http://localhost:3000/api/products

## 环境变量

复制一份：

```bash
cp .env.example .env.local
```

可配置：

```bash
DATABASE_FILE_PATH=data/medusa-monolith.sqlite
```

## 常用命令

```bash
pnpm dev
pnpm db:init
pnpm lint
pnpm build
pnpm check
```

## API 示例

### 查询商品

```bash
curl http://localhost:3000/api/products
```

### 创建商品

```bash
curl -X POST http://localhost:3000/api/products \
  -H 'content-type: application/json' \
  -d '{
    "title": "新商品",
    "description": "这是一个通过 Medusa workflow 创建的新商品示例。",
    "price": 18800,
    "inventory": 12,
    "status": "published",
    "featured": true
  }'
```

## 后续扩展建议

- 接入用户认证和后台权限
- 增加订单、购物车、地址、支付模块
- 在 workflow 中加入通知、审计日志、库存补偿
- 将 SQLite 替换为 PostgreSQL / MySQL，并保留 workflow 层不动
