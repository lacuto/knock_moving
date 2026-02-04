// js/core/carousel.js
import { sets } from "../sets/index.js";
import { state, PHASES } from "./state.js";
import { AUTO_TIME } from "./config.js";

import { applyDelayAnimation } from "../animations/delay.js";
import { applySplitAnimation } from "../animations/split.js";
import { applyMicroAnimation } from "../animations/micro.js";
import { applyStillAnimation } from "../animations/still.js";
import { applyTouchAnimation } from "../animations/touch.js";
import { applyTouchShatter } from "../animations/touch-shatter.js";
import { applyShuffleAnimation } from "../animations/shuffle.js";
import { applyHoldToRead } from "../animations/hold-to-read.js";


let container = null;
let timer = null;

// タイトル画面（画像表示）
const TITLE_SCREEN = {
  theme: "theme-01",
  image: "img/title.png",
  alt: "展示タイトル",
};

function clearAuto() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function startAuto() {
  clearAuto();
  timer = setTimeout(() => {
    nextScreen();
  }, AUTO_TIME);
}

function setTheme(themeName) {
  const themeLink = document.getElementById("theme-style");
  if (themeLink && themeName) {
    themeLink.href = `css/themes/${themeName}.css`;
  }
}

function setIndicator(text) {
  const el = document.getElementById("indicator");
  if (el) el.textContent = text;
}

function normalizeText(setObj) {
  return setObj?.content?.text ?? setObj?.text ?? "";
}

function normalizeAnimations(setObj) {
  return setObj?.content?.animations ?? setObj?.animations ?? [];
}

function normalizeDescription(setObj) {
  return setObj?.description?.text ?? "";
}

function getAnimLabel(anim) {
  return anim?.label || anim?.id || anim?.type || "anim";
}

// UI側（アニメ名タブ）へ現状を通知
function emitViewModel(setObj) {
  const animations = setObj ? normalizeAnimations(setObj) : [];
  window.dispatchEvent(
    new CustomEvent("app:render", {
      detail: {
        phase: state.currentPhase,
        setIndex: state.currentSetIndex,
        setCount: sets.length,
        animationIndex: state.currentAnimationIndex,
        animations: animations.map((a, i) => ({ index: i, label: getAnimLabel(a) })),
      },
    })
  );
}

function resetContainerClasses() {
  // 表現クラス残留を防ぐ
  container.classList.remove(
    "fade-in",
    "fade-out",
    "fade-pulse",
    "blink",
    "micro",
    "touch",
    "react"
  );
  container.onpointerdown = null;

  // CSS変数/インライン指定の残留を防ぐ
  container.style.removeProperty("--fade-in-duration");
  container.style.removeProperty("--fade-out-duration");
  container.style.removeProperty("--fade-pulse-duration");
  container.style.removeProperty("--fade-pulse-min");
  container.style.removeProperty("--fade-pulse-max");
  container.style.removeProperty("--blink-duration");

  container.innerHTML = "";
  container.textContent = "";
}

function renderImage(src, alt = "") {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.decoding = "async";
  img.loading = "eager";
  container.appendChild(img);
}

function renderTitle() {
  setTheme(TITLE_SCREEN.theme);
  resetContainerClasses();

  if (TITLE_SCREEN.image) {
    renderImage(TITLE_SCREEN.image, TITLE_SCREEN.alt || "");
  } else {
    container.textContent = TITLE_SCREEN.text || "";
  }

  setIndicator("TITLE");
  emitViewModel(null);
  startAuto();
}

function renderDescription(setObj) {
  setTheme(setObj.theme);
  resetContainerClasses();

  if (setObj.description?.image) {
    renderImage(setObj.description.image, setObj.description.alt || "");
  } else {
    container.textContent = normalizeDescription(setObj) || "（説明未設定）";
  }

  setIndicator(`SET ${state.currentSetIndex + 1}/${sets.length} : DESCRIPTION`);
  emitViewModel(setObj);
  startAuto();
}

