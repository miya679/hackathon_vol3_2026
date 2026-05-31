/**
 * Firebase Auth のエラーコードを日本語メッセージに変換する
 * @param {unknown} err
 */
export function getAuthErrorMessage(err) {
  const code =
    err && typeof err === "object" && "code" in err
      ? String(err.code)
      : "";

  const messages = {
    "auth/configuration-not-found":
      "Firebase Authentication が有効になっていません。Firebase Console → Authentication → ログイン方法 で、メール/パスワードと Google を有効にしてください。",
    "auth/popup-closed-by-user":
      "ログイン画面が閉じられました。もう一度お試しください。",
    "auth/popup-blocked":
      "ポップアップがブロックされました。アドレスバー右の「ポップアップとリダイレクト」で localhost を許可し、再度お試しください。",
    "auth/cancelled-popup-request":
      "複数のログインが同時に開かれました。画面を閉じて、もう一度ボタンからお試しください。",
    "auth/unauthorized-domain":
      "このドメインは Firebase に登録されていません。Console → Authentication → 設定 → 承認済みドメイン に localhost を追加してください。",
    "auth/account-exists-with-different-credential":
      "同じメールアドレスで別の方法（メール/パスワードなど）が登録済みです。その方法でログインしてください。",
    "auth/missing-initial-state":
      "ブラウザが認証用の一時データ（sessionStorage）を保持できませんでした。通常ウィンドウで開き、トラッキング防止や拡張機能をオフにしてから、再度お試しください。",
    "auth/invalid-email":
      "メールアドレスの形式が正しくありません（例: name@example.com）。",
    "auth/user-not-found":
      "このメールアドレスのアカウントは見つかりません。",
    "auth/wrong-password":
      "パスワードが正しくありません。",
    "auth/invalid-credential":
      "メールアドレスまたはパスワードが正しくありません。",
    "auth/email-already-in-use":
      "このメールアドレスはすでに登録されています。",
    "auth/weak-password":
      "パスワードは 6 文字以上で設定してください。",
    "auth/too-many-requests":
      "試行回数が多すぎます。しばらく待ってから再度お試しください。",
    "auth/network-request-failed":
      "ネットワークエラーです。接続を確認してください。",
  };

  if (messages[code]) return messages[code];

  if (err instanceof Error && err.message) {
    if (err.message.includes("missing initial state")) {
      return messages["auth/missing-initial-state"];
    }
    return err.message;
  }

  return "認証に失敗しました";
}

/**
 * @param {string} email
 */
export function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return "メールアドレスを入力してください";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "メールアドレスの形式が正しくありません（例: name@example.com）";
  }
  return null;
}
