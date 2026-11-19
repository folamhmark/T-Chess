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
