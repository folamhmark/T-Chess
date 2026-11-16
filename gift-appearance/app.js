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
    giftStart: 80, giftFade: 700, snowStart: 80, snowDuration: 1940, snowTail: 660,
    titleStart: 1720, subtitleStart: 1840, primaryStart: 2060, secondaryStart: 2180,
  });
  const animated = [gift, glow, title, subtitle, primary, secondary];
  const snowClock = { time: 0 };
  let timeline = null;
  let playing = false;
  let assetsReady = false;
  let run = 0;
  let snowWidth = 375;
  let snowHeight = 812;
  let pixelRatio = 1;
  let flakes = [];

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
    clearSnow();
    flakes = [];
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

  // A broad soft eraser sweeps left/right, revealing the scene row by row.
  function buildSnow() {
    snowWidth = screen.clientWidth;
    snowHeight = screen.clientHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    burst.width = Math.round(snowWidth * pixelRatio);
    burst.height = Math.round(snowHeight * pixelRatio);
    let seed = 7641;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const scale = snowWidth / 375;
    flakes = Array.from({ length: 220 }, () => {
      const birth = 100 + random() * 1500;
      const position = (1 - Math.cos(Math.PI * birth / MOTION.snowDuration)) / 2 * 7;
      const segment = Math.min(6, Math.floor(position));
      const fraction = position - segment;
      const fromX = snowWidth * (segment % 2 ? 1.22 : -.22);
      const toX = snowWidth * (segment % 2 ? -.22 : 1.22);
      const angle = random() * Math.PI * 2;
      const rim = snowHeight * .18 + (random() - .65) * 32 * scale;
      const speed = (35 + random() * 110) * scale;
      return {
        birth, lifetime: 600 + random() * 350,
        x: fromX + (toX - fromX) * fraction + Math.cos(angle) * rim,
        y: snowHeight * (-.06 + position * .16) + Math.sin(angle) * rim,
        vx: Math.cos(angle) * speed + (random() - .5) * 45 * scale,
        vy: Math.sin(angle) * speed - 30 * scale,
        gravity: (70 + random() * 90) * scale,
        radius: (1 + random() * 2.4) * scale,
        phase: random() * Math.PI * 2, flutter: (3 + random() * 8) * scale,
      };
    });
  }

  function paintSnow() {
    if (!context) return;
    clearSnow();
    const progress = (1 - Math.cos(Math.PI * clamp(snowClock.time / MOTION.snowDuration))) / 2;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1;
    context.fillStyle = '#fff';
    if (progress < 1) context.fillRect(0, 0, snowWidth, snowHeight);
    if (progress <= 0) return;

    const points = Array.from({ length: 8 }, (_, i) => ({
      x: snowWidth * (i % 2 ? 1.22 : -.22),
      y: snowHeight * (-.06 + i * .16),
    }));
    const distance = points.slice(1).reduce((sum, point, i) =>
      sum + Math.hypot(point.x - points[i].x, point.y - points[i].y), 0);
    let remaining = distance * progress;
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = snowHeight * .36;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#fff';
    context.shadowColor = '#fff';
    context.shadowBlur = 12 * snowWidth / 375;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length && remaining > 0; i += 1) {
      const from = points[i - 1];
      const to = points[i];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      const portion = Math.min(1, remaining / length);
      context.lineTo(from.x + (to.x - from.x) * portion, from.y + (to.y - from.y) * portion);
      remaining -= length;
    }
    context.stroke();
    context.restore();
    // Clear the last soft edge without a cut at the end of the final sweep.
    if (progress > .9) {
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = `rgba(0,0,0,${smooth((progress - .9) / .1)})`;
      context.fillRect(0, 0, snowWidth, snowHeight);
      context.globalCompositeOperation = 'source-over';
    }

    // Origins are fixed at birth; every flake then flies independently of the brush.
    context.fillStyle = '#fff';
    for (const flake of flakes) {
      const age = snowClock.time - flake.birth;
      if (age <= 0 || age >= flake.lifetime) continue;
      const seconds = age / 1000;
      const drag = (1 - Math.exp(-1.8 * seconds)) / 1.8;
      const flutter = (Math.sin(flake.phase + seconds * 7) - Math.sin(flake.phase)) * flake.flutter;
      const x = flake.x + flake.vx * drag + flutter;
      const y = flake.y + flake.vy * drag + .5 * flake.gravity * seconds * seconds;
      context.globalAlpha = smooth(age / 70) * (1 - smooth((age / flake.lifetime - .45) / .55)) * .85;
      context.beginPath();
      context.ellipse(x, y, flake.radius, flake.radius * .85, flake.phase + seconds, 0, Math.PI * 2);
      context.fill();
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
    if (context) buildSnow();
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
      targets: snowClock, time: [0, MOTION.snowDuration + MOTION.snowTail], duration: MOTION.snowDuration + MOTION.snowTail,
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
    get particleCount() { return flakes.filter(flake => snowClock.time > flake.birth && snowClock.time < flake.birth + flake.lifetime).length; },
    setGiftVisible(visible) { stop(); setFinalArtwork(); gift.style.opacity = visible ? '1' : '0'; },
  });
})();
