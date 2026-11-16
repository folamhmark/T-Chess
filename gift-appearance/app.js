(() => {
  'use strict';

  const screen = document.getElementById('reward-screen');
  const gift = document.getElementById('gift-layer');
  const glow = document.getElementById('gift-glow');

  // Keep the original 375px artwork geometry when the viewport is narrower.
  const updateArtworkScale = () => {
    screen.style.setProperty('--art-scale', String(screen.clientWidth / 375));
  };
  updateArtworkScale();
  new ResizeObserver(updateArtworkScale).observe(screen);

  // Integration hook: this static study does not issue or claim a real reward.
  document.getElementById('claim-prize').addEventListener('click', () => {
    screen.dispatchEvent(new CustomEvent('gift:claim', {
      bubbles: true,
      detail: { milestone: 10, rewardType: 'cashback' },
    }));
  });

  // The approved screen is visible on load. No appearance animation is imposed.
  window.giftAppearance = Object.freeze({
    screen,
    gift,
    glow,
    snow: document.getElementById('snow-layer'),
    snowBlur: document.getElementById('snow-blur-layer'),
    copy: document.getElementById('reward-copy'),
    actions: document.getElementById('floating-actions'),
    setGiftVisible(visible) {
      gift.style.opacity = visible ? '1' : '0';
    },
  });
})();
