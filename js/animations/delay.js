// js/animations/delay.js
export function applyDelayAnimation(container, text, options = {}) {
  container.innerHTML = "";

  const normalized = String(text ?? "").replace(/\r\n|\r/g, "\n");
  const spans = [];

  // options（後方互換あり）
  const mode = options.mode || "in"; // "in" | "out"
  const direction = options.direction || "forward"; // "forward" | "reverse" | "random"
  const stepMs = Number.isFinite(options.stepMs) ? options.stepMs : 150;
  const fadeMs = Number.isFinite(options.fadeMs) ? options.fadeMs : 600;

  // 文字生成
  [...normalized].forEach((char) => {
    if (char === "\n") {
      container.appendChild(document.createElement("br"));
      return;
    }
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    container.appendChild(span);
    spans.push(span);
  });

  // 並び順制御
  let order = spans;
  if (direction === "reverse") {
    order = [...spans].reverse();
  } else if (direction === "random") {
    order = [...spans].sort(() => Math.random() - 0.5);
  }

  // 初期状態
  const fromOpacity = mode === "out" ? 1 : 0;
  const toOpacity = mode === "out" ? 0 : 1;

  order.forEach((span, i) => {
    span.style.opacity = fromOpacity;
    span.style.transitionProperty = "opacity";
    span.style.transitionDuration = `${fadeMs}ms`;
    span.style.transitionTimingFunction = "ease";
    span.style.transitionDelay = `${(i * stepMs) / 1000}s`;
  });

  // 2フレーム待ちで発火
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      order.forEach((span) => {
        span.style.opacity = toOpacity;
      });
    });
  });
}
