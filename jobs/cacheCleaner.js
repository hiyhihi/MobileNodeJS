import fs from "fs";
import path from "path";
import cron from "node-cron";

const CACHE_DIR = "cache";
const EXPIRE_HOURS = Number(process.env.CACHE_EXPIRE_HOURS || 24);
const EXPIRE_MS = EXPIRE_HOURS * 60 * 60 * 1000;

cron.schedule("0 * * * *", () => {
  try {
    if (!fs.existsSync(CACHE_DIR)) return;
    const files = fs.readdirSync(CACHE_DIR);
    const now = Date.now();
    files.forEach((f) => {
      const fp = path.join(CACHE_DIR, f);
      try {
        const st = fs.statSync(fp);
        if (now - st.ctimeMs > EXPIRE_MS) {
          fs.unlinkSync(fp);
          console.log("Deleted cache:", fp);
        }
      } catch (e) {
        console.warn("Cache delete error:", e.message);
      }
    });
  } catch (err) {
    console.error("Cache cleaner error:", err.message);
  }
});
