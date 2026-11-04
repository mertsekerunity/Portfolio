'use strict';

const cards = document.querySelectorAll('.project-card');
const detail = document.getElementById('project-detail');
const detailContent = document.getElementById('detail-content');
const closeButton = document.getElementById('close-detail');
let activeCard = null;

function closeDetail(returnFocus = true) {
  if (detail.hidden) return;

  const previousCard = activeCard;
  detailContent.replaceChildren(); // Removes the current video and stops its playback.
  detail.hidden = true;
  cards.forEach(card => card.setAttribute('aria-expanded', 'false'));
  activeCard = null;

  if (returnFocus && previousCard) {
    previousCard.focus({ preventScroll: true });
    previousCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function openDetail(card) {
  const template = document.getElementById(`detail-${card.dataset.project}`);
  if (!template) return;

  if (!detail.hidden && activeCard === card) {
    closeDetail();
    return;
  }

  const parentGrid = card.closest('.project-grid');
  if (parentGrid) parentGrid.insertAdjacentElement('afterend', detail);
  detailContent.replaceChildren(template.content.cloneNode(true));
  detail.hidden = false;
  cards.forEach(item => item.setAttribute('aria-expanded', String(item === card)));
  activeCard = card;
  detail.focus({ preventScroll: true });
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

cards.forEach(card => card.addEventListener('click', () => openDetail(card)));
closeButton.addEventListener('click', () => closeDetail());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !detail.hidden) closeDetail();
});

// Reveal preview frames when the browser has decoded them.
document.querySelectorAll('.card-video').forEach(video => {
  const reveal = () => { if (video.readyState >= 2) video.classList.add('has-frame'); };
  video.addEventListener('loadeddata', reveal);
  video.addEventListener('seeked', reveal);
  reveal();
});
