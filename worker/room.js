// Cloudflare Durable Object WebSocket room. Deployment requires a configured binding.
const MAX_PEERS=24,MAX_BYTES=512,MIN_INTERVAL_MS=100;
export class IslandRoom {
  constructor(state,env){this.state=state;this.env=env;this.peers=new Map();for(const ws of state.getWebSockets()){const meta=ws.deserializeAttachment();if(meta)this.peers.set(meta.id,{ws,last:0});}}
  async fetch(request){if(request.headers.get('Upgrade')!=='websocket')return new Response('WebSocket required',{status:426});if(this.peers.size>=MAX_PEERS)return new Response('Room full',{status:503});const pair=new WebSocketPair();const [client,server]=Object.values(pair);const id=crypto.randomUUID();this.state.acceptWebSocket(server);server.serializeAttachment({id});this.peers.set(id,{ws:server,last:0});server.send(JSON.stringify({type:'welcome',id,peers:[...this.peers.keys()].filter(x=>x!==id)}));this.broadcast({type:'join',id},id);return new Response(null,{status:101,webSocket:client});}
  broadcast(msg,exclude){const payload=JSON.stringify(msg);for(const [id,p] of this.peers){if(id!==exclude)try{p.ws.send(payload)}catch{this.peers.delete(id)}}}
  webSocketMessage(ws,data){const meta=ws.deserializeAttachment();if(!meta||typeof data!=='string'||data.length>MAX_BYTES)return;const peer=this.peers.get(meta.id);if(!peer)return;const now=Date.now();if(now-peer.last<MIN_INTERVAL_MS)return;peer.last=now;let msg;try{msg=JSON.parse(data)}catch{return}if(msg.type!=='position'||!Number.isFinite(msg.x)||!Number.isFinite(msg.z)||Math.abs(msg.x)>14||Math.abs(msg.z)>14)return;this.broadcast({type:'position',id:meta.id,x:msg.x,z:msg.z},meta.id);}
  webSocketClose(ws){this.drop(ws)}
  webSocketError(ws){this.drop(ws)}
  drop(ws){const meta=ws.deserializeAttachment();if(meta&&this.peers.delete(meta.id))this.broadcast({type:'leave',id:meta.id});try{ws.close()}catch{}}
}
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/health')return Response.json({ok:true});if(url.pathname!=='/ws')return new Response('Not found',{status:404});const origin=request.headers.get('Origin');if(!origin||new URL(origin).host!==url.host)return new Response('Origin not allowed',{status:403});const id=env.ISLAND_ROOM.idFromName('island-v1');return env.ISLAND_ROOM.get(id).fetch(request);}};
