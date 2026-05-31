# Firebase / Firestore 接続手順

## 接続の切り替え

| モード | `REACT_APP_USE_FIREBASE_EMULATOR` | 接続先 |
|--------|-----------------------------------|--------|
| 開発（Emulator） | `true` | ローカル `localhost:8080` |
| 本番（クラウド） | `false` | Firebase プロジェクトの Firestore |

設定は `frontend/src/lib/firebase.js` が `.env` を読みます。

---

## 本番 Firestore に接続する

### 1. Firebase Console でプロジェクト作成

1. https://console.firebase.google.com/
2. プロジェクトを追加
3. **Firestore Database** を作成（ロケーションを選択）
4. **Authentication** を有効化（ログイン機能を使う場合は必須）
   - **Authentication** → **ログイン方法** → **メール/パスワード** を **有効** にする
   - **Google** も **有効** にする（Google ログイン用）
   - **Authentication** → **設定** → **承認済みドメイン** に `localhost` があるか確認
   - 有効にしないと `auth/configuration-not-found` エラーになります

### 2. Web アプリを登録して設定値を取得

1. プロジェクト設定（歯車）→ **マイアプリ** → **</> Web**
2. 表示される `firebaseConfig` の値をコピー

### 3. `.env` を作成

```powershell
cd c:\hakkason\task
copy .env.example .env
```

`.env` を編集（本番用の例）:

```env
REACT_APP_USE_FIREBASE_EMULATOR=false
REACT_APP_FIREBASE_PROJECT_ID=あなたのプロジェクトID
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=あなたのプロジェクトID.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=あなたのプロジェクトID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=1:...:web:...
```

**Emulator 用の行は削除するか、コメントアウト:**

```env
# REACT_APP_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
# REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
```

### 4. 起動

**ローカルで React のみ（推奨・本番接続の確認）**

```powershell
cd frontend
npm install
npm start
```

ブラウザの開発者ツールコンソールに `[Firebase] Cloud Firestore` と出ればクラウド接続です。

**Docker で起動する場合**

```powershell
docker compose up --build
```

`.env` の `REACT_APP_USE_FIREBASE_EMULATOR=false` が `web` サービスに渡ります。

### 5. 動作確認

1. http://localhost:3000/progress/record を開く
2. Firebase Console → **Firestore** で `progresses` にドキュメントが増えるか確認
3. または Console から先に `texts` を1件作成し、画面のドロップダウンに表示されるか確認

---

## Emulator で開発する（従来どおり）

`.env`:

```env
REACT_APP_USE_FIREBASE_EMULATOR=true
REACT_APP_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
```

```powershell
docker compose up --build
```

- Emulator UI: http://localhost:4000
- コンソール: `[Firebase] Emulator mode`

---

## Firestore フィールド（進捗・教材）

### `texts`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `text_name` | string | 教材名 |
| `start_page` | number | 教材の先頭ページ |
| `end_page` | number | 教材の末尾ページ |
| `text_type`, `user_id` | string | 任意 |

### `progresses`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `text_id` | string | 教材ドキュメント ID |
| `page_start`, `page_end` | number | その記録で学習したページ範囲（両端込み） |
| `labels` | array of string | 任意（例: `["微分","復習"]`） |
| `updated_at` | timestamp | 更新時刻 |

**廃止**: `text_range`（texts）、`progress_page`（progresses）は使いません。既存ドキュメントに残っていてもアプリ側では無視します。

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| 教材が取得できない | Console / Emulator に `texts` があるか確認（`text_name`, `start_page`, `end_page`） |
| 本番なのに Emulator に繋がる | `REACT_APP_USE_FIREBASE_EMULATOR=false`、Emulator ホストを削除 |
| 変更が反映されない | `docker compose up --build` で web を再ビルド |
| Permission denied | Firestore Rules を確認（開発中はテストモード or ルール緩和） |
| `auth/configuration-not-found` | **Authentication** → **ログイン方法** で **メール/パスワード** と **Google** を有効化 |
| Google ログインで `unauthorized-domain` | **Authentication** → **設定** → **承認済みドメイン** に `localhost` を追加 |
| `missing initial state` | （旧）リダイレクト認証で発生しやすい。本アプリは **Google はポップアップのみ**。通常ウィンドウ・ポップアップ許可・Cookie 許可を確認 |
| メールが `fuharu` のように通らない | `name@example.com` 形式で入力（`@` とドメインが必要） |

`.env` は **Git にコミットしない**（`.gitignore` 済み）。
