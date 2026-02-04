// js/sets/set-06.js
const set06 = {
  id: "set-06",
  theme: "theme-06",

  description: {
    image: "img/set-06.png",
    alt: "セット6 説明",
  },

  content: {
    text: "ここにメッセージを入力してください。",

    animations: [
      {
        id: "e-touch-shatter",
        type: "touch-shatter",
        label: "文字を触る",
      },
      {
        id: "e-shuffle",
        type: "shuffle",
        label: "文字を触る",
      },
      {
        id: "e-hold-to-read",
        type: "hold",
        label: "文字を触る",
      },
    ],
    maRule: null,
  },

  text: null,
  animations: null,
  maRule: null,
};

set06.text = set06.content.text;
set06.animations = set06.content.animations;
set06.maRule = set06.content.maRule;

export default set06;
