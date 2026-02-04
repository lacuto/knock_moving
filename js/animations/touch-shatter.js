// js/animations/touch-shatter.js
import { applySplitAnimation } from "./split.js";

export function applyTouchShatter(container, text) {
  container.innerHTML = "";
  container.textContent = text;

  container.onpointerdown = () => {
    applySplitAnimation(container, text, {
      mode: "shatter",
      maxTranslatePx: 120,
      maxRotateDeg: 180,
      minScale: 0.78,
      maxScale: 1.22,
      fadeMs: 260,

      micro: true,
      microAmpPx: 1.3,
      microHz: 1.4,
    });
  };
}
