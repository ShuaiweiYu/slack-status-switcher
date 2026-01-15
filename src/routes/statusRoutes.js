import express from "express";
import { slackService } from "../services/slackService.js";
import { nowLocal, inWorkWindow } from "../utils/timeHelper.js";
import { CONFIG } from "../config/constants.js";

const router = express.Router();

const canUpdateStatus = (ctx, force) => {
  if (force) return { allowed: true };
  if (slackService.isP0(ctx.status_text)) return { allowed: false, reason: "p0_active" };
  if (!inWorkWindow(nowLocal())) return { allowed: false, reason: "outside_work_window" };
  return { allowed: true };
};

// 1. 设置状态：在公司
router.post("/office", async (req, res) => {
  const force = req.query.force === "true";
  try {
    const ctx = await slackService.getStatus();
    const check = canUpdateStatus(ctx, force);
    if (!check.allowed) return res.json({ ok: true, action: "noop", ...check });

    await slackService.setStatus(CONFIG.STATUS.OFFICE.text, CONFIG.STATUS.OFFICE.emoji);
    res.json({ ok: true, action: "set_office" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 2. 设置状态：在客户现场
router.post("/customer", async (req, res) => {
  const force = req.query.force === "true";
  const label = req.query.label || "";
  try {
    const ctx = await slackService.getStatus();
    const check = canUpdateStatus(ctx, force);
    if (!check.allowed) return res.json({ ok: true, action: "noop", ...check });

    const finalStatusText = slackService.buildCustomerText(label);
    await slackService.setStatus(finalStatusText, CONFIG.STATUS.CUSTOMER.emoji);
    res.json({ ok: true, action: "set_customer", label });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 3. 设置状态：在家办公
router.post("/home", async (req, res) => {
  const force = req.query.force === "true";
  try {
    const ctx = await slackService.getStatus();
    const check = canUpdateStatus(ctx, force);
    if (!check.allowed) return res.json({ ok: true, action: "noop", ...check });

    await slackService.setStatus(CONFIG.STATUS.HOME.text, CONFIG.STATUS.HOME.emoji);
    res.json({ ok: true, action: "set_home" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 4. 清空所有状态
router.post("/clear", async (req, res) => {
  const force = req.query.force === "true";
  try {
    const ctx = await slackService.getStatus();
    if (slackService.isP0(ctx.status_text) && !force) {
      return res.json({ ok: true, action: "noop", reason: "p0_active_use_force_to_clear" });
    }
    await slackService.clearStatus();
    res.json({ ok: true, action: "cleared" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;