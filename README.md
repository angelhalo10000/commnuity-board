# 電子自治会アプリ（Community Board）

自治会の情報共有をデジタル化するWebアプリケーションです。LINEの連絡網や紙の回覧板を置き換え、お知らせ・回覧板の配信・管理を行います。

## 機能概要

**会員・班長向け**
- お知らせの一覧表示・詳細閲覧・キーワード/月別検索
- 回覧板（PDF・画像）のインラインビューア
- パスワード認証（会員用・班長用の2段階）

**会長用管理画面**
- お知らせの作成・編集・削除・下書き保存・予約投稿
- 回覧板の作成・削除・下書き保存・予約配信
- パスワード・自治会名の設定変更

## 技術スタック

| レイヤー | 技術 |
|------|------|
| フロントエンド | React 19 / TypeScript / Vite |
| バックエンド | Ruby on Rails 8.1 (APIモード) |
| データベース | PostgreSQL 16 |
| ファイルストレージ | Active Storage (Cloudflare R2対応) |
| インフラ | Docker / Docker Compose / Nginx |

## クイックスタート

### 前提条件

- Docker & Docker Compose

### 起動手順

```bash
# リポジトリのクローン
git clone git@github.com:angelhalo10000/commnuity-board.git
cd commnuity-board

# 環境変数の設定
cp .env.example .env  # 必要に応じて編集

# 起動
docker compose up
```

| サービス | URL |
|------|-----|
| フロントエンド | http://localhost:5173 |
| バックエンド API | http://localhost:3000 |
| Swagger UI | http://localhost:3000/swagger |

## プロジェクト構成

```
community-board/
├── backend/          # Rails API
│   ├── app/
│   │   ├── controllers/api/  # APIエンドポイント（admin/ / viewer/）
│   │   ├── models/           # Organization, Notice, Circular, Block
│   │   └── views/swagger/    # Swagger UI
│   ├── db/                   # マイグレーション・シード
│   └── spec/                 # RSpecテスト
├── frontend/         # React + Vite
│   └── src/
│       ├── pages/            # 画面（admin/ / viewer/）
│       ├── components/       # 共通コンポーネント
│       ├── api/              # APIクライアント
│       └── contexts/         # 認証コンテキスト
├── compose.yml       # 開発用
├── compose.prod.yml  # 本番用
└── er.drawio         # ER図
```

## 開発

### バックエンド

```bash
# コンテナに入る
docker compose exec web bash

# テスト実行
bundle exec rspec
```

### フロントエンド

```bash
# コンテナに入る
docker compose exec front sh

# 型チェック
npx tsc --noEmit

# Lint
npm run lint
```

### 環境変数 `BACKEND_URL` について

`BACKEND_URL` は**開発環境専用**の変数です。Vite dev server のプロキシ先（`/api`, `/rails`）を指定するために使用します。

- 開発時: `compose.yml` が `http://web:3000` を渡し、Vite がバックエンドにリクエストを転送
- 本番時: 静的ファイルをnginxが配信し、プロキシは nginx の `proxy_pass` が担当するため不使用

## API仕様

Swagger UIで確認できます: http://localhost:3000/swagger

## デプロイ

`main` ブランチへのpushで GitHub Actions が自動実行されます。

1. Docker イメージをビルドして GitHub Container Registry (ghcr.io) にpush
2. SSH で本番サーバーに接続し、`docker compose pull` → `docker compose up -d`

手動デプロイは不要です。

### 初回サーバーセットアップ

```bash
# サーバー上で実施
git clone git@github.com:angelhalo10000/commnuity-board.git /opt/community-board
cd /opt/community-board

# 環境変数を設定
cp .env.example .env
# .envを編集（下記「必要な環境変数」参照）

# 起動
docker compose -f compose.prod.yml up -d
```

### 必要な環境変数（本番）

| 変数名 | 説明 |
|------|------|
| `POSTGRES_USER` | DBユーザー名 |
| `POSTGRES_PASSWORD` | DBパスワード |
| `POSTGRES_DB` | DB名 |
| `DATABASE_URL` | DB接続URL（上記から自動構築） |
| `SECRET_KEY_BASE` | Railsシークレットキー |
| `RAILS_MASTER_KEY` | `backend/config/master.key` の内容（Cloudflare R2の認証情報を含む） |

### GitHub Actions に必要なシークレット

| シークレット名 | 説明 |
|------|------|
| `DEPLOY_SSH_KEY` | 本番サーバーへのSSH秘密鍵 |

### SECRET_KEY_BASEの生成

```bash
docker run --rm ruby:3.4 ruby -e "require 'securerandom'; puts SecureRandom.hex(64)"
```

### Cloudflare R2（ファイルストレージ）

本番環境のファイルアップロードはCloudflare R2を使用します。認証情報はRails credentialsで管理しており、`RAILS_MASTER_KEY` で復号されます。

```bash
# credentialsの編集
docker compose exec web bin/rails credentials:edit
```

設定するキー:
```yaml
cloudflare_r2_production:
  access_key_id: ...
  secret_access_key: ...
  endpoint: https://<account_id>.r2.cloudflarestorage.com
  bucket: ...
```
