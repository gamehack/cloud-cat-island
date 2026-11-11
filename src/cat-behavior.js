// Pure cat behavior simulation, independent from rendering and networking.
export const STATES=Object.freeze({REST:'rest',WALK:'walk',WATCH:'watch',GROOM:'groom'});
export function createCat(id,x,z,seed=1){return {id,x,z,tx:x,tz:z,state:STATES.REST,until:0,seed:seed>>>0||1};}
function random(cat){cat.seed=(Math.imul(1664525,cat.seed)+1013904223)>>>0;return cat.seed/4294967296;}
export function interact(cat,now){cat.state=STATES.WATCH;cat.until=now+3;return cat;}
export function tick(cat,now,dt,bound=12){if(!Number.isFinite(dt)||dt<0)throw new RangeError('dt must be nonnegative');dt=Math.min(dt,.1);if(now>=cat.until){const r=random(cat);cat.state=r<.48?STATES.REST:r<.72?STATES.WALK:r<.9?STATES.GROOM:STATES.WATCH;cat.until=now+2+random(cat)*6;if(cat.state===STATES.WALK){const angle=random(cat)*Math.PI*2,dist=1+random(cat)*3;cat.tx=Math.max(-bound,Math.min(bound,cat.x+Math.cos(angle)*dist));cat.tz=Math.max(-bound,Math.min(bound,cat.z+Math.sin(angle)*dist));}}if(cat.state===STATES.WALK){const dx=cat.tx-cat.x,dz=cat.tz-cat.z,d=Math.hypot(dx,dz);if(d>.01){const step=Math.min(d,dt*.6);cat.x+=dx/d*step;cat.z+=dz/d*step;}}return cat;}
