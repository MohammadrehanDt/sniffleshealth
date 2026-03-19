import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../../"), "");

  return {
    envDir: "../../",
    plugins: [react()],
    server: {
      host: "::",
      port: Number(env.WEB_PORT ?? 5173),
      proxy: {
        "/api": {
          target: env.VITE_API_URL?.replace(/\/api$/, "") ?? "http://localhost:4000",
          changeOrigin: true,
        },
      },
      fs: {
        allow: [path.resolve(__dirname, "../../")],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