function renderContent(setObj) {
  setTheme(setObj.theme);

  const text = normalizeText(setObj);
  const animations = normalizeAnimations(setObj);

  // indexが範囲外になった場合に丸める
  if (animations.length > 0) {
    state.currentAnimationIndex = Math.max(
      0,
      Math.min(state.currentAnimationIndex, animations.length - 1)
    );
  } else {
    state.currentAnimationIndex = 0;
  }

  const animation = animations[state.currentAnimationIndex];

  resetContainerClasses();

  if (!animation) {
    container.textContent = text;
    setIndicator(`SET ${state.currentSetIndex + 1}/${sets.length} : CONTENT`);
    emitViewModel(setObj);
    startAuto();
    return;
  }

  const type = animation.type;
  const label = getAnimLabel(animation);
  setIndicator(`SET ${state.currentSetIndex + 1}/${sets.length} : ${label}`);

  // fade（CSSクラス）
  if (type === "fade-in") {
    container.textContent = text;
    requestAnimationFrame(() => container.classList.add("fade-in"));
    emitViewModel(setObj);
    startAuto();
    return;
  }

  if (type === "fade-out") {
    container.textContent = text;
    requestAnimationFrame(() => container.classList.add("fade-out"));
    emitViewModel(setObj);
    startAuto();
    return;
  }

  if (type === "fade") {
    const mode = animation.options?.mode || "in";
    const durationMs = animation.options?.durationMs;
    container.textContent = text;

    // duration 指定がある場合のみ上書き（未指定はCSS既定値）
    if (typeof durationMs === "number" && Number.isFinite(durationMs) && durationMs > 0) {
      container.style.setProperty("--fade-in-duration", `${durationMs}ms`);
      container.style.setProperty("--fade-out-duration", `${durationMs}ms`);
      // pulse は別指定があり得るので、ここでは触らない
    }

    if (mode === "out") {
      requestAnimationFrame(() => container.classList.add("fade-out"));
    } else if (mode === "pulse") {
      // pulse だけは min/max/duration を個別に反映
      const minOpacity = animation.options?.minOpacity;
      const maxOpacity = animation.options?.maxOpacity;
      const pulseDurationMs = animation.options?.durationMs;

      if (
        typeof pulseDurationMs === "number" &&
        Number.isFinite(pulseDurationMs) &&
        pulseDurationMs > 0
      ) {
        container.style.setProperty("--fade-pulse-duration", `${pulseDurationMs}ms`);
      }
      if (typeof minOpacity === "number" && Number.isFinite(minOpacity)) {
        container.style.setProperty("--fade-pulse-min", String(minOpacity));
      }
      if (typeof maxOpacity === "number" && Number.isFinite(maxOpacity)) {
        container.style.setProperty("--fade-pulse-max", String(maxOpacity));
      }
      requestAnimationFrame(() => container.classList.add("fade-pulse"));
    } else {
      requestAnimationFrame(() => container.classList.add("fade-in"));
    }

    emitViewModel(setObj);
    startAuto();
    return;
  }

  // blink（CSSクラス）
  if (type === "blink") {
    container.textContent = text;
    const intervalMs = animation.options?.intervalMs ?? 500;
    // 0.5sおき（ON/OFF）= 1周期 1.0s
    const durationMs = Math.max(100, Number(intervalMs) * 2);
    if (Number.isFinite(durationMs)) {
      container.style.setProperty("--blink-duration", `${durationMs}ms`);
    }
    requestAnimationFrame(() => container.classList.add("blink"));
    emitViewModel(setObj);
    startAuto();
    return;
  }

  // JSアニメ系
  if (type === "delay") {
    applyDelayAnimation(container, text, animation.options);
    emitViewModel(setObj);
    startAuto();
    return;
  }
  if (type === "split") {
    applySplitAnimation(container, text, animation.options);
    emitViewModel(setObj);
    startAuto();
    return;
  }

  if (type === "micro") {
    applyMicroAnimation(container, text, animation.options);
    emitViewModel(setObj);
    startAuto();
    return;
  }


  if (type === "still") {
    applyStillAnimation(container, text);
    emitViewModel(setObj);
    startAuto();
    return;
  }
  if (type === "touch") {
    applyTouchAnimation(container, text);
    emitViewModel(setObj);
    startAuto();
    return;
  }

  if (type === "touch-shatter") {
    applyTouchShatter(container, text);
    emitViewModel(setObj);
    startAuto();
    return;
  }
  
if (type === "shuffle") {
  applyShuffleAnimation(container, text, animation.options);
  emitViewModel(setObj);
  startAuto();
  return;
}


  if (type === "hold") {
    applyHoldToRead(container, text);
    emitViewModel(setObj);
    startAuto();
    return;
  }


  // 未知type
  container.textContent = text;
  emitViewModel(setObj);
  startAuto();
}

