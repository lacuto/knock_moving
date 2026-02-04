// js/animations/shuffle.js
// shuffle：文章をタップした時に文字順をシャッフル
// 付随アニメは opacity / transform のみ

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stopPrev(container) {
  if (container && container._shuffleToken) {
    container._shuffleToken.active = false;
    container._shuffleToken = null;
  }
}

export function applyShuffleAnimation(container, text, options = {}) {
  stopPrev(container);
  container.innerHTML = "";

  const normalized = String(text ?? "").replace(/\r\n|\r/g, "\n");

  // アニメ設定（必要に応じて set-06 側から options で上書き可）
  const outMs = Number.isFinite(options.outMs) ? options.outMs : 180;
  const inMs = Number.isFinite(options.inMs) ? options.inMs : 240;
  const jitterPx = Number.isFinite(options.jitterPx) ? options.jitterPx : 6;

  // “改行位置は維持”するためのスロット配列
  // slot: { kind: "br" } or { kind: "char", el: span }
  const slots = [];
  const charSpans = [];

  for (const ch of [...normalized]) {
    if (ch === "\n") {
      const br = document.createElement("br");
      slots.push({ kind: "br", el: br });
    } else {
      const sp = document.createElement("span");
      sp.textContent = ch;
      sp.style.display = "inline-block";
      sp.style.willChange = "transform, opacity";
      sp.style.opacity = "1";
      sp.style.transform = "translate(0, 0)";
      slots.push({ kind: "char", el: sp });
      charSpans.push(sp);
    }
  }

  // 初期描画（通常順）
  slots.forEach((s) => container.appendChild(s.el));

  // シャッフル処理（タップで発火）
  let isAnimating = false;
  const token = { active: true };
  container._shuffleToken = token;

  const doShuffle = () => {
    if (!token.active) return;
    if (isAnimating) return;
    isAnimating = true;

    // 1) フェードアウト＋ジッタ（全体）
    charSpans.forEach((sp) => {
      sp.style.transition = `opacity ${outMs}ms ease, transform ${outMs}ms ease`;
      sp.style.opacity = "0";
      const x = (Math.random() - 0.5) * jitterPx;
      const y = (Math.random() - 0.5) * jitterPx;
      sp.style.transform = `translate(${x}px, ${y}px)`;
    });

    // 2) out 終了後に並び替え→フェードイン
    window.setTimeout(() => {
      if (!token.active) return;

      const shuffledChars = shuffle(charSpans);

      // br は位置固定、char スロットだけ差し替える
      container.innerHTML = "";
      let idx = 0;
      for (const s of slots) {
        if (s.kind === "br") {
          container.appendChild(s.el);
        } else {
          const el = shuffledChars[idx++];
          container.appendChild(el);
        }
      }

      // 3) フェードイン（2フレーム待って確実に反映）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          charSpans.forEach((sp) => {
            sp.style.transition = `opacity ${inMs}ms ease, transform ${inMs}ms ease`;
            sp.style.opacity = "1";
            sp.style.transform = "translate(0, 0)";
          });
          window.setTimeout(() => {
            isAnimating = false;
          }, inMs);
        });
      });
    }, outMs);
  };

  // タップ（文章領域）で発火
  container.onpointerdown = () => {
    doShuffle();
  };
}
