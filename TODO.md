# 後で考える課題

## 年度での検索・絞り込み（解決済み）

- [x] 年度検索は実装しない（「年・月」絞り込みで代替）
- [x] 回覧板の年度管理はタイトルの工夫で対応（例：「【2025年度】市からのお知らせ」）

## 公開済みお知らせの編集・履歴管理（解決済み）

- [x] 公開後も編集可能（削除不要）
- [x] 内容は上書き保存（履歴管理なし）
- [x] 作成日時・更新日時を保存・表示する

## 配信対象の設計見直し

- [x] 班長用パスワードを別途設ける
  - 会員共通PW → 全員向けコンテンツを閲覧
  - 班長PW → 全員向け + 班長向けコンテンツを閲覧（包含）
  - サイト設定画面に「班長共通パスワード」項目を追加する
- [x] 班長向けコンテンツはトップページでバッジで視覚的に区別する
- [x] 配信対象の選択肢：「全員」「班長のみ」の2択に確定
  - 「班指定」は廃止
  - 班長→班員の連絡はMVPではLINEに任せる

## 本番サーバー改善

- [x] e2-micro → e2-small へのアップグレード（IPが34.57.254.23に変更）
- [x] 静的IPの固定
- [x] IPアドレス変更後のLet's Encrypt証明書再取得（34.57.254.23.nip.io）
- [ ] noticesクエリの複合インデックス追加 `(organization_id, status, target_type, published_at)`
- [ ] 検討: e2-microはDockerオーバーヘッドで運用に耐えなかった。ネイティブ構成（Rails/PostgreSQL直接インストール）にすればe2-microでも運用可能か？
- [ ] 検討: デプロイ方式をghcr.ioプル方式→本番サーバーでビルド方式に変更
  - 現在: GitHub Actions でビルド → ghcr.io にpush → 本番でpull
  - 変更後: GitHub Actions で git pull → docker compose up --build
  - メリット: ghcr.io不要、構成がシンプル
  - デメリット: ビルド時にサーバーのCPU/メモリを消費する（e2-smallで許容できるか要確認）
- [x] GCP予算アラート設定（$20超えで通知）
- [ ] 定期確認: e2-smallの課金額をGCPコンソールで月次チェック
  - 目安: e2-small (asia-northeast1) ≒ $14/月 + 静的IP (使用中は無料) + ディスク + 通信量
  - 確認先: GCP Console → お支払い → レポート

## UI改善（解決済み）

- [x] お知らせ本文をTipTapリッチエディタ対応（太字・斜体・見出し・リスト・リンク挿入）
  - HTMLテキスト編集との切り替え可能
  - 閲覧画面はDOMPurifyでサニタイズしてHTMLレンダリング

## Cloudflare R2対応の改善

- [ ] 検討: R2のクレデンシャルをRails credentialsから環境変数に移行
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY` などを `.env` + GitHub Secretsで管理

## Cloudflare R2対応（解決済み）

- [x] Cloudflareアカウントでバケット作成・APIトークン発行
- [x] `aws-sdk-s3` gemをGemfileに追加
- [x] `config/storage.yml` にR2設定を追加
- [x] `config/environments/production.rb` でActive StorageをR2に切り替え
- [x] Railsのcredentialsにアクセスキーを保存
- [x] 動作確認（ファイルアップロード・表示）
