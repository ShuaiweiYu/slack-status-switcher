import { CONFIG } from "../config/constants.js";

export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  
  // 校验 Bearer Token
  if (header !== `Bearer ${CONFIG.API_KEY}`) {
    return res.status(401).json({ 
      ok: false, 
      error: "unauthorized",
      hint: "Please check your API_KEY in header" 
    });
  }
  next();
}