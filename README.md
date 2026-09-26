# Spicy Writing Kit

協作小說寫作規範套件：「Fox」文學聲線基底 ＋ 文體範本。角色與配對設定不隨 kit 發布——那是作者的 IP，留在本機自建 scene-* 掛載。純 Markdown、零依賴，可安裝進任何專案，支援 Claude Code、Codex、Antigravity（Gemini 系）等工具。

> 套件含成人場景的筆法模組。一切內容皆為虛構，涉及親密描寫的角色皆為成年人（18+）——這是全套件唯一不可動搖的硬規則。實際輸出的尺度由使用者的文本與所用平台的政策決定。

## 內容

```
skills/
├── spicy-roleplay/        基底 skill：聲線、床戲筆法、anti-slop 規則
│   ├── SKILL.md           （權威版，蒸餾自 references/）
│   └── references/        原始草稿：fox.md、spicy-5.md 等，按需查閱
├── style-*/               文體範本（不含角色，可疊加在任何配對上）
└── scene-*/               場景範本掛載點：kit 不附角色，範本由使用者自建
AGENTS.md                  Codex／Antigravity 入口（內嵌蒸餾版規範）
GEMINI.md                  Gemini 系入口（轉指 AGENTS.md）
CLAUDE.md                  本 repo 的 Claude Code 說明
.claude-plugin/            Claude Code plugin／marketplace 資訊清單
install.sh                 安裝腳本
```

## 安裝

### Claude Code — 方式一：Plugin（推薦）

```bash
# 在任何 Claude Code session 裡：
/plugin marketplace add <你的帳號>/spicy-writing-kit
/plugin install spicy-writing-kit
```

### Claude Code — 方式二：安裝腳本

```bash
git clone git@github.com:<你的帳號>/spicy-writing-kit.git
./spicy-writing-kit/install.sh /path/to/your/project        # 複製
./spicy-writing-kit/install.sh --link /path/to/your/project # symlink，kit 更新即生效
```

### Codex / Antigravity

跑同一個 `install.sh` 即可——它會在目標專案放入 `AGENTS.md`（Codex、Antigravity、Cursor 等通用）與 `GEMINI.md`。這些工具沒有 skill 觸發機制，蒸餾版規範直接內嵌在 AGENTS.md 裡，場景範本靠檔案指路。

## 各工具行為差異

| | Claude Code | Codex / Antigravity |
|---|---|---|
| 載入方式 | skill 觸發時載入，references 按需讀 | AGENTS.md 開場全文載入 |
| 場景範本（自建） | `scene-*` skill 直接指名觸發 | 提到配對名時模型自行讀 `.claude/skills/scene-*/SKILL.md` |
| 生效粒度 | 精準、省 context | 粗放、吃固定 context |

**誠實提醒**：本套件搬運的是「指令」，不是模型的配合度。成人內容在各家模型上的政策不同，某些工具可能拒寫或自動降級——那是平台政策，不是 kit 能解的。

## 維護規則

- `skills/spicy-roleplay/SKILL.md` 是唯一事實來源；改了它，記得同步 `AGENTS.md` 的蒸餾段落。
- 新增場景範本照既有格式：frontmatter、`[[spicy-roleplay]]` 回鏈、只裝該配對的骨架、重申虛構成年角色。
- 上游工作副本在作者本機的 `roleplay/spicy`；kit 與上游的同步是手動的，改哪邊都要記得帶上另一邊。
