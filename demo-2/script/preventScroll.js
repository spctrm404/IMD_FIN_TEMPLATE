function preventScroll(e) {
  e.preventDefault();
}

function handleTouchStart(e) {
  document.addEventListener('touchmove', preventScroll, { passive: false });
}

function handleTouchEnd() {
  document.removeEventListener('touchmove', preventScroll);
}

document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

const allow = document.querySelector('.section:not(.section-canvas)');
allow.addEventListener(
  'touchstart',
  (e) => {
    e.stopPropagation();
  },
  { passive: false }
);
