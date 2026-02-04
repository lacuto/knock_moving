// js/core/ui.js
import { resetCarousel, nextScreen, prevScreen, setAnimationIndex } from "./carousel.js";

function renderAnimTabs(detail) {
  const tabs = document.getElementById("anim-tabs");
  if (!tabs) return;

  // 本文フェーズ以外は非表示
  if (detail.phase !== "content") {
    tabs.classList.remove("is-visible");
    tabs.innerHTML = "";
    return;
  }

  const list = detail.animations || [];
  if (!list.length) {
    tabs.classList.remove("is-visible");
    tabs.innerHTML = "";
    return;
  }

  tabs.classList.add("is-visible");
  tabs.innerHTML = "";

  list.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ui-anim-pill";
    btn.textContent = `(${item.label})`;

    if (item.index === detail.animationIndex) {
      btn.classList.add("is-active");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 画面タップなどに伝播させない
      setAnimationIndex(item.index);
    });

    tabs.appendChild(btn);
  });
}

export function initUI() {
  const resetBtn = document.getElementById("reset");
  const upBtn = document.getElementById("nav-up");
  const downBtn = document.getElementById("nav-down");

  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetCarousel();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  if (upBtn) {
    upBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevScreen();
    });
  }

  if (downBtn) {
    downBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextScreen();
    });
  }

  // 描画結果（phase/animations）を受け取ってタブを更新
  window.addEventListener("app:render", (e) => {
    renderAnimTabs(e.detail);
  });
}
