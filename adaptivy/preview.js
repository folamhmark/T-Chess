const comparison = document.querySelector('#comparison');
const custom = document.querySelector('#custom');
const dimensions = custom.querySelector('form');
const frame = custom.querySelector('iframe');
const { width, height } = dimensions.elements;

document.querySelector('.view-picker').addEventListener('change', (event) => {
  const isCustom = event.target.value === 'custom';
  comparison.hidden = isCustom;
  custom.hidden = !isCustom;
});

function resizePreview() {
  if (!width.validity.valid || !height.validity.valid) return;

  frame.width = width.value;
  frame.height = height.value;
  frame.title = `Onboarding · ${width.value} × ${height.value}`;
}

dimensions.addEventListener('input', resizePreview);
dimensions.addEventListener('submit', (event) => event.preventDefault());

const fontStatus = document.querySelector('#font-status');
const firstFrame = comparison.querySelector('iframe');

async function showFontStatus() {
  const preview = firstFrame.contentDocument;
  const heading = preview?.querySelector('#marathon-title');
  if (!heading || !preview.fonts) return;

  const context = preview.createElement('canvas').getContext('2d');
  if (!context) return;

  const sample = heading.textContent;
  function measure(families) {
    context.font = `650 30px ${families}`;
    return context.measureText(sample).width;
  }

  await preview.fonts.ready;
  fontStatus.hidden = false;
  if (measure('serif') === measure('monospace')) {
    fontStatus.textContent = 'Браузер не позволяет проверить локальный SF Pro';
    return;
  }

  // If the local face draws the sample, changing the fallback leaves its width intact.
  const families = ['Local SF Pro', 'Local SF Pro Display', 'SF Pro Display', 'SF Pro'];
  const available = families.some(family =>
    measure(`"${family}", serif`) === measure(`"${family}", monospace`)
  );
  fontStatus.textContent = available
    ? 'Локальный SF Pro доступен'
    : 'Локальный файл SF Pro не найден в этом браузере';
}

firstFrame.addEventListener('load', showFontStatus);
if (firstFrame.contentDocument?.readyState === 'complete') showFontStatus();
