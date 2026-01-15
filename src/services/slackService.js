import { WebClient } from "@slack/web-api";
import { CONFIG } from "../config/constants.js";

const slack = new WebClient(CONFIG.SLACK_USER_TOKEN);

export const normalizeText = (s) => (s || "").trim();

export const slackService = {
  async getStatus() {
    const r = await slack.users.profile.get();
    const p = r?.profile || {};
    return {
      status_text: p.status_text || "",
      status_emoji: p.status_emoji || "",
      status_expiration: p.status_expiration || 0
    };
  },

  async setStatus(text, emoji, expiration = 0) {
    return slack.users.profile.set({ profile: { status_text: text, status_emoji: emoji, status_expiration: expiration } });
  },

  async clearStatus() {
    return this.setStatus("", "", 0);
  },

  isP0(statusText) {
    return CONFIG.P0_TEXTS.includes(normalizeText(statusText).toLowerCase());
  },

  isOffice(statusText) {
    return normalizeText(statusText) === normalizeText(CONFIG.STATUS.OFFICE.text);
  },

  isCustomer(statusText) {
    const base = normalizeText(CONFIG.STATUS.CUSTOMER.text);
    const txt = normalizeText(statusText);
    return txt === base || txt.startsWith(`${base} — `) || txt.startsWith(`${base} - `);
  },

  buildCustomerText(label) {
    if (!CONFIG.CUSTOMER_INCLUDE_LABEL || !label) return CONFIG.STATUS.CUSTOMER.text;
    return `${CONFIG.STATUS.CUSTOMER.text} — ${normalizeText(label)}`;
  }
};