import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "shopify-export/landing-diabetes/theme/assets",
    emptyOutDir: false,
    sourcemap: false,
    minify: "terser",
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/shopify/landing-diabetes.entry.tsx"),
      output: {
        entryFileNames: "urcare-landing-diabetes.js",
        chunkFileNames: "urcare-landing-diabetes.[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "urcare-landing-diabetes.css";
          return "[name][extname]";
        },
        inlineDynamicImports: true,
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
