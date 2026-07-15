import { defineConfig } from '@umijs/max';

// GitHub Pages 部署在 https://<user>.github.io/micro-app/ 子路径下,
// CI 里注入 GH_PAGES=true 切换 base/publicPath,本地 dev/build 不受影响
const isGhPages = process.env.GH_PAGES === 'true';
const base = isGhPages ? '/micro-app/' : '/';

export default defineConfig({
  base,
  publicPath: base,
  define: {
    // 路由 base,运行时拼接子应用挂载路径(microAppProps.base)用
    'process.env.ROUTER_BASE': base,
    // 子应用列表接口:Pages 上没有 mock server,改为读取 public 下的静态 JSON
    'process.env.APPS_API': isGhPages ? `${base}api/apps.json` : '/api/apps',
    // 静态部署时接口都挂在仓库子路径下,作为 request 的 baseURL
    'process.env.API_BASE': base,
  },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  qiankun: {
    master: {},
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
});
