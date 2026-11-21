// Push-optimal Sokoban: boxes never leave their room, so solve each room (a group of live squares)
// by breadth-first search over pushes. Deterministic: no clock, no randomness.
import{readFileSync as R,writeFileSync as W,mkdirSync as M,readdirSync as D,existsSync as E}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function solve(t:string){
const r=t.replace(/\r/g,'').split('\n').filter(x=>x),w=Math.max(...r.map(x=>x.length)),n=w*r.length,
wl=new Uint8Array(n).fill(1),g=new Uint8Array(n),B:number[]=[],d=[-w,w,-1,1];let P=0;
r.forEach((s,y)=>[...s].forEach((c,x)=>{const i=y*w+x;if(c=='#')return;wl[i]=0;
if('.*+'.includes(c))g[i]=1;if('$*'.includes(c))B.push(i);if('@+'.includes(c))P=i}));
// live: a box there can still be pulled back to a goal
const lv=new Uint8Array(n),q:number[]=[];for(let i=0;i<n;i++)if(g[i]){lv[i]=1;q.push(i)}
for(let k=0;k<q.length;k++)for(const e of d){const a=q[k]-e,b=a-e;if(b>=0&&b<n&&!wl[a]&&!wl[b]&&!lv[a]){lv[a]=1;q.push(a)}}
const gi=new Int32Array(n).fill(-1);let G=0;
for(let s=0;s<n;s++)if(lv[s]&&gi[s]<0){const st=[s];gi[s]=G;while(st.length){const c=st.pop()!;for(const e of d)if(lv[c+e]&&gi[c+e]<0){gi[c+e]=G;st.push(c+e)}}G++}
const oc=new Uint8Array(n);for(const b of B)oc[b]=1;
const mk=new Int32Array(n),m2=new Int32Array(n),sk=new Int32Array(n);let S=0;
const fl=(f:number,m:Int32Array)=>{const s=++S;let p=0,lo=f;sk[p++]=f;m[f]=s;
while(p){const c=sk[--p];if(c<lo)lo=c;for(const e of d){const u=c+e;if(m[u]!=s&&!wl[u]&&!oc[u]){m[u]=s;sk[p++]=u}}}return lo};
const bl=(c:number)=>wl[c]||oc[c];
// a pushed box in a 2x2 block of boxes and walls with any box off goal is dead
const fz=(u:number)=>[[-1,-w],[1,-w],[-1,w],[1,w]].some(([a,b])=>bl(u+a)&&bl(u+b)&&bl(u+a+b)&&[u,u+a,u+b,u+a+b].some(s=>oc[s]&&!g[s]));
const key=(x:number[],p:number)=>x.reduce((k,b)=>k*256+b,p);
let mv='';
for(let k=0;k<G;k++){
const my=B.filter(b=>gi[b]==k).sort((a,b)=>a-b);if(my.every(b=>g[b]))continue;
const par=new Map<number,number[]>(),p0=fl(P,m2),k0=key(my,p0);par.set(k0,[-1]);
let fr:[number[],number][]=[[my,p0]],end=-1;for(const b of my)oc[b]=0;
while(end<0&&fr.length&&par.size<4e6){const nf:[number[],number][]=[];
for(const[x,p]of fr){if(end>=0)break;for(const b of x)oc[b]=1;fl(p,mk);const rs=S,ck=key(x,p);
for(let i=0;i<x.length&&end<0;i++){const b=x[i];for(let j=0;j<4;j++){const e=d[j],to=b+e;
if(mk[b-e]!=rs||wl[to]||oc[to]||!lv[to])continue;oc[b]=0;oc[to]=1;
const dead=!g[to]&&fz(to);let nk=0,nx:number[]=[],np=0;
if(!dead){nx=x.slice();nx[i]=to;nx.sort((a,b)=>a-b);np=fl(b,m2);nk=key(nx,np)}
oc[to]=0;oc[b]=1;if(dead||par.has(nk))continue;par.set(nk,[ck,b,j]);
if(nx.every(c=>g[c])){end=nk;break}nf.push([nx,np])}}
for(const b of x)oc[b]=0}fr=nf}
for(const b of my)oc[b]=1;if(end<0)continue;
const ps:number[][]=[];for(let c=end;;){const v=par.get(c)!;if(v[0]<0)break;ps.unshift(v);c=v[0]}
for(const[,b,j]of ps){mv+=walk(P,b-d[j])+'UDLR'[j];oc[b]=0;oc[b+d[j]]=1;P=b}}
return mv;
// shortest player walk from a to z around boxes, in LURD letters
function walk(a:number,z:number){const pr=new Int32Array(n).fill(-1),qq=[a];pr[a]=a;
for(let i=0;i<qq.length&&pr[z]<0;i++)for(const e of d){const u=qq[i]+e;if(pr[u]<0&&!wl[u]&&!oc[u]){pr[u]=qq[i];qq.push(u)}}
let s='';for(let c=z;c!=a;c=pr[c])s='udlr'[d.indexOf(c-pr[c])]+s;return s}}
for(const id of E(I)?D(I).sort():[]){if(!E(`${I}/${id}/level.txt`))continue;let a='';
try{a=solve(R(`${I}/${id}/level.txt`,'utf8'))}catch{}M(`${O}/${id}`,{recursive:true});W(`${O}/${id}/solution.txt`,a+'\n',{mode:0o644})}
