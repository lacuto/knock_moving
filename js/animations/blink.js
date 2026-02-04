export function applyBlinkAnimation(container, text) {
  container.innerHTML = "";
  container.textContent = text;

  container.classList.add("blink");
}
