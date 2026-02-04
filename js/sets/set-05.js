// js/sets/set-05.js
const set05 = {
  id: "set-05",
  theme: "theme-05",

  description: {
    image: "img/set-05.png", alt: "セット5 説明",
    animation: { type: "none", options: {} },
  },

  content: {
    text: "無意識に求めるもの、\nそれは何だろうか。",
    animations: [
      { id: "f-still", type: "still", label: "揺れる" },
      { id: "f-still", type: "still", label: "跳ねる" },
      { id: "f-still", type: "still", label: "点滅" },
    ],
    maRule: null,
  },

  text: null,
  animations: null,
  maRule: null,
};

set05.text = set05.content.text;
set05.animations = set05.content.animations;
set05.maRule = set05.content.maRule;

export default set05;
