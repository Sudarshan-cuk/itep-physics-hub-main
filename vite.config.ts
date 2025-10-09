import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { dependencies } from "./package.json";

function renderChunks(deps: Record<string, string>) {
  const chunks: Record<string, string[]> = {};
  Object.keys(deps).forEach((key) => {
    if (["react", "react-router-dom", "react-dom"].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/functions/v1': {
        target: 'https://swdlyqcaetkmqqduaujf.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions\/v1/, '/functions/v1'),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  build: {
    // Increase warning limit and provide manual chunking to reduce oversized chunks
    chunkSizeWarningLimit: 800, // kB
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
