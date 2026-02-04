// js/sets/set-02.js
// Set 02 (B: 時間差)

const set02 = {
  id: "set-02",
  theme: "theme-02",

  description: {
    image: "img/set-02.png",
    alt: "セット2 説明",
  },

  content: {
    text: "昨日の夜は\n電車が混んでたよ。",

    animations: [
      {
        id: "b-delay",
        type: "delay",
        label: "出現",
      },

      // 末字から順に出現（読順の反転）
      {
        id: "b-appear-from-end",
        type: "delay",
        label: "末字から",
        options: {
          mode: "in",
          direction: "reverse",
          stepMs: 140,
          fadeMs: 600,
        },
      },

      // ★ ランダムに出現（秩序の崩れ）
      {
        id: "b-appear-random",
        type: "delay",
        label: "ランダム",
        options: {
          mode: "in",
          direction: "random",
          stepMs: 140,
          fadeMs: 600,
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

set02.text = set02.content.text;
set02.animations = set02.content.animations;
set02.maRule = set02.content.maRule;

export default set02;
