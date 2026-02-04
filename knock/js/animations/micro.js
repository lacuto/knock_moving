// js/animations/micro.js
// micro（微細運動）：対象文字を制御できる版（ポップ強化対応）
//
// mode:
// - "all"         : 全文字が動く（互換）
// - "subset"      : ランダムな一部のみ動く
// - "subsetCycle" : ランダム一部のみ動くが、一定周期で対象が入れ替わり続ける
// - "inverse"     : ランダム一部のみ動かない。他は動き続ける

function isMeaningfulChar(ch) {
  return ch !== " " && ch !== "　" && ch !== "\t";
}

function clampInt(n, min, max) {
  const v = Math.floor(n);
  return Math.max(min, Math.min(max, v));
}

function pickRandomIndices(pool, count) {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

function stopPrev(container) {
  if (container && container._microToken) {
    const t = container._microToken;
    t.active = false;
    if (t.timerId) clearInterval(t.timerId);
    container._microToken = null;
  }
}

export function applyMicroAnimation(container, text, options = {}) {
  stopPrev(container);
  container.innerHTML = "";

  const normalized = String(text ?? "").replace(/\r\n|\r/g, "\n");
  const spans = [];
  const eligible = [];

  [...normalized].forEach((ch) => {
    if (ch === "\n") {
      container.appendChild(document.createElement("br"));
      return;
    }
    const sp = document.createElement("span");
    sp.textContent = ch;
    sp.style.display = "inline-block";
    container.appendChild(sp);
    spans.push(sp);

    if (isMeaningfulChar(ch)) eligible.push(spans.length - 1);
  });

  container.classList.add("micro");

  const mode = options.mode || "all";

  const ratio = Number.isFinite(options.ratio) ? options.ratio : null;
  const countOpt = Number.isFinite(options.count) ? options.count : null;
  const cycleMs = Number.isFinite(options.cycleMs) ? options.cycleMs : 3000;

  // ★ポップ強度（set-04 用）
  const ampPx = Number.isFinite(options.ampPx) ? options.ampPx : 9;
  const rotDeg = Number.isFinite(options.rotDeg) ? options.rotDeg : 10;
  const scaleMax = Number.isFinite(options.scaleMax) ? options.scaleMax : 1.08;
  const durationMs = Number.isFinite(options.durationMs) ? options.durationMs : 1400;

  const defaultRatioSubset = 0.28;
  const defaultRatioStill = 0.22;

  function decideCount(fallbackRatio) {
    if (!eligible.length) return 0;
    if (countOpt !== null) return clampInt(countOpt, 0, eligible.length);
    const r = ratio !== null ? ratio : fallbackRatio;
    return clampInt(eligible.length * r, 0, eligible.length);
  }

  function setMoveByIndices(moveSet) {
    spans.forEach((sp, i) => {
      if (moveSet.has(i)) {
        sp.classList.add("micro-move");

        // --- ポップ個体差 ---
        const sx = Math.random() < 0.5 ? -1 : 1;
        const sy = Math.random() < 0.5 ? -1 : 1;

        const mx = ampPx * (0.6 + Math.random() * 0.8) * sx;
        const my = ampPx * (0.6 + Math.random() * 0.8) * sy;
        const mr = rotDeg * (0.5 + Math.random()) * (Math.random() < 0.5 ? -1 : 1);
        const ms = 1 + (scaleMax - 1) * (0.7 + Math.random() * 0.6);
        const md = durationMs * (0.85 + Math.random() * 0.35);
        const delay = -Math.floor(Math.random() * md);

        sp.style.setProperty("--mx", `${mx}px`);
        sp.style.setProperty("--my", `${my}px`);
        sp.style.setProperty("--mr", `${mr}deg`);
        sp.style.setProperty("--ms", `${ms}`);
        sp.style.setProperty("--md", `${md}ms`);
        sp.style.setProperty("--mDelay", `${delay}ms`);
      } else {
        sp.classList.remove("micro-move");
        sp.style.removeProperty("--mx");
        sp.style.removeProperty("--my");
        sp.style.removeProperty("--mr");
        sp.style.removeProperty("--ms");
        sp.style.removeProperty("--md");
        sp.style.removeProperty("--mDelay");
      }
    });
  }

  // all
  if (mode === "all") {
    setMoveByIndices(new Set(spans.map((_, i) => i)));
    return;
  }

  // subset
  if (mode === "subset") {
    const k = decideCount(defaultRatioSubset);
    setMoveByIndices(new Set(pickRandomIndices(eligible, k)));
    return;
  }

  // inverse
  if (mode === "inverse") {
    const kStill = decideCount(defaultRatioStill);
    const still = new Set(pickRandomIndices(eligible, kStill));
    const move = new Set();
    spans.forEach((_, i) => {
      if (eligible.includes(i) && !still.has(i)) move.add(i);
    });
    setMoveByIndices(move);
    return;
  }

  // subsetCycle
  if (mode === "subsetCycle") {
    const token = { active: true, timerId: null };
    container._microToken = token;
    const k = decideCount(defaultRatioSubset);

    const tick = () => {
      if (!token.active || !container.isConnected) return;
      setMoveByIndices(new Set(pickRandomIndices(eligible, k)));
    };

    tick();
    token.timerId = setInterval(tick, cycleMs);
    return;
  }

  // fallback
  setMoveByIndices(new Set(spans.map((_, i) => i)));
}
