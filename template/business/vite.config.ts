import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import vue from '@vitejs/plugin-vue' // 单文件组件支持
import vueJsx from '@vitejs/plugin-vue-jsx' // TSX和JSX支持
import Components from 'unplugin-vue-components/vite'
import { UltraUIResolver } from 'ultra-ui/resolver'
import { kebabCase } from 'cat-kit/be'
import { defineProxy } from './dev-proxy'
import { version } from './package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// @ts-ignore
export default defineConfig(async ({ mode, command }) => {
  // 使用mode来区分构建目标， 使用command来区分是开发环境还是生产环境
  return {
    resolve: {
      alias: [{ find: /^@\//, replacement: join(__dirname, './') }],
      extensions: ['.ts', '.tsx', '.js']
    },

    plugins: [
      vue({
        isProduction: command === 'build'
      }),
      vueJsx(),
      Components({
        resolvers: [
          UltraUIResolver,
          function (componentName) {
            if (componentName.startsWith('M')) {
              const kebabName = kebabCase(componentName.slice(1))

              return {
                name: componentName,
                from: '@meta/components',
                sideEffects: `@meta/components/${kebabName}/style`
              }
            }
          }
        ],
        dts: '../components.d.ts'
      })
    ],

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'ultra-ui/styles/mixins' as m;
            @use 'ultra-ui/styles/vars' as vars;
            @use 'ultra-ui/styles/functions' as fn;
          `
        }
      }
    },

    envDir: resolve(__dirname, 'env'),
    envPrefix: 'IC_',

    define: {
      VER: JSON.stringify(version)
    },

    build: {
      rollupOptions: {
        external: [
          // 'ultra-ui',
          // 'cat-kit',
          // 'vue',
          // 'cat-kit/fe',
          // '@meta/components'
        ]
      }
    },

    server: {
      port: 8801,
      open: false,
      host: true,
      proxy: defineProxy({
        '/dev': {
          target: 'http://139.224.220.92:8081',
          rewrite: path => path.replace(/^\/dev/, '')
        },
        '/wt': {
          target: 'http://192.168.31.250:6004/',
          rewrite: path => path.replace(/^\/wt/, '')
        },
        '/cz': {
          target: 'http://47.102.98.195:8002/',
          rewrite: path => path.replace(/^\/cz/, '')
        },
        '/cong': 'http://192.168.31.144:9999',
        '/lxl': 'http://192.168.31.22:9999',
        '/liu': 'http://192.168.31.104:9999',
        '/zzh': 'http://192.168.31.128:9999'
      })
    }
  }
})
