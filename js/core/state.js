// js/core/state.js
// 全体状態管理（次ステップで title / description / content の画面切替に使う）

export const PHASES = {
  TITLE: "title",
  DESCRIPTION: "description",
  CONTENT: "content",
};

export const state = {
  // セット（0 = set-01）
  currentSetIndex: 0,

  // セット本文内のアニメ（carousel対象）
  currentAnimationIndex: 0,

  // 画面フェーズ（タイトル未実装のため現状は content を初期値にする）
  // タイトル画面を実装したら初期値を PHASES.TITLE に変更する
  currentPhase: PHASES.CONTENT,

  // UI操作ロック
  isLocked: false,

  // デバッグ
  DEBUG: false,
};
