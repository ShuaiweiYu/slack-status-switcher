# Slack Status Switcher (No Fallback)

一个小型 Node.js Web 服务：iPhone 快捷指令发 HTTP API call -> 自动更新你的 Slack status。

## 必需 Slack 权限
你的 User Token（xoxp-...）必须包含：
- `users.profile:write`
- `users.profile:read`（本项目**无兜底**，必须可读当前状态）

更新 scope 后需要重新 **Install to Workspace**。

## 启动（Docker）
```bash
cp .env.example .env
# edit .env
docker compose up -d --build
```

## 调用
所有请求都要带：
`Authorization: Bearer <API_KEY>`

- `POST /event/arrive-company`
- `POST /event/leave-company`
- `POST /event/arrive-customer` body: `{ "label": "客户名" }`（可选）
- `POST /event/leave-customer`
- `POST /cron/check-10am`
- `POST /cron/cleanup-19`

测试时可加 `?force=true` 跳过时间窗口/工作日校验（仅用于调试）。
