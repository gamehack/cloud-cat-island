# 云猫岛 Cloud Cat Island

一个无需登录、可在手机和桌面浏览器访问的虚拟猫岛。当前版本是可运行的单人原型，尚未接入多人服务或部署生产环境。

## 本地运行

```bash
npm install
npm run dev
npm run build
```

## MVP 范围
- Vite + Three.js 的低多边形岛屿、海面、树木与猫咪
- 6 只具有自主游走、休息状态的猫咪
- PC WASD/方向键移动，手机屏幕方向控制
- 点击猫咪互动；浏览器本地匿名访问统计

## 下一阶段
- 替换占位猫咪模型与动画
- Cloudflare Durable Objects 多人房间、限流与断线恢复
- 事件分析、可访问性、移动端性能测试与部署

开发和文档同步更新，详见 docs/ROADMAP.md。
