import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CHROMIUM_PATH: process.env.CHROMIUM_PATH,
    SPREADSHEETS_URL: process.env.SPREADSHEETS_URL,
    SECRET_KEY_SHEET: process.env.SECRET_KEY_SHEET,
  },
};

export default nextConfig;
