const $ = (selector) => document.querySelector(selector);
const modal = $('#modal');
const openModal = () => modal?.classList.add('open');
const closeModal = () => modal?.classList.remove('open');
$('#howBtn')?.addEventListener('click', openModal);
$('#closeModal')?.addEventListener('click', closeModal);
$('#modalStart')?.addEventListener('click', () => { closeModal(); $('#games')?.scrollIntoView({behavior:'smooth'}); });
$('#startBtn')?.addEventListener('click', () => $('#games')?.scrollIntoView({behavior:'smooth'}));
$('#quickGame')?.addEventListener('click', () => $('#games')?.scrollIntoView({behavior:'smooth'}));
$('#gameBtn')?.addEventListener('click', () => $('.game-board')?.scrollIntoView({behavior:'smooth', block:'center'}));
modal?.addEventListener('click', e => { if(e.target === modal) closeModal(); });

const feedback = $('#feedback'), score = $('#score'), question = $('#gameQuestion'), choices = $('#gameChoices');
let points = Number(localStorage.getItem('brighty-stars') || 120), currentGame = 'listen', round = 0;
if (score) score.textContent = points;
const words = [
  ['cat','🐱','con mèo'],['dog','🐶','con chó'],['rabbit','🐰','con thỏ'],['bird','🐦','con chim'],['fish','🐟','con cá'],
  ['apple','🍎','quả táo'],['banana','🍌','quả chuối'],['orange','🍊','quả cam'],['cake','🍰','bánh ngọt'],['milk','🥛','sữa'],
  ['sun','☀️','mặt trời'],['moon','🌙','mặt trăng'],['star','⭐','ngôi sao'],['rainbow','🌈','cầu vồng'],['cloud','☁️','đám mây'],
  ['book','📚','quyển sách'],['pencil','✏️','bút chì'],['school','🏫','trường học'],['bag','🎒','cặp sách'],['chair','🪑','cái ghế'],
  ['red','🔴','màu đỏ'],['blue','🔵','màu xanh dương'],['green','🟢','màu xanh lá'],['yellow','🟡','màu vàng'],['purple','🟣','màu tím'],
  ['happy','😀','vui vẻ'],['sleepy','😴','buồn ngủ'],['big','🐘','to'],['small','🐭','nhỏ'],['fast','⚡','nhanh']
];
const pick = (arr, n) => [...arr].sort(() => Math.random() - .5).slice(0,n);
const escape = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function speak(word){ if('speechSynthesis' in window){ speechSynthesis.cancel(); const utterance=new SpeechSynthesisUtterance(word); utterance.lang='en-US'; utterance.rate=.78; speechSynthesis.speak(utterance); } }
function reward(correct){ if(correct){ points += 10; localStorage.setItem('brighty-stars', points); if(score) score.textContent=points; } }
function setFeedback(text, correct){ if(!feedback)return; feedback.textContent=text; feedback.style.color=correct?'#64a557':'#ef8f58'; }
function bindChoices(){ choices?.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{ choices.querySelectorAll('button').forEach(item=>item.classList.remove('selected')); button.classList.add('selected'); const correct=button.dataset.answer==='correct'; reward(correct); setFeedback(correct?'🎉 Chính xác! +10 sao!':'💡 Gần đúng rồi, thử lại nhé!',correct); })); }
function choiceButtons(items){ return items.map(([icon, label, answer])=>`<button data-answer="${answer}">${icon}<small>${escape(label)}</small></button>`).join(''); }
function renderGame(key=currentGame){
  currentGame=key; round++; const target=words[Math.floor(Math.random()*words.length)]; const distractors=pick(words.filter(w=>w[0]!==target[0]),2);
  let html='', title='';
  if(key==='listen'){ title=`Nghe và chọn: <em>${target[2]}</em>`; html=`<button class="sound" id="soundBtn" aria-label="Nghe từ ${target[0]}">🔊</button><strong>Which one is <em>${escape(target[0])}</em>?</strong>`; }
  if(key==='picture'){ title='Chọn tranh đúng'; html=`<span class="question-label">Find the picture for</span><strong class="big-word">${escape(target[0])}</strong>`; }
  if(key==='match'){ title=`Ghép từ với hình: <em>${target[2]}</em>`; html=`<span class="sound">🧩</span><strong>Find <em>${escape(target[0])}</em></strong>`; }
  if(key==='spell'){ const letters=pick(target[0].toUpperCase().split('').map(x=>[x,'','correct']),target[0].length); title='Xếp các chữ cái'; html=`<span class="sound">🔤</span><strong>Spell the word for ${target[1]}</strong>`; }
  if(key==='order'){ title='Xếp câu đúng'; html=`<span class="sound">🧱</span><strong>Put the words in order</strong><div class="sentence-hint">is / This / a / ${escape(target[0])}</div>`; }
  if(key==='memory'){ title='Ghi nhớ nhanh'; html=`<span class="sound">🃏</span><strong>Remember this word: <em>${escape(target[0])}</em></strong>`; }
  if(key==='truefalse'){ const isTrue=Math.random()>.5; title='Đúng hay sai?'; html=`<span class="sound">🤔</span><strong>${isTrue?'A '+escape(target[0])+' is '+target[1]:'A '+escape(target[0])+' is '+distractors[0][1]}</strong>`; }
  if(key==='speed'){ title='Thử thách tốc độ'; html=`<span class="sound">⚡</span><strong>Tap the <em>${escape(target[0])}</em> picture!</strong>`; }
  if(question) question.innerHTML=html;
  let correct=target, options;
  if(key==='truefalse'){ const isTrue=question?.textContent.includes(target[1]); options=[[isTrue?'✅':'❌',isTrue?'True':'False', 'correct'],[isTrue?'❌':'✅',isTrue?'False':'True','wrong']]; }
  else if(key==='spell'){ options=pick(words.filter(w=>w[0]!==target[0]),3).map(w=>[w[0].toUpperCase(),w[0],'wrong']); options.unshift([target[0].toUpperCase(),target[0],'correct']); }
  else if(key==='order'){ options=[['This is a '+target[0], 'sentence','correct'],['A is this '+target[0],'try again','wrong'],['Is a this '+target[0],'try again','wrong']]; }
  else { options=pick([target,...distractors],3).map(w=>[w[1],w[0],w[0]===target[0]?'correct':'wrong']); }
  if(choices) choices.innerHTML=choiceButtons(options);
  if(feedback){feedback.textContent=`${title} • Chọn đáp án nhé!`; feedback.style.color='#a0a0a9';}
  $('#soundBtn')?.addEventListener('click',()=>speak(target[0])); bindChoices();
}
document.querySelectorAll('.game-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.game-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');renderGame(tab.dataset.game);}));
$('#nextGame')?.addEventListener('click',()=>{const keys=[...document.querySelectorAll('.game-tab')].map(t=>t.dataset.game); const next=keys[(keys.indexOf(currentGame)+1)%keys.length]; document.querySelectorAll('.game-tab').forEach(t=>t.classList.toggle('active',t.dataset.game===next)); renderGame(next);});
renderGame('listen');
