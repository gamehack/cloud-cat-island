# 多人房间 V0.1

`worker/room.js` 为尚未部署的 Durable Object WebSocket 服务端原型。

- 一个共享房间，最多 24 个连接；每客户端最多每 100ms 转发一条位置消息
- 校验消息长度、类型、坐标范围；拒绝非同源握手
- 服务端处理 join/leave/position，断线清理

## 上线前必须完成
1. 为 Worker 配置 Durable Object 绑定 ISLAND_ROOM 和 migration，选择 Cloudflare 支持的部署工具。
2. 前端接入 WebSocket、插值和重连；目前 **未接入**。
3. 身份、频率、连接数量与同源安全压力测试；目前仅为初步防护。
4. 审核免费配额及真实并发成本。

该文件不是已经上线的多人服务，不能将其视为 M3 完成。
