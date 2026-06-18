const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const filters = document.querySelectorAll('.filter-btn');
const cards = Array.from(document.querySelectorAll('.gallery-card'));
let currentFilter = 'all';
filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    cards.forEach(card => {
      const show = currentFilter === 'all' || card.dataset.category === currentFilter;
      card.classList.toggle('hidden', !show);
    });
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
const closeBtn = lightbox.querySelector('.lightbox-close');
const prevBtn = lightbox.querySelector('.lightbox-prev');
const nextBtn = lightbox.querySelector('.lightbox-next');
let activeIndex = 0;

function visibleCards(){
  return cards.filter(card => !card.classList.contains('hidden'));
}
function openLightbox(index){
  activeIndex = index;
  const card = visibleCards()[activeIndex];
  if (!card) return;
  const img = card.querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = card.querySelector('span').textContent;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
function shiftLightbox(direction){
  const list = visibleCards();
  if (!list.length) return;
  activeIndex = (activeIndex + direction + list.length) % list.length;
  openLightbox(activeIndex);
}

cards.forEach(card => {
  card.querySelector('.gallery-button').addEventListener('click', () => {
    openLightbox(visibleCards().indexOf(card));
  });
});
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', () => shiftLightbox(-1));
nextBtn.addEventListener('click', () => shiftLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftLightbox(-1);
  if (e.key === 'ArrowRight') shiftLightbox(1);
});

const revealItems = document.querySelectorAll('section, .service-grid article, .design-tile, .gallery-card');
revealItems.forEach(item => item.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .08});
revealItems.forEach(item => observer.observe(item));
