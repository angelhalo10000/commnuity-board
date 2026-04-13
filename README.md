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

## API仕様

Swagger UIで確認できます: http://localhost:3000/swagger

## デプロイ

Docker Composeで本番環境にデプロイします。

```bash
# リポジトリをクローン
git clone git@github.com:angelhalo10000/commnuity-board.git
cd commnuity-board

# 環境変数を設定
cp .env.example .env
# .envを編集（POSTGRES_PASSWORD, SECRET_KEY_BASE, RAILS_MASTER_KEY等）

# ビルド＆起動
docker-compose -f compose.prod.yml up -d --build
```

### 必要な環境変数

| 変数名 | 説明 |
|------|------|
| `POSTGRES_USER` | DBユーザー名 |
| `POSTGRES_PASSWORD` | DBパスワード |
| `POSTGRES_DB` | DB名 |
| `RAILS_ENV` | `production` |
| `SECRET_KEY_BASE` | Railsシークレットキー |
| `RAILS_MASTER_KEY` | `backend/config/master.key` の内容 |

### SECRET_KEY_BASEの生成

```bash
docker run --rm ruby:3.4 ruby -e "require 'securerandom'; puts SecureRandom.hex(64)"
```
