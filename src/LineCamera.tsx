import React from 'react';
type V = [number, number, number];
type Q = [number, number, number, number];
type Mark = {points:V[]; closed?:boolean; fill?:boolean; weight?:number; alpha?:number; reel?:number};
const add=(a:V,b:V):V=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=(v:V):V=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n) as V};
const mul=(a:Q,b:Q):Q=>[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
const axis=(v:V,a:number):Q=>{const s=Math.sin(a/2);return [v[0]*s,v[1]*s,v[2]*s,Math.cos(a/2)]};
const rotate=(p:V,q:Q):V=>{const v:V=[q[0],q[1],q[2]],t=cross(v,p).map(x=>x*2) as V;return add(p,add(t.map(x=>x*q[3]) as V,cross(v,t)))};
const rest=mul(axis([1,0,0],-.16),axis([0,1,0],-.32));
function geometry(){
 const lines:Mark[]=[];
 const line=(points:V[],weight=1,alpha=.7,closed=false,fill=false,reel?:number)=>lines.push({points,weight,alpha,closed,fill,reel});
 const box=(x:number,y:number,z:number,w:number,h:number,d:number)=>{const p:V[]=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]].map(v=>[v[0]/2+x,v[1]/2+y,v[2]/2+z]);[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[1,5,6,2],[0,3,7,4]].forEach(f=>line(f.map(i=>p[i]),1,.75,true,true))};
 const ring=(cx:number,cy:number,cz:number,r:number,plane:'xy'|'yz',weight=1,alpha=.7,reel?:number)=>{const pts:V[]=[];for(let i=0;i<40;i++){const a=i*Math.PI/20;pts.push(plane==='xy'?[cx+Math.cos(a)*r,cy+Math.sin(a)*r,cz]:[cx,cy+Math.sin(a)*r,cz+Math.cos(a)*r])}line(pts,weight,alpha,true,false,reel)};
 box(-.15,-.25,0,1.75,.95,.62);box(-.15,-.83,0,.42,.2,.38);box(-.15,-.98,0,.9,.07,.58);
 // Reel drums have a front, back and rim, not one rotating plane.
 [-.64,.22].forEach((x,j)=>{[-.31,.31].forEach(z=>{ring(x,.68,z,.39,'xy',1,.88,j);ring(x,.68,z,.345,'xy',.45,.35,j);ring(x,.68,z,.065,'xy',.8,.7,j);for(let k=0;k<4;k++){const a=k*Math.PI/2;ring(x+Math.cos(a)*.225,.68+Math.sin(a)*.225,z,.075,'xy',.6,.58,j)}});for(let k=0;k<8;k++){const a=k*Math.PI/4;line([[x+Math.cos(a)*.39,.68+Math.sin(a)*.39,-.31],[x+Math.cos(a)*.39,.68+Math.sin(a)*.39,.31]],.5,.4,false,false,j)}line([[x,.28,-.31],[x,.2,-.31]],.8,.6);});
 // Concentric lens barrel, pointing out of the camera's right side.
 [.74,.87,1.02,1.18].forEach((x,i)=>ring(x,-.2,0,.22+i*.026,'yz',i===3?1.2:.55,i===3?.95:.5));ring(1.19,-.2,0,.20,'yz',.7,.5);ring(1.2,-.2,0,.12,'yz',.5,.4);for(let k=0;k<8;k++){const a=k*Math.PI/4;line([[.74,-.2+Math.sin(a)*.22,Math.cos(a)*.22],[1.18,-.2+Math.sin(a)*.298,Math.cos(a)*.298]],.5,.35)}
 // Panel, vents and controls on both faces retain structure from behind.
 [-.319,.319].forEach(z=>{line([[-.81,-.51,z],[-.04,-.51,z],[-.04,-.03,z],[-.81,-.03,z]],.65,.5,true);for(let i=0;i<4;i++)line([[.09+i*.065,-.38,z],[.09+i*.065,-.07,z]],.55,.45);ring(.48,-.25,z,.07,'xy',.75,.6);line([[-.7,-.14,z],[-.29,-.14,z]],.5,.4);line([[-.7,-.2,z],[-.49,-.2,z]],.5,.4)});
 return lines;
}
const marks=geometry();
export function LineCamera(){
 const canvas=React.useRef<HTMLCanvasElement>(null);
 React.useEffect(()=>{
  const c=canvas.current!,ctx=c.getContext('2d');if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),save=(navigator as any).connection?.saveData;
  let q:Q=[0,0,0,1], velocity:V=[0,0,0],hover:V=[0,0,0],hoverNow:V=[0,0,0],idle=0,reel=0,pulse=0,down=false,dragged=0,visible=true,raf=0,last=0,width=1,height=1,lastBall:V=[0,0,1],lastX=0,lastY=0;
  const resize=()=>{const r=c.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,1.5);c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()};
  const ball=(e:PointerEvent):V=>{const r=c.getBoundingClientRect(),s=Math.min(r.width,r.height)*.35,x=(e.clientX-r.left-r.width/2)/s,y=-(e.clientY-r.top-r.height/2)/s;return unit([x,y,Math.sqrt(Math.max(0,1-x*x-y*y))])};
  const start=(e:PointerEvent)=>{if(reduce.matches)return;down=true;dragged=0;lastBall=ball(e);lastX=e.clientX;lastY=e.clientY;velocity=[0,0,0];q=mul(axis([0,1,0],idle),q);idle=0;c.setPointerCapture(e.pointerId);c.dataset.dragging='true';};
  const move=(e:PointerEvent)=>{if(reduce.matches)return;const r=c.getBoundingClientRect();if(down){const next=ball(e),v=cross(lastBall,next),dot=Math.max(-1,Math.min(1,lastBall.reduce((s,n,i)=>s+n*next[i],0)));const change=e.shiftKey?axis([0,0,1],(e.clientX-lastX)*.014):axis(unit(v),Math.acos(dot));q=mul(change,q);q=q.map(x=>x/(Math.hypot(...q)||1)) as Q;dragged+=Math.hypot(e.clientX-lastX,e.clientY-lastY);lastBall=next;lastX=e.clientX;lastY=e.clientY;}else{hover=[-(e.clientY-r.top-r.height/2)/r.height*.18,(e.clientX-r.left-r.width/2)/r.width*.25,0]}};
  const release=(e:PointerEvent)=>{if(!down)return;down=false;hover=[0,0,0];c.dataset.dragging='false';if(c.hasPointerCapture(e.pointerId))c.releasePointerCapture(e.pointerId);if(dragged<5){pulse=1;velocity=[.7,.5,.16]}if(q[3]<0)q=q.map(x=>-x) as Q;};
  const leave=()=>{hover=[0,0,0]};
  const key=(e:KeyboardEvent)=>{if(reduce.matches)return;let v:V|undefined;if(e.key==='ArrowLeft')v=[0,-.35,0];if(e.key==='ArrowRight')v=[0,.35,0];if(e.key==='ArrowUp')v=[-.35,0,0];if(e.key==='ArrowDown')v=[.35,0,0];if(e.key.toLowerCase()==='q')v=[0,0,-.35];if(e.key.toLowerCase()==='e')v=[0,0,.35];if(e.key==='Enter'||e.key===' '){pulse=1;velocity=[.7,.5,.16];e.preventDefault()}if(v){q=mul(axis(unit(v),Math.hypot(...v)),q);e.preventDefault()}};
  function draw(){
   if(!ctx)return;ctx.clearRect(0,0,width,height);
   const pose=mul(mul(axis([1,0,0],hoverNow[0]),axis([0,1,0],hoverNow[1])),mul(mul(axis([0,1,0],idle),q),rest));
   const scale=Math.min(width/3.4,height/3.1)*(1+pulse*.018);
   const project=(p:V):V=>{const v=rotate(p,pose),f=5/(5-v[2]);return [width/2+v[0]*scale*f,height*.48-v[1]*scale*f,v[2]]};
   // Very quiet drafting guides remain stationary while the object turns.
   ctx.strokeStyle='rgba(175,197,212,.10)';ctx.lineWidth=.6;ctx.setLineDash([1,7]);ctx.beginPath();ctx.ellipse(width/2,height*.48,scale*1.27,scale*1.27,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   const shapes=marks.map(m=>{const pts=m.points.map(p=>{if(m.reel!==undefined){const x=m.reel===0?-.64:.22,a=reel*(m.reel===0?1:-1),dx=p[0]-x,dy=p[1]-.68;p=[x+dx*Math.cos(a)-dy*Math.sin(a),.68+dx*Math.sin(a)+dy*Math.cos(a),p[2]]}return project(p)});return {m,pts,z:pts.reduce((s,p)=>s+p[2],0)/pts.length}}).sort((a,b)=>a.z-b.z);
   for(const {m,pts,z} of shapes){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));if(m.closed)ctx.closePath();if(m.fill){ctx.fillStyle='rgba(10,19,28,.90)';ctx.fill()}const a=(m.alpha||.7)*(.7+(z+1)*.1);ctx.strokeStyle=`rgba(207,222,233,${Math.min(1,a+pulse*.16)})`;ctx.lineWidth=m.weight||1;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}
   if(pulse>.01){ctx.strokeStyle=`rgba(202,224,237,${pulse*.17})`;ctx.lineWidth=.6;ctx.beginPath();ctx.arc(width/2,height*.48,scale*(1.1+(1-pulse)*.4),0,Math.PI*2);ctx.stroke()}
   c.dataset.pose=q.map(x=>x.toFixed(3)).join(',');c.dataset.idle=idle.toFixed(3);
  }
  const frame=(time:number)=>{raf=0;if(!visible||document.hidden)return;const dt=Math.min((time-last)/1000||.016,.032);last=time;if(!reduce.matches&&!save){if(!down){const angle=2*Math.acos(Math.max(-1,Math.min(1,q[3]))),s=Math.sqrt(Math.max(0,1-q[3]*q[3])),err:V=s<.001?[0,0,0]:[q[0]/s*angle,q[1]/s*angle,q[2]/s*angle];velocity=velocity.map((v,i)=>v+(-36*err[i]-11*v)*dt) as V;const speed=Math.hypot(...velocity);if(speed>.0001)q=mul(axis(unit(velocity),speed*dt),q);if(angle<.025&&speed<.1)idle+=dt*.085;}hoverNow=hoverNow.map((v,i)=>v+(hover[i]-v)*Math.min(1,dt*7)) as V;reel+=dt*(Math.hypot(...hover)>.01||down?1.6:.14);pulse=Math.max(0,pulse-dt*1.6)}draw();if(!reduce.matches&&!save)raf=requestAnimationFrame(frame)};
  const resume=()=>{if(visible&&!document.hidden&&!raf){last=0;raf=requestAnimationFrame(frame)}};
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)resume();else cancelAnimationFrame(raf),raf=0});io.observe(c);
  const ro=new ResizeObserver(resize);ro.observe(c);c.addEventListener('pointerdown',start);c.addEventListener('pointermove',move);c.addEventListener('pointerup',release);c.addEventListener('pointercancel',release);c.addEventListener('pointerleave',leave);c.addEventListener('keydown',key);document.addEventListener('visibilitychange',resume);reduce.addEventListener('change',resume);resize();resume();
  return()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();c.removeEventListener('pointerdown',start);c.removeEventListener('pointermove',move);c.removeEventListener('pointerup',release);c.removeEventListener('pointercancel',release);c.removeEventListener('pointerleave',leave);c.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',resume);reduce.removeEventListener('change',resume)};
 },[]);
 return <div className="line-camera"><canvas ref={canvas} tabIndex={0} role="img" aria-label="Interactive line-drawn film camera. Drag freely to rotate. Shift and drag to roll. Arrow keys rotate, Q and E roll. Click or Enter for a shutter pulse. Returns to its rest pose on release."/><span className="camera-edition">ANURAG / MOTION STUDIES / 001</span></div>;
}
