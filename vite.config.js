import { defineConfig } from 'vite'
import { resolve } from "path"
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Components({resolvers: [(componentName) => {
      if(componentName.startsWith("Cmd")) {
        return {
          name: componentName,
          from: "comand-component-library"
        }
      }
    }]})],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            name: "comand-ui-website",
            fileName: "comand-ui-website",
            formats: ["es", "umd"]
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue"
                }
            }
        }
    }
})
