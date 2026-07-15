import '@umijs/max/typings';

declare global {
  interface Window {
    // qiankun 在子应用运行时注入的标记
    __POWERED_BY_QIANKUN__?: boolean;
  }
}
