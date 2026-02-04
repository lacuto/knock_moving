// js/animations/hold-to-read.js
export function applyHoldToRead(container, text) {
  container.innerHTML = "";

  const spans = [...text].map((ch) => {
    const sp = document.createElement("span");
    sp.textContent = ch;
    sp.style.display = "inline-block";
    sp.style.opacity = "0";
    sp.style.transform = "translate(6px, -6px)";
    sp.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    return sp;
  });

  spans.forEach((sp) => container.appendChild(sp));

  container.onpointerdown = () => {
    spans.forEach((sp) => {
      sp.style.opacity = "1";
      sp.style.transform = "translate(0, 0)";
    });
  };

  container.onpointerup = () => {
    spans.forEach((sp) => {
      sp.style.opacity = "0";
      sp.style.transform = "translate(6px, -6px)";
    });
  };

  container.onpointerleave = container.onpointerup;
}
