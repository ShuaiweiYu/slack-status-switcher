import dotenv from "dotenv";

dotenv.config();

const AT_OFFICE = "at the office (NOVE)"
const AT_HOME = "home office"
const AT_CUSTOMER = "at the customer"
const AT_OFFICE_EMOJI = ":office:"
const AT_HOME_EMOJI = ":house_with_garden:"
const AT_CUSTOMER_EMOJI = ":building_construction:"

export const CONFIG = {
  SLACK_USER_TOKEN: process.env.SLACK_USER_TOKEN,
  API_KEY: process.env.API_KEY,
  PORT: process.env.PORT || "3000",
  
  STATUS: {
    OFFICE: { text: process.env.STATUS_TEXT_OFFICE || AT_OFFICE, emoji: process.env.STATUS_EMOJI_OFFICE || AT_OFFICE_EMOJI },
    HOME: { text: process.env.STATUS_TEXT_HOME || AT_HOME, emoji: process.env.STATUS_EMOJI_HOME || AT_HOME_EMOJI },
    CUSTOMER: { text: process.env.STATUS_TEXT_CUSTOMER || AT_CUSTOMER, emoji: process.env.STATUS_EMOJI_CUSTOMER || AT_CUSTOMER_EMOJI },
  },

  P0_TEXTS: (process.env.P0_TEXTS || "vacation,sick").split(",").map(s => s.trim().toLowerCase()),
  CUSTOMER_INCLUDE_LABEL: String(process.env.CUSTOMER_INCLUDE_LABEL).toLowerCase() === "true",
};