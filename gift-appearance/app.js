(() => {
  'use strict';

  const screen = document.getElementById('reward-screen');
  const gift = document.getElementById('gift-layer');
  const glow = document.getElementById('gift-glow');
  const burst = document.getElementById('snow-burst');
  const replayButton = document.getElementById('replay-animation');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hasAnime = typeof window.anime === 'function';

  const MOTION = Object.freeze({
    giftStart: 160,
    giftFade: 1000,
    giftSettle: 1400,
    snowStart: 420,
    flakesPerSide: 48,
    dustPerSide: 6,
  });
  let timeline = null;
  let playing = false;
  let assetsReady = false;
  let run = 0;
  let particles = [];

  const updateArtworkScale = () => {
    screen.style.setProperty('--art-scale', String(screen.clientWidth / 375));
  };
  updateArtworkScale();
  let previousWidth = screen.clientWidth;
  new ResizeObserver(() => {
    updateArtworkScale();
    if (previousWidth !== screen.clientWidth && playing) finish('resize');
    previousWidth = screen.clientWidth;
  }).observe(screen);

  // A seeded generator makes timing reviews and replay comparisons reproducible.
  function randomGenerator(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function stop() {
    run += 1;
    if (timeline) timeline.pause();
    if (hasAnime) window.anime.remove([gift, glow, ...particles]);
    particles = [];
    burst.replaceChildren();
    timeline = null;
    playing = false;
    replayButton.removeAttribute('aria-busy');
  }

  function setFinalArtwork() {
    document.documentElement.classList.remove('motion-enabled');
    gift.style.opacity = '1';
    gift.style.transform = '';
    glow.style.opacity = '1';
  }

  function finish(reason = 'finished') {
    const wasPlaying = playing;
    stop();
    setFinalArtwork();
    if (wasPlaying) screen.dispatchEvent(new CustomEvent('gift:animationend', {
      bubbles: true, detail: { reason },
    }));
  }

  function buildSnow() {
    const random = randomGenerator(7641);
    const width = screen.clientWidth;
    const scale = width / 375;
    const fragment = document.createDocumentFragment();
    const result = [];

    for (const side of [-1, 1]) {
      for (let i = 0; i < MOTION.flakesPerSide + MOTION.dustPerSide; i += 1) {
        const dust = i >= MOTION.flakesPerSide;
        const size = (dust ? 8 + random() * 12 : 1.8 + random() * 4.5) * scale;
        const element = document.createElement('i');
        element.className = 'snow-fleck' + (dust ? ' snow-fleck--dust' : '');
        element.style.width = size + 'px';
        element.style.height = size * (.7 + random() * .4) + 'px';
        fragment.appendChild(element);
        result.push({
          element, flight: 0,
          originX: side === -1 ? -12 * scale : width + 12 * scale,
          originY: 88 + (266 + random() * 42) * scale,
          direction: side === -1 ? 1 : -1,
          travel: (110 + random() * 225) * scale,
          lift: (120 + random() * 150) * scale,
          fall: (40 + random() * 100) * scale,
          rotation: random() * 240 - 120,
          strength: dust ? .19 : .55 + random() * .4,
          duration: 1750 + random() * 480,
          delay: random() * 130,
        });
      }
    }
    burst.replaceChildren(fragment);
    return result;
  }

  function paintSnow() {
    for (const particle of particles) {
      const t = particle.flight;
      const x = particle.originX + particle.direction * particle.travel * (1 - Math.pow(1 - t, 1.5));
      const y = particle.originY - 3.4 * particle.lift * t * (1 - t) + particle.fall * t * t;
      const fadeIn = Math.min(1, t / .07);
      const fadeOut = Math.pow(Math.max(0, 1 - Math.max(0, t - .28) / .72), 1.5);
      const scale = .75 + Math.sin(t * Math.PI) * .55;
      particle.element.style.opacity = String(particle.strength * fadeIn * fadeOut);
      particle.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${particle.rotation * t}deg) scale(${scale})`;
    }
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
    document.documentElement.classList.remove('motion-enabled');
    gift.style.opacity = '0';
    gift.style.transform = 'translateY(32px) scale(.97)';
    glow.style.opacity = '.25';
    particles = buildSnow();
    paintSnow();

    timeline = window.anime.timeline({
      autoplay: false,
      complete() {
        if (token === run) finish('completed');
      },
    });
    timeline.add({
      targets: gift,
      opacity: { value: [0, 1], duration: MOTION.giftFade, easing: 'easeInOutSine' },
      translateY: { value: [32, 0], duration: MOTION.giftSettle },
      scale: { value: [.97, 1], duration: MOTION.giftSettle },
      easing: 'cubicBezier(.22, 1, .36, 1)',
    }, MOTION.giftStart);
    timeline.add({ targets: glow, opacity: [.25, 1], duration: 1200, easing: 'easeOutCubic' }, 180);
    timeline.add({
      targets: particles,
      flight: [0, 1],
      delay: particle => particle.delay,
      duration: particle => particle.duration,
      easing: 'linear',
      update() { if (token === run) paintSnow(); },
    }, MOTION.snowStart);
    timeline.play();
    screen.dispatchEvent(new CustomEvent('gift:animationstart', { bubbles: true }));
  }

  document.getElementById('claim-prize').addEventListener('click', () => {
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
  })).then(() => {
    assetsReady = true;
    replayButton.disabled = !hasAnime;
    replay();
  });

  window.giftAppearance = Object.freeze({
    screen, gift, glow, ready, replay, play: replay, finish,
    snow: document.getElementById('snow-layer'),
    snowBlur: document.getElementById('snow-blur-layer'),
    copy: document.getElementById('reward-copy'),
    actions: document.getElementById('floating-actions'),
    get isPlaying() { return playing; },
    get timeline() { return timeline; },
    setGiftVisible(visible) {
      stop();
      setFinalArtwork();
      gift.style.opacity = visible ? '1' : '0';
    },
  });
})();
