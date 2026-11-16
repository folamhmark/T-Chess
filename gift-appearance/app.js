(() => {
  'use strict';

  const screen = document.getElementById('reward-screen');
  const gift = document.getElementById('gift-layer');
  const glow = document.getElementById('gift-glow');
  const burst = document.getElementById('snow-burst');
  const context = burst.getContext('2d');
  const copy = document.getElementById('reward-copy');
  const title = document.getElementById('reward-title');
  const subtitle = copy.querySelector('p');
  const primary = document.getElementById('claim-prize');
  const secondary = document.getElementById('go-home');
  const replayButton = document.getElementById('replay-animation');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hasAnime = typeof window.anime === 'function';
  const MOTION = Object.freeze({
    giftStart: 80, giftFade: 700, snowStart: 240, snowDuration: 2300,
    titleStart: 1720, subtitleStart: 1840, primaryStart: 2060, secondaryStart: 2180,
    flakesPerSide: 330, dustPerSide: 24,
  });
  const animated = [gift, glow, title, subtitle, primary, secondary];
  const snowClock = { time: 0 };
  let timeline = null;
  let playing = false;
  let assetsReady = false;
  let run = 0;
  let particles = [];
  let snowWidth = 375;
  let snowHeight = 812;
  let pixelRatio = 1;

  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const updateArtworkScale = () => screen.style.setProperty('--art-scale', String(screen.clientWidth / 375));
  updateArtworkScale();
  let previousWidth = screen.clientWidth;
  new ResizeObserver(() => {
    updateArtworkScale();
    if (previousWidth !== screen.clientWidth && playing) finish('resize');
    previousWidth = screen.clientWidth;
  }).observe(screen);

  function randomGenerator(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  // Reuse one soft sprite: hundreds of particles do not create hundreds of DOM nodes.
  const dustSprite = document.createElement('canvas');
  dustSprite.width = dustSprite.height = 128;
  const dustContext = dustSprite.getContext('2d');
  const dustGradient = dustContext.createRadialGradient(64, 64, 0, 64, 64, 64);
  dustGradient.addColorStop(0, 'rgba(255,255,255,1)');
  dustGradient.addColorStop(.4, 'rgba(255,255,255,.85)');
  dustGradient.addColorStop(1, 'rgba(255,255,255,0)');
  dustContext.fillStyle = dustGradient;
  dustContext.fillRect(0, 0, 128, 128);

  function clearSnow() {
    if (context) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, burst.width, burst.height);
    }
  }

  function stop() {
    run += 1;
    if (timeline) timeline.pause();
    if (hasAnime) window.anime.remove([...animated, snowClock]);
    particles = [];
    clearSnow();
    timeline = null;
    playing = false;
    replayButton.removeAttribute('aria-busy');
  }

  function setFinalArtwork() {
    document.documentElement.classList.remove('motion-enabled');
    for (const element of [gift, glow, title, subtitle, primary, secondary]) {
      element.style.opacity = '1';
      element.style.transform = '';
    }
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

  function buildSnow() {
    const random = randomGenerator(7641);
    snowWidth = screen.clientWidth;
    snowHeight = screen.clientHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    burst.width = Math.round(snowWidth * pixelRatio);
    burst.height = Math.round(snowHeight * pixelRatio);
    const scale = snowWidth / 375;
    const result = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < MOTION.flakesPerSide + MOTION.dustPerSide; i += 1) {
        const dust = i >= MOTION.flakesPerSide;
        const close = !dust && i % 6 === 0;
        result.push({
          dust,
          size: (dust ? 50 + random() * 120 : close ? 12 + random() * 16 : 2 + random() * 7) * scale,
          originX: side === -1 ? -18 * scale : snowWidth + 18 * scale,
          originY: snowHeight * (.08 + random() * .94),
          direction: side === -1 ? 1 : -1,
          travel: (170 + random() * 340) * scale,
          lift: (65 + random() * 210) * scale,
          fall: (100 + random() * 250) * scale,
          strength: dust ? .02 + random() * .025 : .75 + random() * .25,
          duration: 1350 + random() * 480,
          delay: random() * 320,
        });
      }
    }
    return result;
  }

  function paintSnow() {
    if (!context) return;
    clearSnow();
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const time = snowClock.time;

    // A barely visible haze accompanies the flakes without washing out the gift.
    const cloud = smooth((time - 160) / 460) * (1 - smooth((time - 900) / 500));
    if (cloud > 0) {
      context.globalAlpha = cloud * .025;
      const radius = Math.max(snowWidth, snowHeight) * (.5 + cloud * .75);
      for (const x of [-snowWidth * .15, snowWidth * 1.15]) {
        context.drawImage(dustSprite, x - radius, snowHeight * .5 - radius, radius * 2, radius * 2);
      }
    }
    for (const particle of particles) {
      const t = clamp((time - particle.delay) / particle.duration);
      if (t === 0 || t === 1) continue;
      const x = particle.originX + particle.direction * particle.travel * (1 - Math.pow(1 - t, 1.35));
      const y = particle.originY - 3.4 * particle.lift * t * (1 - t) + particle.fall * t * t;
      const opacity = Math.min(1, t / .06) * (1 - smooth((t - .52) / .48));
      context.globalAlpha = particle.strength * opacity;
      const size = particle.size * (.8 + Math.sin(t * Math.PI) * .5);
      if (particle.dust) {
        context.drawImage(dustSprite, x - size / 2, y - size / 2, size, size);
      } else {
        context.fillStyle = '#fff';
        context.beginPath();
        context.ellipse(x, y, size / 2, size * .42, .4, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;
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
    copy.style.opacity = '1';
    gift.style.opacity = '0';
    gift.style.transform = 'translateY(48px) scale(.88)';
    glow.style.opacity = '.25';
    for (const element of [title, subtitle, primary, secondary]) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(18px)';
    }
    primary.disabled = true;
    secondary.inert = true;
    particles = context ? buildSnow() : [];
    snowClock.time = 0;
    paintSnow();
    timeline = window.anime.timeline({
      autoplay: false,
      complete() { if (token === run) finish('completed'); },
    });
    timeline.add({
      targets: gift,
      opacity: { value: [0, 1], duration: MOTION.giftFade, easing: 'easeInOutSine' },
      translateY: [
        { value: -6, duration: 780, easing: 'easeOutCubic' },
        { value: 0, duration: 360, easing: 'easeInOutSine' },
      ],
      scale: [
        { value: 1.035, duration: 780, easing: 'easeOutCubic' },
        { value: 1, duration: 360, easing: 'easeInOutSine' },
      ],
    }, MOTION.giftStart);
    timeline.add({ targets: glow, opacity: [.25, 1], duration: 1050, easing: 'easeOutCubic' }, 140);
    timeline.add({
      targets: snowClock, time: [0, MOTION.snowDuration], duration: MOTION.snowDuration,
      easing: 'linear', update() { if (token === run) paintSnow(); },
    }, MOTION.snowStart);
    timeline.add({ targets: title, opacity: [0, 1], translateY: [18, 0], scale: [.95, 1], duration: 560, easing: 'easeOutCubic' }, MOTION.titleStart);
    timeline.add({ targets: subtitle, opacity: [0, 1], translateY: [14, 0], duration: 500, easing: 'easeOutCubic' }, MOTION.subtitleStart);
    timeline.add({ targets: primary, opacity: [0, 1], translateY: [18, 0], duration: 540, easing: 'easeOutCubic', complete() { if (token === run) primary.disabled = false; } }, MOTION.primaryStart);
    timeline.add({ targets: secondary, opacity: [0, 1], translateY: [14, 0], duration: 500, easing: 'easeOutCubic', complete() { if (token === run) secondary.inert = false; } }, MOTION.secondaryStart);
    timeline.play();
    screen.dispatchEvent(new CustomEvent('gift:animationstart', { bubbles: true }));
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
    get timeline() { return timeline; },
    get particleCount() { return particles.length; },
    setGiftVisible(visible) { stop(); setFinalArtwork(); gift.style.opacity = visible ? '1' : '0'; },
  });
})();
