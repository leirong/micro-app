// 模拟「子应用列表」接口:主应用启动时拉取,决定要注册哪些 qiankun 子应用、以及菜单结构。
// 每个 app:key = 子应用唯一标识(qiankun 注册名/路由前缀),name = 菜单显示名,routes = 子菜单项;
// 真实项目里这里换成后端接口即可,前端代码无需改动。
const apps = [
  {
    key: 'user',
    name: '用户中心',
    // user 子应用 dev server 地址(见 apps/user/.env 的 PORT=8100)
    entry: '//localhost:8100',
    routes: [
      { name: '首页', path: '/user/home' },
      { name: '权限演示', path: '/user/access' },
      { name: 'CRUD 示例', path: '/user/table' },
    ],
  },
];

export default {
  'GET /api/apps': (req: any, res: any) => {
    res.json({
      success: true,
      data: { apps },
      errorCode: 0,
    });
  },
};
