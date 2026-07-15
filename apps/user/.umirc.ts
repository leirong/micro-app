import { defineConfig } from '@umijs/max';

// GitHub Pages 上 user 作为子应用部署在主站的 child/user/ 目录下,
// publicPath 用绝对路径,保证被 qiankun 加载时静态资源(js/css/chunk)能正确解析
const isGhPages = process.env.GH_PAGES === 'true';

export default defineConfig({
  publicPath: isGhPages ? '/micro-app/child/user/' : '/',
  define: {
    // 静态部署时接口都挂在主站仓库子路径下,作为 request 的 baseURL
    'process.env.API_BASE': isGhPages ? '/micro-app/' : '/',
  },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  // user 作为 qiankun 子应用,由 portal 主应用加载
  qiankun: {
    slave: {},
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
