export function applyTouchAnimation(container, text) {
  container.innerHTML = "";

  const normalized = text.replace(/\r\n|\r/g, "\n");

  [...normalized].forEach(char => {
    if (char === "\n") {
      container.appendChild(document.createElement("br"));
      return;
    }

    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("touch-char");
    container.appendChild(span);
  });

  container.classList.add("touch");

  // 介入：タッチした瞬間だけ反応
  container.onpointerdown = () => {
    container.classList.remove("react");
    // 再トリガー保証
    requestAnimationFrame(() => {
      container.classList.add("react");
    });
  };
}
