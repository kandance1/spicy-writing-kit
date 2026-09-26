#!/usr/bin/env bash
# spicy-writing-kit installer
# 用法：
#   ./install.sh /path/to/your/project          # 複製模式（預設）
#   ./install.sh --link /path/to/your/project   # symlink 模式（改 kit 即全專案生效）
# 行為：
#   - 把 skills/ 下所有 skill 裝進 <project>/.claude/skills/
#   - 目標專案沒有 CLAUDE.md / AGENTS.md / GEMINI.md 時，放入入口檔（絕不覆蓋既有檔案）
set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="copy"

if [[ "${1:-}" == "--link" ]]; then
  MODE="link"
  shift
fi

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "用法: $0 [--link] /path/to/your/project" >&2
  exit 1
fi
if [[ ! -d "$TARGET" ]]; then
  echo "錯誤: 目標目錄不存在: $TARGET" >&2
  exit 1
fi
TARGET="$(cd "$TARGET" && pwd)"

echo "== spicy-writing-kit -> $TARGET (mode: $MODE) =="

mkdir -p "$TARGET/.claude/skills"

for skill_dir in "$KIT_DIR"/skills/*/; do
  name="$(basename "$skill_dir")"
  dest="$TARGET/.claude/skills/$name"
  if [[ -e "$dest" || -L "$dest" ]]; then
    echo "  skip skill  $name（已存在，未覆蓋）"
    continue
  fi
  if [[ "$MODE" == "link" ]]; then
    ln -s "$skill_dir" "$dest"
    echo "  link skill  $name"
  else
    cp -R "$skill_dir" "$dest"
    echo "  copy skill  $name"
  fi
done

for entry in AGENTS.md GEMINI.md; do
  if [[ -e "$TARGET/$entry" ]]; then
    echo "  skip entry  $entry（已存在，未覆蓋）"
  else
    cp "$KIT_DIR/$entry" "$TARGET/$entry"
    echo "  add  entry  $entry"
  fi
done

# CLAUDE.md：專案通常有自己的，只在完全沒有時放一份最小入口
if [[ -e "$TARGET/CLAUDE.md" ]]; then
  echo "  skip entry  CLAUDE.md（已存在——skills 已裝進 .claude/skills/，會自動被 Claude Code 發現）"
else
  cat > "$TARGET/CLAUDE.md" <<'EOF'
# CLAUDE.md

This project uses the spicy-writing-kit. Writing skills live in `.claude/skills/`
(`spicy-roleplay` is the base voice; `scene-*` are pairing templates). Invoke
`spicy-roleplay` (or let it auto-trigger) whenever writing or continuing a scene.
All content is fictional; all characters are adults (18+).
EOF
  echo "  add  entry  CLAUDE.md（最小入口）"
fi

echo "== 完成 =="
