# Contributing

Thanks for contributing! 以下はこのリポジトリで作業を始めるときの最低限のルールです。

## ブランチ作成の手順（必須）

常に main の最新をベースに作業ブランチを作成してください。例:

```bash
git switch main
git pull
git checkout -b feat/your-feature-name
```

作業完了後はリモートへ push して Pull Request を作成してください。

## Pull Request の説明

- PR 作成時はこのリポジトリの `PULL_REQUEST_TEMPLATE.md` を使って、変更の目的・確認手順・チェックを明示してください。CI（`CI` ワークフロー）が必須チェックとして設定されています。

## コード品質

- `npm run lint` を実行して lint を通してから PR を作成してください。

## ブランチ命名ルール（推奨）

- 機能: `feat/xxx`
- 修正: `fix/xxx`
- ドキュメント: `docs/xxx`

## ブランチ作成を楽にするスクリプト

- `scripts/new-branch.sh <branch-name>` を使うと自動で `main` を pull して新しいブランチを作成します。
