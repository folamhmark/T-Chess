(() => {
  'use strict';

  const screen = document.getElementById('reward-screen');
  const gift = document.getElementById('gift-layer');
  const glow = document.getElementById('gift-glow');
  const burst = document.getElementById('snow-burst');
  const copy = document.getElementById('reward-copy');
  const title = document.getElementById('reward-title');
  const subtitle = copy.querySelector('p');
  const primary = document.getElementById('claim-prize');
  const secondary = document.getElementById('go-home');
  const replayButton = document.getElementById('replay-animation');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hasAnime = typeof window.anime === 'function';
  const reveal = window.successReveal.create({ artwork: gift, glow, title, subtitle, primary, secondary, canvas: burst });
  let leadInTimer = null;
  let playing = false;
  let assetsReady = false;
  let run = 0;

  const updateArtworkScale = () => screen.style.setProperty('--art-scale', String(screen.clientWidth / 375));
  updateArtworkScale();
  let previousWidth = screen.clientWidth;
  new ResizeObserver(() => {
    updateArtworkScale();
    if (previousWidth !== screen.clientWidth && playing) finish('resize');
    previousWidth = screen.clientWidth;
  }).observe(screen);

  function stop() {
    run += 1;
    clearTimeout(leadInTimer);
    leadInTimer = null;
    screen.classList.remove('anticipating');
    reveal.stop();
    playing = false;
    replayButton.removeAttribute('aria-busy');
  }

  function setFinalArtwork() {
    document.documentElement.classList.remove('motion-enabled');
    reveal.finish();
    copy.style.opacity = '1';
    primary.disabled = false;
    secondary.inert = false;
  }

  function finish(reason = 'finished') {
    const wasPlaying = playing;
    stop();
    setFinalArtwork();
    if (wasPlaying) screen.dispatchEvent(new CustomEvent('gift:animationend', {
      bubbles: true, detail: { reason },
    }));
  }

  function replay() {
    if (!assetsReady) return;
    stop();
    if (!hasAnime || reducedMotion.matches) {
      setFinalArtwork();
      return;
    }
    const token = run;
    playing = true;
    replayButton.setAttribute('aria-busy', 'true');
    screen.classList.add('anticipating');
    document.documentElement.classList.remove('motion-enabled');
    copy.style.opacity = '1';
    primary.disabled = true;
    secondary.inert = true;
    const timeline = reveal.prepare({
      complete() { if (token === run) finish('completed'); },
      enablePrimary() { if (token === run) primary.disabled = false; },
      enableSecondary() { if (token === run) secondary.inert = false; },
    });
    // Hold a clean white screen before playing the unchanged effect.
    leadInTimer = setTimeout(() => {
      leadInTimer = null;
      if (token !== run) return;
      screen.classList.remove('anticipating');
      timeline.play();
      screen.dispatchEvent(new CustomEvent('gift:animationstart', { bubbles: true }));
    }, window.successReveal.whiteHold);
  }

  primary.addEventListener('click', () => {
    screen.dispatchEvent(new CustomEvent('gift:claim', {
      bubbles: true, detail: { milestone: 10, rewardType: 'cashback' },
    }));
  });
  replayButton.addEventListener('click', replay);
  gift.addEventListener('click', replay);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finish('reduced-motion');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) finish('backgrounded');
  });
  const ready = Promise.all([...screen.querySelectorAll('img')].map(image => {
    if (typeof image.decode === 'function') return image.decode().catch(() => {});
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  })).then(() => { assetsReady = true; replayButton.disabled = !hasAnime; replay(); });

  window.giftAppearance = Object.freeze({
    screen, gift, glow, ready, replay, play: replay, finish,
    snow: document.getElementById('snow-layer'),
    snowBlur: document.getElementById('snow-blur-layer'),
    copy, actions: document.getElementById('floating-actions'),
    get isPlaying() { return playing; },
    get timeline() { return reveal.timeline; },
    get particleCount() { return reveal.particleCount; },
    setGiftVisible(visible) { stop(); setFinalArtwork(); gift.style.opacity = visible ? '1' : '0'; },
  });
})();
