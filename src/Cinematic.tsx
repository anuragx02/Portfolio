import React from 'react';
const fragment=`precision mediump float;
uniform vec2 resolution;uniform vec2 pointer;uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.04;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*3.;float t=time*.065;vec2 q=vec2(fbm(p+vec2(t,-t)),fbm(p+vec2(4.2+t,1.3)));vec2 r=vec2(fbm(p+3.*q+vec2(1.7,t)),fbm(p+3.*q+vec2(8.3,-t)));float f=fbm(p+3.6*r+pointer*.35);float vein=smoothstep(.38,.7,f)*(.45+.55*r.x);float halo=exp(-3.*length(uv-vec2(.72,.58)));vec3 col=mix(vec3(.012,.013,.015),vec3(.22,.23,.25),vein);col+=vec3(.16,.17,.19)*pow(f,5.)*2.;col+=vec3(.03,.032,.036)*halo;float edge=smoothstep(0.,.13,uv.y)*smoothstep(1.,.8,uv.y);gl_FragColor=vec4(col*edge,1.);}`;
export default function Cinematic(){
 const ref=React.useRef<HTMLCanvasElement>(null);
 React.useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
  const compile=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('shader');}return s;};
  let program:WebGLProgram;let vertex:WebGLShader;let frag:WebGLShader;
  try{vertex=compile(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}');frag=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram()!;gl.attachShader(program,vertex);gl.attachShader(program,frag);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;}catch{return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const ur=gl.getUniformLocation(program,'resolution'),ut=gl.getUniformLocation(program,'time'),up=gl.getUniformLocation(program,'pointer');let target=[0,0],current=[0,0],id=0,last=0,visible=true;const started=performance.now();
  const resize=()=>{canvas.width=Math.min(1100,Math.round(canvas.clientWidth*.65));canvas.height=Math.min(650,Math.round(canvas.clientHeight*.65));gl.viewport(0,0,canvas.width,canvas.height);};resize();window.addEventListener('resize',resize);
  const move=(e:PointerEvent)=>{const b=canvas.getBoundingClientRect();target=[(e.clientX-b.left)/b.width-.5,.5-(e.clientY-b.top)/b.height];};window.addEventListener('pointermove',move,{passive:true});
  const obs=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});obs.observe(canvas);
  const draw=(now:number)=>{id=requestAnimationFrame(draw);if(!visible||document.hidden||now-last<33)return;last=now;current=current.map((x,i)=>x+(target[i]-x)*.035);gl.uniform2f(ur,canvas.width,canvas.height);gl.uniform1f(ut,(now-started)/1000);gl.uniform2f(up,current[0],current[1]);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.ready='true';};id=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(id);obs.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(frag);};
 },[]);
 return <canvas ref={ref} className="cinema-canvas" aria-hidden="true" />;
}
