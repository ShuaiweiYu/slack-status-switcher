import express from "express";
import { CONFIG } from "./config/constants.js";
import { auth } from "./middleware/auth.js";
import statusRoutes from "./routes/statusRoutes.js";
import { slackService } from "./services/slackService.js";

const app = express();
app.use(express.json({ limit: "128kb" }));

// 健康检查 (无需鉴权的可以直接放在 auth 之前，或者在 auth 内部放行)
app.get("/health", (req, res) => res.json({ ok: true }));

// 全局鉴权
app.use(auth);

// 挂载路由
app.use("/status", statusRoutes);

// Debug Slack 状态
app.get("/status", async (req, res) => {
  try {
    const status = await slackService.getStatus();
    let has_status = true;
    if (status.status_text === "") {
      has_status = false;
    }
    res.json({ ok: true, has_status: has_status,slack: status });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 Slack Status Switcher (Stateless) running on port ${CONFIG.PORT}`);
});