// js/sets/set-03.js
// Set 03 (C: 分解)

const set03 = {
  id: "set-03",
  theme: "theme-03",

  description: {
    image: "img/set-03.png",
    alt: "セット3 説明",
  },

  content: {
    text: "海と私や猫、いぬと踊って、\n金魚も君も笑ってた。",

    animations: [
      // 1) 分解：分解（読めない）を基に、まだ読める範囲で分解
      //    分解後は同様に動き続ける
      {
        id: "c-split-readable-micro",
        type: "split",
        label: "分解",
        options: {
          mode: "shatter",

          // ★まだ読める強度（弱め）
          maxTranslatePx: 12,
          maxRotateDeg: 8,
          minScale: 0.96,
          maxScale: 1.04,
          fadeMs: 220,

          // ★分解後も動き続ける
          micro: true,
          microAmpPx: 0.9,
          microHz: 1.0,
        },
      },

      // 2) 分解（読めない）：崩壊 + 微小揺れを継続（強め）
      {
        id: "c-shatter-micro",
        type: "split",
        label: "さらに分解",
        options: {
          mode: "shatter",
          maxTranslatePx: 68,
          maxRotateDeg: 180,
          minScale: 0.82,
          maxScale: 1.18,
          fadeMs: 260,

          micro: true,
          microAmpPx: 1.2,
          microHz: 1.2,
        },
      },

      // 3) 分解出現（ランダム）：崩壊配置のまま1文字ずつランダム出現
      {
        id: "c-appear-random",
        type: "split",
        label: "分解出現",
        options: {
          mode: "appearRandom",
          maxTranslatePx: 78,
          maxRotateDeg: 180,
          minScale: 0.82,
          maxScale: 1.18,
          stepMs: 110,
          fadeMs: 220,
        },
      },
    ],

    maRule: null,
  },

  // 互換
  text: null,
  animations: null,
  maRule: null,
};

set03.text = set03.content.text;
set03.animations = set03.content.animations;
set03.maRule = set03.content.maRule;

export default set03;
