import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    server: { port: Number(env.APP_PORT) || 3000 },
    preview: { port: Number(env.APP_PORT) || 3000 },
    define: { DELCOM_BASEURL: JSON.stringify(env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1") },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
    },
  };
});