function render() {
  if (!container) return;

  if (state.currentPhase === PHASES.TITLE) {
    renderTitle();
    return;
  }

  const setObj = sets[state.currentSetIndex];

  if (state.currentPhase === PHASES.DESCRIPTION) {
    renderDescription(setObj);
    return;
  }

  renderContent(setObj);
}

/*
  画面移動（上下矢印用）
  - CONTENT中に「次アニメ」は含めない（アニメは名前UIで切替）
*/
export function nextScreen() {
  // TITLE → set-01 説明
  if (state.currentPhase === PHASES.TITLE) {
    state.currentSetIndex = 0;
    state.currentAnimationIndex = 0;
    state.currentPhase = PHASES.DESCRIPTION;
    render();
    return;
  }

  // DESCRIPTION → CONTENT（同セット）
  if (state.currentPhase === PHASES.DESCRIPTION) {
    state.currentPhase = PHASES.CONTENT;
    render();
    return;
  }

  // CONTENT → 次へ
  const lastIndex = sets.length - 1;

  // ★ ここが変更点：
  // set-06（最後のセット）の本文から「次」へ行くと、タイトルに戻る
  if (state.currentSetIndex === lastIndex) {
    state.currentPhase = PHASES.TITLE;
    render();
    return;
  }

  // CONTENT → 次セットの説明へ
  state.currentSetIndex = state.currentSetIndex + 1;
  state.currentAnimationIndex = 0;
  state.currentPhase = PHASES.DESCRIPTION;
  render();
}

export function prevScreen() {
  if (state.currentPhase === PHASES.TITLE) return;

  if (state.currentPhase === PHASES.DESCRIPTION) {
    // set-01の説明ならタイトルへ、それ以外は前セット本文へ
    if (state.currentSetIndex === 0) {
      state.currentPhase = PHASES.TITLE;
      render();
      return;
    }

    state.currentSetIndex = Math.max(0, state.currentSetIndex - 1);

    // 前セット本文の最後のアニメに合わせる
    const prevSet = sets[state.currentSetIndex];
    const anims = normalizeAnimations(prevSet);
    state.currentAnimationIndex = anims.length > 0 ? anims.length - 1 : 0;

    state.currentPhase = PHASES.CONTENT;
    render();
    return;
  }

  // CONTENT → 同セット説明へ
  state.currentPhase = PHASES.DESCRIPTION;
  render();
}

/* アニメ選択：本文フェーズのみ */
export function setAnimationIndex(index) {
  if (state.currentPhase !== PHASES.CONTENT) return;

  const setObj = sets[state.currentSetIndex];
  const animations = normalizeAnimations(setObj);
  if (!animations.length) return;

  const i = Math.max(0, Math.min(index, animations.length - 1));
  state.currentAnimationIndex = i;
  render();
}

export function resetCarousel() {
  state.currentSetIndex = 0;
  state.currentAnimationIndex = 0;
  state.currentPhase = PHASES.TITLE;
  render();
}

export function initCarousel() {
  container = document.getElementById("text-container");
  if (!container) return;

  state.currentPhase = PHASES.TITLE;
  render();
}
