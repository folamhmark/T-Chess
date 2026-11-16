(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let from=2,to=3,current=2,busy=false,credited=false,run=0,animations=[],activeTimeline=null,messageTimer;
const track=$('#track'), count=$('#count'), label=$('#day-label');
const svg=id=>`<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const nodes=[],views=[];
for(let day=1;day<=20;day++){
 const milestone=[1,10,20].includes(day),el=document.createElement('div');
 el.className='step'+(milestone?' milestone':'');el.dataset.day=day;
 if(milestone)el.innerHTML=`<span class="milestone-icon">${svg(day===1?'progress-sun':day===10?'progress-gift':'progress-cup')}</span>`;
 track.appendChild(el);nodes.push(el);views.push({x:0,size:milestone?32:8,fill:day<=current?1:0,scale:1,opacity:1});
}
// Richbox-inspired: an anticipation press followed by a critically damped settle.
// Samples always start from the current visible values, including on interruption.
const clamp=n=>Math.max(0,Math.min(1,n));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const spring=t=>{t=clamp(t);return (1-(1+8*t)*Math.exp(-8*t))/(1-9*Math.exp(-8))};
const stage=(t,start,duration,fn=spring)=>fn((t-start)/duration);
function layout(day){
 // The compressed interval is one 20px-wide unit: three 4px dots, 4px gaps.
 const compact=i=>day>=10?i>0&&i<9:i>9&&i<19;
 const representatives=day>=10?[1,4,8]:[10,14,18];
 const units=[];
 nodes.forEach((_,i)=>{
  if(!compact(i))units.push({indices:[i],width:[0,9,19].includes(i)?32:8});
  else if(i===representatives[0])units.push({indices:representatives,width:20});
 });
 const gap=(track.clientWidth-units.reduce((sum,u)=>sum+u.width,0))/(units.length-1);
 const result=[];let x=0;
 units.forEach(u=>{
  if(u.indices.length===3)u.indices.forEach((i,j)=>{result[i]={x:x+2+j*8,size:4,opacity:1}});
  else result[u.indices[0]]={x:x+u.width/2,size:u.width,opacity:1};
  x+=u.width+gap;
 });
 nodes.forEach((_,i)=>{if(!result[i]){
  const nearest=representatives.reduce((best,j)=>Math.abs(j-i)<Math.abs(best-i)?j:best,representatives[0]);
  result[i]={x:result[nearest].x,size:4,opacity:0};
 }});
 return result;
}
function paint(){views.forEach((v,i)=>{
 const el=nodes[i],m=[0,9,19].includes(i),f=clamp(v.fill);
 el.style.opacity=v.opacity;el.setAttribute('aria-hidden',String(v.opacity<.001));
 el.style.width=v.size+'px';el.style.height=(m?32:v.size)+'px';
 el.style.transform=`translate3d(${v.x-v.size/2}px,-50%,0) scale(${v.scale})`;
 const start=m?[255,255,255]:[237,237,238],end=[66,139,249];
 el.style.backgroundColor=`rgb(${start.map((c,j)=>Math.round(mix(c,end[j],f))).join(',')})`;
 if(m){el.style.borderColor=`rgba(${[237,237,238].map((c,j)=>Math.round(mix(c,end[j],f))).join(',')},1)`;
 el.style.color=`rgb(${[151,157,167].map(c=>Math.round(mix(c,255,f))).join(',')})`;
 el.style.setProperty('--medal-ink',el.style.backgroundColor);
 el.style.setProperty('--icon-outline',`rgb(${[237,237,238].map((c,j)=>Math.round(mix(c,end[j],f))).join(',')})`);
 el.style.setProperty('--inactive-art',1-f);
 el.style.setProperty('--active-art',f);
 el.style.setProperty('--sun-outline',`rgb(${[237,237,238].map((c,j)=>Math.round(mix(c,[52,127,225][j],f))).join(',')})`);

 }
 el.classList.toggle('active',f>.999);
})}
function setAccessibility(){track.setAttribute('role','progressbar');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','20');track.setAttribute('aria-valuenow',current);track.setAttribute('aria-label',`${current} из 20 активных дней`)}
function cancel(){run++;animations.forEach(a=>a.pause());animations=[];activeTimeline=null;anime.remove('#count, #day-label');busy=false}
function animate(options){const a=anime(options);animations.push(a);return a}
function speed(){return $('#slow').checked?3:1}
function setCopy(day,isCredited){count.textContent=day;label.textContent=isCredited?'Сегодняшний день засчитан':'Сегодняшний день не засчитан';count.style.cssText='';label.style.cssText='';label.style.color=isCredited?'#428BF9':''}
function reset(instant=false){
 const id=++run;cancel();const token=run;current=from;credited=false;$('#play').disabled=false;$('#slow').disabled=false;$('#play').textContent='Засчитать день';$('#phase').textContent='Готов к зачёту дня';$('#timing').textContent=reduced.matches?'Без движения':'~1 100 мс';
 $('#particles').replaceChildren();setCopy(current,false);setAccessibility();
 const source=views.map(v=>({...v})),target=layout(from),clock={t:0};
 const finish=()=>{target.forEach((p,i)=>Object.assign(views[i],p,{fill:i<from?1:0,scale:1}));paint()};
 if(instant||reduced.matches){finish();return}
 animate({targets:clock,t:1,duration:440,easing:'cubicBezier(.22,1,.36,1)',update:()=>{if(token!==run)return;views.forEach((v,i)=>Object.assign(v,{x:mix(source[i].x,target[i].x,clock.t),size:mix(source[i].size,target[i].size,clock.t),opacity:mix(source[i].opacity,target[i].opacity,clock.t),fill:mix(source[i].fill,i<from?1:0,clock.t),scale:mix(source[i].scale,1,clock.t)}));paint()},complete:finish});
}
function play(){
 if(busy)return;
 if(credited){reset(true)}
 cancel();const token=run;busy=true;$('#play').disabled=true;$('#slow').disabled=true;$('#phase').textContent='Засчитываем день…';
 const milestone=[1,10,20].includes(to),source=views.map(v=>({...v})),target=layout(to),duration=milestone?1180:1000,clock={t:0};
 const countSource=count.textContent,labelSource=label.textContent,labelColor=getComputedStyle(label).color;
 $('#timing').textContent=reduced.matches?'Без движения':`${duration*speed()} мс`;
 function sample(t){
  const morph=stage(t,150,650),reflow=stage(t,210,740),press=t<150?mix(1,.9,smooth(t/150)):mix(.9,1,stage(t,150,650));
  views.forEach((v,i)=>{const active=i===to-1;
   v.x=mix(source[i].x,target[i].x,reflow);v.size=mix(source[i].size,target[i].size,reflow);
   v.opacity=mix(source[i].opacity,target[i].opacity,reflow);
   v.fill=mix(source[i].fill,i<to?1:0,morph);
   v.scale=active?press:mix(source[i].scale,1,stage(t,0,400));
  });paint();
  // Both labels exchange at zero opacity; there is no one-frame text flash.
  const textPhase=stage(t,150,560,smooth);
  if(textPhase<.5){count.textContent=countSource;label.textContent=labelSource;label.style.color=labelColor;count.style.opacity=1-textPhase*2;count.style.transform=`translateY(${-textPhase*10}px)`;label.style.opacity=1-textPhase*2;label.style.transform=`translateY(${-textPhase*4}px)`}
  else{count.textContent=to;label.textContent='Сегодняшний день засчитан';label.style.color='#428BF9';const p=(textPhase-.5)*2;count.style.opacity=p;count.style.transform=`translateY(${(1-p)*5}px)`;label.style.opacity=p;label.style.transform=`translateY(${(1-p)*2}px)`}
 }
 function complete(){if(token!==run)return;sample(duration);current=to;credited=true;busy=false;$('#play').disabled=false;$('#slow').disabled=false;$('#play').textContent='Повторить анимацию';setCopy(current,true);setAccessibility();$('#phase').textContent=to===20?'Все 20 дней засчитаны':to===10?'Первый приз открыт':'День засчитан'}
 if(reduced.matches){complete();return}
 activeTimeline=animate({targets:clock,t:duration,duration:duration*speed(),easing:'linear',update:()=>{if(token===run)sample(clock.t)},complete});
}
for(const b of $$('.scenario')){b.setAttribute('aria-pressed',b.classList.contains('selected'));b.onclick=()=>{from=+b.dataset.from;to=+b.dataset.to;$$('.scenario').forEach(c=>{c.classList.toggle('selected',c===b);c.setAttribute('aria-pressed',String(c===b))});reset()}}
$('#play').onclick=play;$('#reset').onclick=()=>reset();$('#lesson').onclick=()=>{if(!credited)play();else message('Сегодняшний день уже засчитан')};
$('#help').onclick=()=>{let h=$('#tooltip');h.hidden=!h.hidden;$('#help').setAttribute('aria-expanded',String(!h.hidden))};
document.addEventListener('click',e=>{if(!e.target.closest('#help')&&!e.target.closest('#tooltip')){$('#tooltip').hidden=true;$('#help').setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#tooltip').hidden=true;$('#help').setAttribute('aria-expanded','false')}});
function message(t){let e=$('#nav-toast');e.textContent=t;e.hidden=false;clearTimeout(messageTimer);messageTimer=setTimeout(()=>e.hidden=true,2400)}
$$('[data-nav]').forEach(b=>b.onclick=()=>message(b.dataset.nav==='Призы'?(current>=10?'Первый приз открыт':'Первый приз — на 10-й активный день'):'В прототипе показан экран обучения'));$('#close').onclick=()=>message('Вы на экране демонстрации прогресса');
$('#slow').onchange=()=>{$('#timing').textContent=reduced.matches?'Без движения':`${([1,10,20].includes(to)?1180:1000)*speed()} мс`};
window.addEventListener('resize',()=>{if(!busy){const l=layout(current);views.forEach((v,i)=>Object.assign(v,l[i]));paint()}});
reduced.addEventListener('change',()=>{if(reduced.matches&&busy){cancel();current=to;credited=true;const l=layout(to);views.forEach((v,i)=>Object.assign(v,l[i],{fill:i<to?1:0,scale:1}));paint();setCopy(current,true);setAccessibility();$('#play').disabled=false;$('#slow').disabled=false;$('#play').textContent='Повторить анимацию';$('#phase').textContent='День засчитан'}});
reset(true);
window.progressPrototype={get state(){return {from,to,current,busy,credited}},reset:()=>reset(),get motion(){return views.map(v=>({...v}))}};
})();
