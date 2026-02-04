// js/sets/set-04.js
// Set 04 (D: 微細運動) - ポップ強化版

const set04 = {
  id: "set-04",
  theme: "theme-04",

  description: {
    image: "img/set-04.png",
    alt: "セット4 説明",
  },

  content: {
    text: "私は飛んだ。\nその瞬間、恥はもう無かった",

    animations: [
      // 1) 微細運動（ランダムな一部の文字のみ・ポップ）
      {
        id: "d-micro-subset",
        type: "micro",
        label: "文字が動く",
        options: {
          mode: "subset",
          ratio: 0.1,

          ampPx: 5,
          rotDeg: 6,
          scaleMax: 1.1,
          durationMs: 1800,
        },
      },

      // 2) 微細運動（ランダムな一部の文字を3秒周期で変更し続ける）
      {
        id: "d-micro-subset-cycle",
        type: "micro",
        label: "複数の文字が動く",
        options: {
          mode: "subsetCycle",
          ratio: 0.4,
          cycleMs: 5000,

          ampPx: 10,
          rotDeg: 12,
          scaleMax: 1.1,
          durationMs: 1200,
        },
      },

      // 3) 微細運動（ランダムな一部の文字のみ動かない。他は動き続ける）
      {
        id: "d-micro-inverse",
        type: "micro",
        label: "動かない文字がある",
        options: {
          mode: "inverse",
          ratio: 0.1,

          ampPx: 10,
          rotDeg: 12,
          scaleMax: 1.1,
          durationMs: 1200,
        },
      },
    ],

    maRule: null,
  },

  // ---- 互換レイヤー ----
  text: null,
  animations: null,
  maRule: null,
};

set04.text = set04.content.text;
set04.animations = set04.content.animations;
set04.maRule = set04.content.maRule;

export default set04;
