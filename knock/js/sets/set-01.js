// js/sets/set-01.js
// Set 01 (A: 存在) - 基準テンプレ（説明1画面 → 本文1画面）
// 互換のため、旧キー（text / animations / maRule）も残しています。
// 次のステップで state に phase を追加したら description を描画対象にします。

const set01 = {
  id: "set-01",
  theme: "theme-01",

  // 1) 説明（1画面）
  description: {
    // 可読性優先：基本は静止 or 最小フェード
    image: "img/set-01.png",
    alt: "セット1 説明",
    // 現段階では未使用（次ステップで phase 描画に使う）
    animation: {
      type: "none", // "none" | "fade"
      options: {
        // type: "fade" のときに使う想定（未実装でもOK）
        durationMs: 450,
      },
    },
  },

  // 2) 本文（1画面）
  content: {
    text: "これからも\nよろしくね。",

    // 本文のみがカルーセル対象
    animations: [
      {
        id: "a-fade-in",
        type: "fade",
        label: "出現",
        // ★ややゆっくり
        options: { mode: "in", durationMs: 1600 },
      },
      {
        id: "a-fade-out",
        type: "fade",
        label: "消失",
        // ★ややゆっくり
        options: { mode: "out", durationMs: 1600 },
      },
      {
        id: "a-blink",
        type: "blink",
        label: "点滅",
        // ★0.5s おきに出現/消失（ON 0.5s + OFF 0.5s = 周期 1.0s）
        options: { intervalMs: 500 },
      },
      {
        id: "a-breathe",
        type: "fade",
        label: "優しく点滅",
        options: { mode: "pulse", minOpacity: 0.2, maxOpacity: 1.0, durationMs: 1400 },
      },
    ],

    // 任意：間（ま）ルール等がある場合ここに置く（今は空でもOK）
    maRule: null,
  },

  // ---- 互換レイヤー（現状のエンジンを壊さないため） ----
  // 現状は set.text / set.animations を参照しているはずなので、content から供給します。
  // phase 実装後に削除できます。
  text: null,
  animations: null,
  maRule: null,
};

// 互換値を注入（content を正にして旧構造も満たす）
set01.text = set01.content.text;
set01.animations = set01.content.animations;
set01.maRule = set01.content.maRule;

export default set01;
