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
document.querySelectorAll('.choices button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.choices button').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  const correct = button.dataset.answer === 'correct';
  feedback.textContent = correct ? '🎉 Chính xác! Bé nhận được +10 sao!' : '💡 Gần đúng rồi, thử lại nhé!';
  feedback.style.color = correct ? '#64a557' : '#ef8f58';
}));
