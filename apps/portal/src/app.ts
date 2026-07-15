// 运行时配置

type MicroAppConfig = {
  // 子应用唯一标识:qiankun 注册名 + 路由前缀(/${key}/*)
  key: string;
  // 菜单显示名
  name: string;
  entry: string;
  // 子菜单项;为空时菜单上只显示一级项
  routes: { name: string; path: string }[];
};
type AppsResponse = { apps: MicroAppConfig[] };

// 路由 base:本地为 '/',GitHub Pages 上为 '/micro-app/'(构建期由 .umirc define 注入)
const ROUTER_BASE = process.env.ROUTER_BASE || '/';

// 启动时从接口拉取子应用列表(内含菜单信息)。
// 用一个 memo 化的 Promise 保证只请求一次。
// dev 走 mock 的 /api/apps;静态部署(GitHub Pages)走 public 下的 apps.json。
let appsPromise: Promise<AppsResponse> | undefined;
function getApps(): Promise<AppsResponse> {
  if (!appsPromise) {
    appsPromise = fetch(process.env.APPS_API || '/api/apps')
      .then((res) => res.json())
      .then((res) => res.data as AppsResponse)
      .catch(() => ({ apps: [] }));
  }
  return appsPromise;
}

// match 模式下插件不用 routePath 推导子应用 base,需通过 microAppProps.base 显式传入,
// 否则子应用 basename 为空,内部路由匹配不到(No routes matched)。
// children 只带 name/path,不挂组件:仅用于生成菜单与 URL 匹配,
// 任意子路径命中时渲染的都是父路由上的同一个 MicroApp 实例,不会重挂载。
export const qiankun = async () => {
  const { apps } = await getApps();
  return {
    apps: apps.map((app) => ({ name: app.key, entry: app.entry })),
    routes: apps.map((app) => ({
      name: app.name,
      path: `/${app.key}`,
      microApp: app.key,
      mode: 'match',
      microAppProps: { base: `${ROUTER_BASE}${app.key}` },
      children: app.routes.map((r) => ({ name: r.name, path: r.path })),
    })),
  };
};

// 全局初始化数据
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

// 静态部署在子路径(GitHub Pages)时,业务接口也在子路径下,统一加 baseURL 前缀
export const request = {
  baseURL: process.env.API_BASE || '/',
};

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    // ProLayout 只有检测到页面里的 PageContainer 才会把内容区 padding 置 0;
    // 子应用路由渲染的是 MicroApp 组件,检测不到,会套上默认 32px 40px,
    // 与子应用内部 PageContainer 的 padding 叠加。统一置 0,间距由各页面的
    // PageContainer 提供,保证主/子应用页面缩进一致(本应用所有页面都用了 PageContainer)。
    contentStyle: { padding: 0 },
  };
};
