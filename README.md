# YoudaoTranslate | 有道翻译

Alfred 中英文自动翻译工作流

<p align="left">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/wensonsmith/YoudaoTranslate?style=social"/>
</p>

![screenshot](screenshots/screenshot_1.png)

## V4.0.1 Update Notes

### Changelog

- **`runtime/txiki` wrapper** — Added `run` subcommand for txiki.js v26.6.0+ CLI compatibility; added binary existence check to prevent premature exit
- **`src/runtime.ts`** — Updated `getEnv()` to support txiki.js v26.6.0's new `tjs.env` object API (replaces the removed `tjs.getenv()` function)

### Problem

The V3 release bundled a txiki.js runtime compiled for x86_64 only. On Apple Silicon (M1/M2/M3/M4) Macs without Rosetta 2, Alfred fails with:

```
bad CPU type in executable: txiki
```

V4 resolved this with a multi-architecture runtime and automatic CPU detection. V4.0.1 fixes two breaking changes introduced in txiki.js v26.6.0: the new `run` subcommand requirement and the `tjs.getenv()` → `tjs.env` API migration.

### Solution

**Core principle:** no external dependencies, same "download and go" experience as V3, now working on both Intel and Apple Silicon Macs.

The approach:

1. **Dual-architecture txiki binaries** — matching arm64 and x86_64 txiki.js runtimes are downloaded automatically at build time
2. **Shell wrapper with auto-detection** — the original `runtime/txiki` binary is replaced with a shell script that picks the right binary based on `uname -m`
3. **Node.js fallback** — if neither native binary is available, falls back to system Node.js

### Normal Execution Flow

Users download the Release package (with both txiki binaries baked in), double-click to import into Alfred, and it just works:

```
User types yd hello
        │
        ▼
  runtime/txiki (shell wrapper)
        │
   uname -m detection
   ┌────┴────┐
  arm64    x86_64
    │         │
    ▼         ▼
txiki-arm64  txiki-x86_64     ← same version, auto-downloaded at build
  run exec    run exec
    │         │
    └────┬────┘
         │
         ▼
  Translation returned to Alfred
```

### Fallback Strategy

The shell wrapper falls back to system Node.js in two scenarios:

1. **Running from source** — repository cloned but `npm run build` hasn't been executed yet, no txiki binaries in `runtime/`
2. **Unknown CPU architecture** — a future architecture where `uname -m` is neither arm64 nor x86_64

Fallback chain:

```
runtime/txiki (shell wrapper)
        │
   uname -m detection
        │
   binary missing or arch mismatch
        │
        ▼
  command -v node check
   ┌────┴────┐
  found     not found
    │          │
    ▼          ▼
node exec   error message
           exit code 1
```

### User Impact

**Zero.** No Rosetta 2, no Node.js, no extra configuration needed. Download → double-click to import → type `yd hello` → translated.

## 特性

- **无系统环境依赖** — 自带多架构 [txiki.js](https://github.com/saghul/txiki.js) 运行时，arm64 / x86_64 自适应
- **中英文自动互翻** — 支持 `CamelCase` 驼峰短语、多语言识别
- **多平台 API** — 支持有道翻译、百度翻译
- **快捷键翻译** — 双击 `⌥ Alt` 翻译选中内容
- **英文发音** — `⌘ Enter` 本地发音，`⌥ Enter` 在线语音
- **回车复制** — `↩︎ Enter` 复制翻译结果
- **网页预览** — `⇧ Shift` 预览有道网页

## 下载安装

- [GitHub Releases 下载](https://github.com/BernaLiuDev/YoudaoTranslator/releases)

## 配置

1. 注册[有道智云](https://ai.youdao.com/) 帐号，创建翻译服务和应用，获取 appKey 和 secret
2. 导入 Workflow 后，点击右上角 `[x]` 填入 Key 和 Secret

## 致谢

本项目基于 [wensonsmith/YoudaoTranslator](https://github.com/wensonsmith/YoudaoTranslator)（V3，3469 stars）。

### 原作者

<a href="https://iwenson.com"><img src="https://avatars.githubusercontent.com/u/2544185?s=80&v=4" height="50"/></a>
<a href="https://blog.zthxxx.me"><img src="https://avatars.githubusercontent.com/u/15135943?s=80&v=4" height="50"/></a>

## License

MIT
