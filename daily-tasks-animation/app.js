
(()=>{'use strict';const $=s=>document.querySelector(s),reduced=matchMedia('(prefers-reduced-motion: reduce)'),messages=['Поставьте мат в три хода','Поставьте мат в два хода','Найдите лучший ход белых','Выиграйте ферзя соперника','Поставьте мат в один ход'];let current=1,completed=0,token=0,active=[];const digit=$('#digit'),incoming=$('#incoming'),copy=$('#copy'),bubble=$('#bubble');incoming.style.opacity=0;
const firstPromptText=copy.querySelector('.sr').cloneNode(true);
const firstPromptArt=copy.querySelector('.task-prompt-art').cloneNode(true);
// Crop the original Figma image between glyphs so the authored line breaks and spacing survive the stagger.
const firstPromptRows=[
  {top:0,bottom:16,cuts:[0,10,19.125,27.21875,34.5,42.5,50.625,57.5625,64.5625,75,87.5625,95.6875,105.625,117.0625,126.90625,135.8125,144]},
  {top:16,bottom:31,cuts:[0,7.25,15.4375,24.84375,144]}
];

function setDigit(element,value){
  element.dataset.value=value;
  element.textContent=value;
}

function setPrompt(text,animate=false){
  if(text===messages[0]){
    copy.replaceChildren(firstPromptText.cloneNode(true));
    if(!animate){
      copy.append(firstPromptArt.cloneNode(true));
      return;
    }
    for(const {top,bottom,cuts} of firstPromptRows){
      for(let index=0;index<cuts.length-1;index++){
        const glyph=firstPromptArt.cloneNode(true);
        glyph.classList.add('copy-char');
        glyph.style.clipPath=`inset(${top}px ${144-cuts[index+1]}px ${31-bottom}px ${cuts[index]}px)`;
        copy.append(glyph);
      }
    }
  }else if(animate){
    copy.replaceChildren();
    text.split(' ').forEach((word,index)=>{
      if(index)copy.append(document.createTextNode(' '));
      const wrapper=document.createElement('span');
      wrapper.className='copy-word';
      for(const char of word){
        const glyph=document.createElement('span');
        glyph.className='copy-char';
        glyph.textContent=char;
        wrapper.append(glyph);
      }
      copy.append(wrapper);
    });
  }else{
    copy.textContent=text;
  }
  if(animate){
    copy.querySelectorAll('.copy-char').forEach(glyph=>{
      glyph.style.opacity='0';
      glyph.style.filter='blur(1.2px)';
    });
  }
}

const progress=$('.progress'),fill=$('#progress-fill');
function setProgress(value,animated=true){
 completed=Math.max(0,Math.min(5,value));
 anime.remove(fill);
 progress.setAttribute('aria-valuenow',String(completed));progress.setAttribute('aria-valuetext',`Пройдено ${completed} из 5 задач`);
 const width=`${completed*20}%`,factor=$('#slow').checked?3:1;
 if(!animated||reduced.matches){fill.style.width=width;return}
 anime({targets:fill,width,duration:620*factor,easing:'cubicBezier(.22,1,.36,1)'});
}
setProgress(0,false);
function stop(){token++;active.forEach(a=>a.pause());active=[];anime.remove([digit,incoming,copy,bubble,...copy.querySelectorAll('.copy-char')]);bubble.style.cssText="";digit.style.cssText='';incoming.style.cssText='opacity:0';copy.style.cssText=''}
function go(target,replay=false,keepProgress=false){
if(finalExit||successMotion.timeline)return;
const fromCompletedRound=scene.hidden;
success.hidden=true;
scene.hidden=false;
stop();if(!replay&&!keepProgress)setProgress(target-1,!fromCompletedRound);else setProgress(completed);const run=token,previous=current;current=target;const text=messages[target-1],factor=$('#slow').checked?3:1;document.querySelectorAll('[data-task]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.task===target)));nextButton.textContent='Завершить задачу';replayButton.textContent='↺ Повторить анимацию';$('#phase').textContent='Обновляем задание…';$('#duration').textContent=reduced.matches?'Без движения':fromCompletedRound?'—':`~${(455+text.replaceAll(' ','').length*18)*factor} мс`;
const done=()=>{if(run!==token)return;setDigit(digit,target);digit.style.cssText='';incoming.style.opacity=0;if(copy.textContent!==text||text===messages[0])setPrompt(text);copy.querySelectorAll('.copy-char').forEach(c=>{c.style.opacity='1';c.style.transform='none';c.style.filter='none'});copy.style.cssText='';bubble.style.cssText='';$('#phase').textContent=`Задача ${target} из 5`;$('#announcement').textContent=`Задача ${target} из 5. ${text}`};
if(reduced.matches||fromCompletedRound){done();return}setDigit(digit,previous);setDigit(incoming,target);const direction=target>=previous||replay?1:-1;
active.push(anime({targets:digit,translateY:[0,-14*direction],opacity:[1,0],duration:180*factor,easing:'easeInQuad'}));active.push(anime({targets:incoming,translateY:[18*direction,0],opacity:[0,1],delay:130*factor,duration:390*factor,easing:'cubicBezier(.22,1,.36,1)',complete:()=>{if(run!==token)return;setDigit(digit,target);digit.style.cssText='';incoming.style.opacity=0}}));
active.push(anime({targets:bubble,translateY:[0,2],scale:[1,.985],opacity:[1,0],duration:110*factor,easing:'cubicBezier(.4,0,1,1)',complete:()=>{if(run!==token)return;
setPrompt(text,true);
active.push(anime({targets:bubble,translateY:[8,0],scale:[.95,1],duration:440*factor,easing:'cubicBezier(.16,1,.3,1)'}));active.push(anime({targets:bubble,opacity:[0,1],duration:160*factor,easing:'cubicBezier(.2,0,0,1)'}));
const chars=[...copy.querySelectorAll('.copy-char')];active.push(anime({targets:chars,opacity:[0,1],filter:['blur(1.2px)','blur(0px)'],delay:anime.stagger(18*factor,{start:105*factor}),duration:240*factor,easing:'cubicBezier(.22,1,.36,1)',complete:done}));}}));}

const sheet=$('#result-sheet'),continueButton=$('#continue-task'),continueLabel=$('#continue-task-label');
const scene=$('.task-scene'),penguin=$('.penguin');
const nextButton=$('#next'),replayButton=$('#replay');
const success=$('#daily-success'),successTitle=$('#success-title'),successTap=$('#success-continue');
const successMotion=window.successReveal.create({
  artwork:$('.success-penguin'),
  glow:$('.success-glow'),
  title:successTitle,
  subtitle:$('.success-subtitle'),
  primary:$('.success-tap-label'),
  canvas:$('.success-snow-reveal')
});
const finalMotion={drop:480,fade:420};
let sheetOpen=false,sheetClosing=false,finalExit=null;
const sheetControls=()=>[...document.querySelectorAll('[data-task],#next,#replay,.hint,.back')];
function showResult(){if(sheetOpen)return;stop();setPrompt(messages[current-1]);setDigit(digit,current);setProgress(current);sheetOpen=true;sheetClosing=false;sheetControls().forEach(b=>b.disabled=true);continueButton.dataset.final=String(current===5);continueLabel.textContent=current===5?'ОК':'Ого, погнали дальше';continueButton.disabled=false;sheet.hidden=false;$('#phase').textContent='Верный ход';$('#announcement').textContent=`Верный ход. Пройдено ${completed} из 5 задач. Можно продолжить.`;const finish=()=>{if(sheetOpen&&!sheetClosing)continueButton.focus()};if(reduced.matches){sheet.style.transform='none';finish()}else active.push(anime({targets:sheet,translateY:[178,0],duration:460*($('#slow').checked?3:1),easing:'cubicBezier(.16,1,.3,1)',complete:finish}));}

function hideSheet(){
  sheet.hidden=true;
  sheet.style.transform='';
}

function finishClosing(){
  hideSheet();
  sheetOpen=false;
  sheetClosing=false;
  sheetControls().forEach(button=>button.disabled=false);
}

function enableSuccessTap(){
  success.inert=false;
  successTap.disabled=false;
}

function finishRound(){
  successMotion.finish();
  enableSuccessTap();
  finishClosing();
  nextButton.textContent='Начать заново';
  replayButton.textContent='↺ Повторить финал';
  $('#phase').textContent='Все задачи выполнены';
  $('#announcement').textContent='Все пять задач выполнены.';
  if(document.activeElement!==successTap)successTitle.focus({preventScroll:true});
}

function showSuccess(factor){
  finalExit?.pause();
  finalExit=null;
  scene.hidden=true;
  scene.style.opacity='';
  penguin.style.transform='';
  hideSheet();
  success.hidden=false;
  if(reduced.matches){finishRound();return}
  success.inert=true;
  successTap.disabled=true;
  $('#phase').textContent='Показываем результат…';
  successMotion.prepare({
    factor,
    leadIn:window.successReveal.whiteHold,
    complete:finishRound,
    enablePrimary:enableSuccessTap
  }).play();
}

function closeResult(advance){
  if(!sheetOpen||sheetClosing)return;
  sheetClosing=true;
  continueButton.disabled=true;
  anime.remove(sheet);

  const factor=$('#slow').checked?3:1;
  const sheetMotion={targets:sheet,translateY:178,duration:260*factor,easing:'cubicBezier(.4,0,.8,.2)'};
  if(advance&&current===5){
    const duration=finalMotion.drop+finalMotion.fade+window.successReveal.whiteHold+window.successReveal.duration;
    $('#duration').textContent=reduced.matches?'Без движения':`${duration*factor} мс`;
    if(reduced.matches){showSuccess(factor);return}
    $('#phase').textContent='Завершаем задачи…';
    finalExit=anime.timeline({autoplay:false,complete:()=>showSuccess(factor)})
      .add({...sheetMotion,complete:hideSheet},0)
      .add({targets:penguin,translateY:['0px','100px'],duration:finalMotion.drop*factor,easing:'cubicBezier(.42,0,.56,1)'},0)
      .add({targets:scene,opacity:[1,0],duration:finalMotion.fade*factor,easing:'easeInOutSine'},finalMotion.drop*factor);
    finalExit.play();
    return;
  }

  const finish=()=>{
    finishClosing();
    if(advance){
      go(current+1,false,true);
    }else{
      $('#phase').textContent=`Задача ${current} из 5`;
      $('#announcement').textContent=`Задача ${current} из 5`;
    }
    nextButton.focus();
  };
  if(reduced.matches){finish();return}
  active.push(anime({...sheetMotion,complete:finish}));
}

nextButton.onclick=()=>scene.hidden?go(1):showResult();
continueButton.onclick=()=>closeResult(true);
successTap.onclick=()=>{
  if(successMotion.timeline)finishRound();
  go(1);
  nextButton.focus({preventScroll:true});
};
replayButton.onclick=()=>{
  const completedRound=scene.hidden;
  go(current,true);
  if(completedRound)showResult();
};
$('.hint').onclick=()=>go(current,true);
document.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>go(+b.dataset.task));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheetOpen){e.preventDefault();closeResult(false)}});
reduced.addEventListener('change',()=>{
  if(!reduced.matches)return;
  setProgress(completed,false);
  if(finalExit){
    $('#duration').textContent='Без движения';
    showSuccess(1);
  }else if(successMotion.timeline){
    $('#duration').textContent='Без движения';
    finishRound();
  }else if(!sheetOpen&&!scene.hidden){
    go(current,true);
  }
});
window.dailyTasksPrototype={go,get state(){return{current,completed,text:copy.textContent,sheetOpen}}};})();

