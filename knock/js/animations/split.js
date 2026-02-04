// js/animations/split.js
// Split / 分解（opacity + transform のみ）
//
// mode:
// - "read"         : 分解（読めるレベル）= 修正前の分解を復活（=軽い揺れ → 収束）
// - "shatter"      : 分解（読めない）= 崩壊して読解不能
//                   + options.micro === true で 崩壊後も微小に揺れ続ける（JSループ）
// - "appearRandom" : 分解出現（ランダム）= 読めない崩壊配置のまま、1文字ずつランダムに出現

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeNum(v, fallback) {
  return Number.isFinite(v) ? v : fallback;
}

function stopPrevLoop(container) {
  if (container && container._splitLoopToken) {
    container._splitLoopToken.active = false;
    container._splitLoopToken = null;
  }
}

export function applySplitAnimation(container, text, options = {}) {
  // 既存ループ停止（再描画で残留しない）
  stopPrevLoop(container);

  container.innerHTML = "";

  const normalized = String(text ?? "").replace(/\r\n|\r/g, "\n");
  const spans = [];

  const mode = options.mode || "read";

  // 1文字のトランジション
  const fadeMs = safeNum(options.fadeMs, 220);
  const stepMs = safeNum(options.stepMs, 120);

  // 崩壊強度（読めない側の既定）
  const maxTranslatePx = safeNum(options.maxTranslatePx, 34);
  const maxRotateDeg = safeNum(options.maxRotateDeg, 22);
  const minScale = safeNum(options.minScale, 0.85);
  const maxScale = safeNum(options.maxScale, 1.15);

  // 微小揺れ（読めない崩壊後）
  const micro = options.micro === true;
  const microAmpPx = safeNum(options.microAmpPx, 1.2); // 揺れ幅
  const microHz = safeNum(options.microHz, 1.2);       // 揺れ速度（大きいほど速い）

  // DOM生成（改行はbr）
  [...normalized].forEach((char) => {
    if (char === "\n") {
      container.appendChild(document.createElement("br"));
      return;
    }
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    container.appendChild(span);
    spans.push(span);
  });

  if (!spans.length) return;

  // 共通transition設定
  spans.forEach((sp) => {
    sp.style.transitionProperty = "opacity, transform";
    sp.style.transitionTimingFunction = "ease";
    sp.style.transitionDuration = `${fadeMs}ms`;
  });

  // (1) 分解（=読めるレベル）: いったん軽くズレて順に収束（修正前の分解として扱う）
  if (mode === "read") {
    spans.forEach((sp, i) => {
      sp.style.opacity = "0";
      sp.style.transform = `translate(${rand(-10, 10)}px, ${rand(-10, 10)}px)`;
      sp.style.transitionDelay = `${(i * stepMs) / 1000}s`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        spans.forEach((sp) => {
          sp.style.opacity = "1";
          sp.style.transform = "translate(0, 0)";
        });
      });
    });

    return;
  }

  // 崩壊Transform生成
  const makeShatterTransform = () => {
    const x = rand(-maxTranslatePx, maxTranslatePx);
    const y = rand(-maxTranslatePx, maxTranslatePx);
    const r = rand(-maxRotateDeg, maxRotateDeg);
    const s = rand(minScale, maxScale);
    // base（崩壊配置）
    return `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
  };

  // (2) 分解（読めない）: 崩壊して読解不能へ（opacityは維持）
  if (mode === "shatter") {
    // 初期：通常表示
    spans.forEach((sp) => {
      sp.style.opacity = "1";
      sp.style.transform = "translate(0, 0)";
      sp.style.transitionDelay = "0s";
    });

    // 各spanに baseTransform を保持
    const base = spans.map(() => makeShatterTransform());

    // 2フレーム後に崩壊へ
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        spans.forEach((sp, i) => {
          sp._baseTransform = base[i];
          sp.style.transform = base[i];
          sp.style.opacity = "1";
        });

        // 崩壊後も微小に揺れ続ける（JSループ）
        if (micro) {
          const token = { active: true };
          container._splitLoopToken = token;

          const phaseX = spans.map(() => rand(0, Math.PI * 2));
          const phaseY = spans.map(() => rand(0, Math.PI * 2));

          const start = performance.now();

          const loop = (t) => {
            if (!token.active) return;
            // コンテナが差し替えられた／DOMから消えた場合も停止
            if (!container.isConnected) {
              token.active = false;
              return;
            }

            const dt = (t - start) / 1000;
            const w = Math.PI * 2 * microHz;

            spans.forEach((sp, i) => {
              if (!sp.isConnected) return;
              const jx = Math.sin(w * dt + phaseX[i]) * microAmpPx;
              const jy = Math.cos(w * dt + phaseY[i]) * microAmpPx;
              // baseTransform を維持したまま、末尾に微小translateを加える
              const b = sp._baseTransform || base[i];
              sp.style.transform = `${b} translate(${jx}px, ${jy}px)`;
            });

            requestAnimationFrame(loop);
          };

          requestAnimationFrame(loop);
        }
      });
    });

    return;
  }

  // (3) 分解出現（ランダム）:
  // 先に全員を崩壊位置へ置き、不可視 → ランダム順で可視化（transformは崩壊のまま）
  if (mode === "appearRandom") {
    const base = spans.map(() => makeShatterTransform());

    spans.forEach((sp, i) => {
      sp._baseTransform = base[i];
      sp.style.transform = base[i];
      sp.style.opacity = "0";
      sp.style.transitionDelay = "0s";
    });

    const order = shuffle(spans);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        order.forEach((sp, i) => {
          sp.style.transitionDelay = `${(i * stepMs) / 1000}s`;
          sp.style.opacity = "1";
          // transformは崩壊位置のまま（読めない維持）
        });
      });
    });

    return;
  }

  // 未知modeはreadにフォールバック
  applySplitAnimation(container, text, { ...options, mode: "read" });
}
