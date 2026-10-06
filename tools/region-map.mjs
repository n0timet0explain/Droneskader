// Tegner et ASCII-kort over regionsinddelingen på kroppen. Kør: node tools/region-map.mjs [back]
import { NodeIO } from '@gltf-transform/core';
import { regionAt } from '../src/data/regions.js';
const d = await new NodeIO().read('src/assets/body.glb');
const p = d.getRoot().listMeshes()[0].listPrimitives()[0].getAttribute('POSITION').getArray();
const C = { hoved:'H', ansigt:'F', oejne:'E', hals:'N', aksil:'A', thorax:'T', abdomen:'B', lyske:'L', overarm:'U', underarm:'u', laar:'Q', underben:'q' };
const back = process.argv[2] === 'back';
const W=60, Hh=60, grid=[];
for (let r=0;r<Hh;r++){grid.push(Array(W).fill([' ', back?Infinity:-Infinity]));}
for (let i=0;i<p.length;i+=3){const x=p[i],y=p[i+1],z=p[i+2];
 const c=Math.floor((x+0.6)/1.2*W), r=Math.floor((1.8-y)/1.8*Hh);
 if(c<0||c>=W||r<0||r>=Hh)continue;
 const cur=grid[r][c]; if(back? z<cur[1] : z>cur[1]) grid[r][c]=[C[regionAt({x,y,z}).id],z];}
console.log(grid.map(r=>r.map(c=>c[0]).join('')).join('\n'));
