const modal = document.querySelector('#modal');
const openModal = () => modal.classList.add('open');
const closeModal = () => modal.classList.remove('open');
document.querySelector('#howBtn').addEventListener('click', openModal);
document.querySelector('#closeModal').addEventListener('click', closeModal);
document.querySelector('#modalStart').addEventListener('click', () => { closeModal(); document.querySelector('#games').scrollIntoView({behavior:'smooth'}); });
document.querySelector('#startBtn').addEventListener('click', () => document.querySelector('#learn').scrollIntoView({behavior:'smooth'}));
document.querySelector('#gameBtn').addEventListener('click', () => document.querySelector('.game-board').scrollIntoView({behavior:'smooth', block:'center'}));
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
const feedback = document.querySelector('#feedback');
const score = document.querySelector('#score');
const question = document.querySelector('#gameQuestion');
const choices = document.querySelector('#gameChoices');
let points = 120; let currentGame = 'listen';
const games = { listen:{question:'Which one is a <em>cat</em>?',choices:[['🐶','dog','wrong'],['🐱','cat','correct'],['🐰','rabbit','wrong']]}, match:{question:'Find the pair: <em>apple</em>',choices:[['🍎','apple','correct'],['🚗','car','wrong'],['☀️','sun','wrong']]}, spell:{question:'Put the letters together: <em>☀️</em>',choices:[['S U N','sun','correct'],['C A T','cat','wrong'],['B O X','box','wrong']]}, memory:{question:'Remember this word: <em>star</em>',choices:[['⭐','star','correct'],['🌙','moon','wrong'],['🌳','tree','wrong']]}};
function bindChoices(){choices.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{choices.querySelectorAll('button').forEach(item=>item.classList.remove('selected'));button.classList.add('selected');const correct=button.dataset.answer==='correct';feedback.textContent=correct?'🎉 Chính xác! Bé nhận được +10 sao!':'💡 Gần đúng rồi, thử lại nhé!';feedback.style.color=correct?'#64a557':'#ef8f58';if(correct){points+=10;score.textContent=points;}}));}
function renderGame(key){currentGame=key;const game=games[key];question.innerHTML='<span class="sound">🔊</span><strong>'+game.question+'</strong>';choices.innerHTML=game.choices.map(c=>'<button data-answer="'+c[2]+'">'+c[0]+'<small>'+c[1]+'</small></button>').join('');feedback.textContent='Chọn một đáp án nhé!';feedback.style.color='#a0a0a9';bindChoices();}
document.querySelectorAll('.game-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.game-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');renderGame(tab.dataset.game);}));
document.querySelector('#nextGame').addEventListener('click',()=>{const keys=Object.keys(games);renderGame(keys[(keys.indexOf(currentGame)+1)%keys.length]);document.querySelectorAll('.game-tab').forEach(t=>t.classList.toggle('active',t.dataset.game===currentGame));});
bindChoices();
