// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

// 静态部署在子路径(GitHub Pages)时,业务接口也在子路径下,统一加 baseURL 前缀
export const request = {
  baseURL: process.env.API_BASE || '/',
};

export const layout = () => {
  // 作为 qiankun 子应用被 portal 加载时,隐藏自身布局外壳(菜单+顶栏),
  // 菜单统一由 portal 主应用提供,这里只渲染页面内容,避免二级布局重叠
  const isMicroApp = window.__POWERED_BY_QIANKUN__;
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    ...(isMicroApp
      ? {
          headerRender: false,
          menuRender: false,
          menuHeaderRender: false,
          // 外层 padding 已由 portal 的 layout 提供,去掉自身内容区 padding,
          // 否则两层 layout 的 padding 叠加,子应用页面比主应用多缩进一圈
          contentStyle: { padding: 0 },
        }
      : {}),
  };
};
