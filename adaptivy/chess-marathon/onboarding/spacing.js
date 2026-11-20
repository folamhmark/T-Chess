const onboarding = document.querySelector(".screen");
const illustration = onboarding.querySelector(".illustration");
const blocks = Array.from(onboarding.querySelectorAll(".screen-header, .details > *, .start, .bottom-bar"));

const observer = new ResizeObserver(() => {
  // The illustration can grow, so only its flex basis counts toward the minimum.
  const minArtHeight = parseFloat(getComputedStyle(illustration).flexBasis);
  const blocksHeight = blocks.reduce((height, block) =>
    height + block.getBoundingClientRect().height, 0);
  const availableHeight = onboarding.getBoundingClientRect().height - minArtHeight - blocksHeight;
  onboarding.style.setProperty("--spacing-room", `${availableHeight}px`);
});

observer.observe(onboarding);
for (const block of blocks) observer.observe(block, { box: "border-box" });
