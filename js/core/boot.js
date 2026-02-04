import { initCarousel } from "./carousel.js";
import { initUI } from "./ui.js";

export function boot() {
  window.addEventListener("load", () => {
    initCarousel();
    initUI();
  });
}
